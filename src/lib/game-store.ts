import { useEffect, useSyncExternalStore } from "react";

type GameState = {
  score: number;
  solved: Record<string, boolean>;
  startedAt: Record<string, number>;
  /** roomId -> epoch ms timestamp until which the room stays locked */
  lockedUntil: Record<string, number>;
  /** Number of consecutive correct answers (resets on wrong). */
  streak: number;
  /** Bonus keys earned (each consumes to unlock a locked room). */
  keys: number;
  /** Player's name (from intro scanner). */
  playerName: string;
  /** Epoch ms when the player first started playing (set on first room start). */
  gameStartedAt: number;
  /** Epoch ms when player solved the last room (set once). */
  gameFinishedAt: number;
  /** Time bonus awarded at finish (added to score once). */
  timeBonus: number;
};

const STORAGE_KEY = "escape-game-state";

const initial: GameState = {
  score: 0,
  solved: {},
  startedAt: {},
  lockedUntil: {},
  streak: 0,
  keys: 0,
  playerName: "",
  gameStartedAt: 0,
  gameFinishedAt: 0,
  timeBonus: 0,
};

let state: GameState = initial;
let hydrated = false;

const listeners = new Set<() => void>();

function hydrateFromStorage() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    state = raw ? { ...initial, ...JSON.parse(raw) } : initial;
  } catch {
    state = initial;
  }
  listeners.forEach((l) => l());
}

function persist() {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  // Re-render every second so time-based lock countdowns stay live.
  return () => listeners.delete(l);
}

function getSnapshot() {
  return state;
}

function getServerSnapshot() {
  return initial;
}

// Global ticker — pings listeners every second so locked-room countdowns
// (which depend on Date.now()) re-render across the app.
if (typeof window !== "undefined") {
  setInterval(() => {
    if (listeners.size > 0) listeners.forEach((l) => l());
  }, 1000);
}

export function useGame() {
  useEffect(() => {
    hydrateFromStorage();
  }, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export const CORRECT_POINTS = 50;
export const WRONG_PENALTY = -20;
export const STREAK_FOR_KEY = 2;
/** How long a room stays locked after a wrong answer (ms). */
export const LOCK_DURATION_MS = 3 * 60 * 1000;

/** Time-bonus tuning: full bonus if finished within this many seconds. */
export const TIME_BONUS_MAX = 200;
export const TIME_BONUS_FULL_SECONDS = 5 * 60; // ≤ 5 min → full bonus
export const TIME_BONUS_ZERO_SECONDS = 25 * 60; // ≥ 25 min → no bonus

/** Compute time bonus given elapsed seconds. Linear between full and zero. */
export function computeTimeBonus(elapsedSeconds: number): number {
  if (elapsedSeconds <= TIME_BONUS_FULL_SECONDS) return TIME_BONUS_MAX;
  if (elapsedSeconds >= TIME_BONUS_ZERO_SECONDS) return 0;
  const span = TIME_BONUS_ZERO_SECONDS - TIME_BONUS_FULL_SECONDS;
  const overshoot = elapsedSeconds - TIME_BONUS_FULL_SECONDS;
  const ratio = 1 - overshoot / span;
  return Math.round(TIME_BONUS_MAX * ratio);
}

export const gameActions = {
  setPlayerName(name: string) {
    state = { ...state, playerName: name };
    persist();
  },
  startRoom(roomId: string) {
    const patch: Partial<GameState> = {};
    if (!state.startedAt[roomId]) {
      patch.startedAt = { ...state.startedAt, [roomId]: Date.now() };
    }
    if (!state.gameStartedAt) {
      patch.gameStartedAt = Date.now();
    }
    if (Object.keys(patch).length > 0) {
      state = { ...state, ...patch };
      persist();
    }
  },
  /** Returns delta points, key earned flag, and (if wrong) ms-timestamp when room reopens. */
  answer(
    roomId: string,
    correct: boolean,
  ): { delta: number; reopenAt?: number; keyEarned?: boolean } {
    if (state.solved[roomId]) return { delta: 0 };
    if (correct) {
      const delta = CORRECT_POINTS;
      const newStreak = state.streak + 1;
      const earnsKey = newStreak >= STREAK_FOR_KEY;
      const newSolved = { ...state.solved, [roomId]: true };

      // Detect game completion → award time bonus once.
      const totalRooms = Object.keys(newSolved).length; // count solved
      // We don't know rooms.length here without import-cycle risk; caller (UI) has rooms.
      // Instead: finalize via separate call. Keep gameFinishedAt unset here.

      state = {
        ...state,
        score: state.score + delta,
        solved: newSolved,
        streak: earnsKey ? 0 : newStreak,
        keys: earnsKey ? state.keys + 1 : state.keys,
      };
      // Mark finish time provisionally if every started room is solved AND
      // caller will call finalizeIfDone(totalRooms) right after. To stay simple,
      // we leave finish detection to the UI via finalizeIfDone().
      void totalRooms;
      persist();
      return { delta, keyEarned: earnsKey };
    } else {
      const delta = WRONG_PENALTY;
      const reopenAt = Date.now() + LOCK_DURATION_MS;
      state = {
        ...state,
        score: state.score + delta,
        streak: 0,
        lockedUntil: { ...state.lockedUntil, [roomId]: reopenAt },
        startedAt: { ...state.startedAt, [roomId]: 0 },
      };
      persist();
      return { delta, reopenAt };
    }
  },
  /**
   * Call after `answer()` when the UI knows the total number of rooms.
   * If all rooms are solved and we haven't recorded a finish yet, record
   * the finish time and award the time bonus.
   */
  finalizeIfDone(totalRooms: number) {
    if (state.gameFinishedAt) return;
    const solvedCount = Object.values(state.solved).filter(Boolean).length;
    if (solvedCount < totalRooms) return;
    const finishedAt = Date.now();
    const startedAt = state.gameStartedAt || finishedAt;
    const elapsedSeconds = Math.max(0, Math.round((finishedAt - startedAt) / 1000));
    const bonus = computeTimeBonus(elapsedSeconds);
    state = {
      ...state,
      gameFinishedAt: finishedAt,
      timeBonus: bonus,
      score: state.score + bonus,
    };
    persist();
  },
  /** Spend a bonus key to immediately unlock a locked room. Returns true if used. */
  useKey(roomId: string): boolean {
    if (state.keys <= 0) return false;
    if (!this.isLocked(roomId)) return false;
    const newLocked = { ...state.lockedUntil };
    delete newLocked[roomId];
    state = { ...state, keys: state.keys - 1, lockedUntil: newLocked };
    persist();
    return true;
  },
  isLocked(roomId: string): boolean {
    const until = state.lockedUntil[roomId] ?? 0;
    return Date.now() < until;
  },
  /** Seconds remaining until the room unlocks (0 if not locked). */
  secondsUntilUnlock(roomId: string): number {
    const until = state.lockedUntil[roomId] ?? 0;
    const ms = until - Date.now();
    return ms > 0 ? Math.ceil(ms / 1000) : 0;
  },
  /** Total elapsed game seconds (from first room start to finish, or now). */
  elapsedSeconds(): number {
    if (!state.gameStartedAt) return 0;
    const end = state.gameFinishedAt || Date.now();
    return Math.max(0, Math.round((end - state.gameStartedAt) / 1000));
  },
  reset() {
    state = { ...initial };
    persist();
  },
};
