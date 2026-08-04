import { useQueries } from '@tanstack/react-query';
import { fetchMovieDetails } from '../services/movieService';
import { getContinueWatchingIds } from '../utils/localStorage';
import type { Movie } from '../types/movie';

export function useContinueWatching() {
  const ids = getContinueWatchingIds().slice(0, 10);
  const queries = useQueries({
    queries: ids.map((id) => ({
      queryKey: ['movie', id, 'continue'],
      queryFn: () => fetchMovieDetails(id),
      staleTime: 1000 * 60 * 10,
    })),
  });

  const movies = queries
    .map((query) => query.data)
    .filter((movie): movie is Movie => movie !== undefined);
  const isLoading = queries.some((query) => query.isLoading);

  return { movies, isLoading };
}