const FAVORITES_KEY = 'miniflix-favorites';
const CONTINUE_WATCHING_KEY = 'miniflix-continue-watching';

export function getStoredFavorites(): number[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch {
    return [];
  }
}

export function setStoredFavorites(value: number[]): void {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(value));
}

export function getContinueWatchingIds(): number[] {
  try {
    const raw = localStorage.getItem(CONTINUE_WATCHING_KEY);
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch {
    return [];
  }
}

export function pushContinueWatchingId(movieId: number): void {
  const ids = getContinueWatchingIds().filter((id) => id !== movieId);
  ids.unshift(movieId);
  localStorage.setItem(CONTINUE_WATCHING_KEY, JSON.stringify(ids.slice(0, 12)));
}