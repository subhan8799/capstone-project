import { useQuery } from '@tanstack/react-query';
import { useDebounce } from './useDebounce';
import { searchMovies } from '../services/movieService';

export function useSearchMovies(query: string) {
  const debouncedQuery = useDebounce(query, 250);

  return useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => searchMovies(debouncedQuery),
    enabled: debouncedQuery.trim().length > 1,
    staleTime: 1000 * 60,
  });
}