import { useQuery } from '@tanstack/react-query';
import { fetchMovieDetails, fetchMovieTrailer, fetchRelatedMovies } from '../services/movieService';

export function useMovieDetails(movieId?: number) {
  return useQuery({
    queryKey: ['movie', movieId],
    queryFn: () => fetchMovieDetails(movieId as number),
    enabled: Boolean(movieId),
  });
}

export function useRelatedMovies(movieId?: number) {
  return useQuery({
    queryKey: ['movie', movieId, 'related'],
    queryFn: () => fetchRelatedMovies(movieId as number),
    enabled: Boolean(movieId),
  });
}

export function useMovieTrailer(movieId?: number) {
  return useQuery({
    queryKey: ['movie', movieId, 'trailer'],
    queryFn: () => fetchMovieTrailer(movieId as number),
    enabled: Boolean(movieId),
    staleTime: 1000 * 60 * 30,
  });
}