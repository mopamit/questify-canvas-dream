import { useEffect, useSyncExternalStore } from "react";

type GameState = {
  score: number;
  solved: Record<string, boolean>;
  startedAt: Record<string, number>;
  /** Global counter — increments on every wrong answer. Used as "turn". */
  turn: number;
  /** roomId -> turn number until which the room stays locked (inclusive: locked while turn < lockedUntil) */
  lockedUntil: Record<string, number>;
  /** Number of consecutive correct answers (resets on wrong). */
  streak: number;
  /** Bonus keys earned (each consumes to unlock a locked room). */
  keys: number;
  /** Player's name (from intro scanner). */
  playerName: string;
};

const STORAGE_KEY = "escape-game-state";

const initial: GameState = {
  score: 0,
  solved: {},
  startedAt: {},
  turn: 0,
  lockedUntil: {},
  streak: 0,
  keys: 0,
  playerName: "",
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
  return () => listeners.delete(l);
}

function getSnapshot() {
  return state;
}

function getServerSnapshot() {
  return initial;
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
export const LOCK_TURNS = 2;

export const gameActions = {
  setPlayerName(name: string) {
    state = { ...state, playerName: name };
    persist();
  },
  startRoom(roomId: string) {
    if (!state.startedAt[roomId]) {
      state = { ...state, startedAt: { ...state.startedAt, [roomId]: Date.now() } };
      persist();
    }
  },
  /** Returns delta points, key earned flag, and (if wrong) the turn number when the room reopens. */
  answer(
    roomId: string,
    correct: boolean,
  ): { delta: number; reopenAtTurn?: number; keyEarned?: boolean } {
    if (state.solved[roomId]) return { delta: 0 };
    if (correct) {
      const delta = CORRECT_POINTS;
      const newStreak = state.streak + 1;
      const earnsKey = newStreak >= STREAK_FOR_KEY;
      state = {
        ...state,
        score: state.score + delta,
        solved: { ...state.solved, [roomId]: true },
        streak: earnsKey ? 0 : newStreak,
        keys: earnsKey ? state.keys + 1 : state.keys,
      };
      persist();
      return { delta, keyEarned: earnsKey };
    } else {
      const delta = WRONG_PENALTY;
      const newTurn = state.turn + 1;
      const reopenAtTurn = newTurn + LOCK_TURNS;
      state = {
        ...state,
        score: state.score + delta,
        turn: newTurn,
        streak: 0,
        lockedUntil: { ...state.lockedUntil, [roomId]: reopenAtTurn },
        startedAt: { ...state.startedAt, [roomId]: 0 },
      };
      persist();
      return { delta, reopenAtTurn };
    }
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
    return state.turn < until;
  },
  turnsUntilUnlock(roomId: string): number {
    const until = state.lockedUntil[roomId] ?? 0;
    return Math.max(0, until - state.turn);
  },
  reset() {
    state = { ...initial };
    persist();
  },
};
