import { useSyncExternalStore } from "react";

type GameState = {
  score: number;
  solved: Record<string, boolean>;
  startedAt: Record<string, number>;
  /** Global counter — increments on every wrong answer. Used as "turn". */
  turn: number;
  /** roomId -> turn number until which the room stays locked (inclusive: locked while turn < lockedUntil) */
  lockedUntil: Record<string, number>;
};

const STORAGE_KEY = "escape-game-state";

const initial: GameState = {
  score: 0,
  solved: {},
  startedAt: {},
  turn: 0,
  lockedUntil: {},
};

let state: GameState = (() => {
  if (typeof window === "undefined") return initial;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...initial, ...JSON.parse(raw) } : initial;
  } catch {
    return initial;
  }
})();

const listeners = new Set<() => void>();

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
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export const gameActions = {
  startRoom(roomId: string) {
    if (!state.startedAt[roomId]) {
      state = { ...state, startedAt: { ...state.startedAt, [roomId]: Date.now() } };
      persist();
    }
  },
  /** Returns delta points and (if wrong) the turn number when the room reopens. */
  answer(roomId: string, correct: boolean): { delta: number; reopenAtTurn?: number } {
    if (state.solved[roomId]) return { delta: 0 };
    let delta = 0;
    if (correct) {
      const started = state.startedAt[roomId] ?? Date.now();
      const seconds = (Date.now() - started) / 1000;
      delta = Math.max(20, Math.round(100 - seconds * 1.3));
      state = {
        ...state,
        score: state.score + delta,
        solved: { ...state.solved, [roomId]: true },
      };
      persist();
      return { delta };
    } else {
      delta = -15;
      const newTurn = state.turn + 1;
      // Locked for 2 turns -> reopens once turn reaches newTurn + 2
      const reopenAtTurn = newTurn + 2;
      state = {
        ...state,
        score: state.score + delta,
        turn: newTurn,
        lockedUntil: { ...state.lockedUntil, [roomId]: reopenAtTurn },
        // Reset start time so timer is fresh next attempt
        startedAt: { ...state.startedAt, [roomId]: 0 },
      };
      persist();
      return { delta, reopenAtTurn };
    }
  },
  /** True if this room is currently locked (after a wrong answer). */
  isLocked(roomId: string): boolean {
    const until = state.lockedUntil[roomId] ?? 0;
    return state.turn < until;
  },
  /** How many turns until this room reopens (0 = open). */
  turnsUntilUnlock(roomId: string): number {
    const until = state.lockedUntil[roomId] ?? 0;
    return Math.max(0, until - state.turn);
  },
  reset() {
    state = initial;
    persist();
  },
};
