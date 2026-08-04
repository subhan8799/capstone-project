import { useQuery } from '@tanstack/react-query';
import { fetchMoviesByCategory } from '../services/movieService';
import type { CategoryKey } from '../types/movie';

export function useMovies(category: CategoryKey) {
  return useQuery({
    queryKey: ['movies', category],
    queryFn: () => fetchMoviesByCategory(category),
    staleTime: 1000 * 60 * 10,
  });
}