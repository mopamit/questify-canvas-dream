import { useSyncExternalStore } from "react";

type GameState = {
  score: number;
  solved: Record<string, boolean>;
  startedAt: Record<string, number>;
};

const STORAGE_KEY = "escape-game-state";

const initial: GameState = { score: 0, solved: {}, startedAt: {} };

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
  answer(roomId: string, correct: boolean): number {
    if (state.solved[roomId]) return 0;
    let delta = 0;
    if (correct) {
      const started = state.startedAt[roomId] ?? Date.now();
      const seconds = (Date.now() - started) / 1000;
      // 100 points fast, decaying to 20 minimum after 60s
      delta = Math.max(20, Math.round(100 - seconds * 1.3));
      state = {
        ...state,
        score: state.score + delta,
        solved: { ...state.solved, [roomId]: true },
      };
    } else {
      delta = -15;
      state = { ...state, score: state.score + delta };
    }
    persist();
    return delta;
  },
  reset() {
    state = initial;
    persist();
  },
};
