import { useSyncExternalStore } from 'react';

let currentTime = Date.now();
const listeners = new Set<() => void>();
let intervalId: ReturnType<typeof setInterval> | null = null;

function subscribe(callback: () => void) {
  listeners.add(callback);
  if (intervalId === null) {
    intervalId = setInterval(() => {
      currentTime = Date.now();
      listeners.forEach(l => l());
    }, 1000);
  }
  return () => {
    listeners.delete(callback);
    if (listeners.size === 0 && intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };
}

function getSnapshot() {
  return currentTime;
}

export function useNow(): number {
  return useSyncExternalStore(subscribe, getSnapshot);
}
