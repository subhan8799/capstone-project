import { useQuery } from '@tanstack/react-query';
import { fetchMovieDetails, fetchMovieTrailer, fetchRelatedMovies } from '../services/movieService';

export function useMovieDetails(movieId?: number) {
  const hasValidMovieId = Number.isFinite(movieId) && Number(movieId) > 0;

  return useQuery({
    queryKey: ['movie', movieId],
    queryFn: () => fetchMovieDetails(movieId as number),
    enabled: hasValidMovieId,
  });
}

export function useRelatedMovies(movieId?: number) {
  const hasValidMovieId = Number.isFinite(movieId) && Number(movieId) > 0;

  return useQuery({
    queryKey: ['movie', movieId, 'related'],
    queryFn: () => fetchRelatedMovies(movieId as number),
    enabled: hasValidMovieId,
  });
}

export function useMovieTrailer(movieId?: number) {
  const hasValidMovieId = Number.isFinite(movieId) && Number(movieId) > 0;

  return useQuery({
    queryKey: ['movie', movieId, 'trailer'],
    queryFn: () => fetchMovieTrailer(movieId as number),
    enabled: hasValidMovieId,
    staleTime: 1000 * 60 * 30,
  });
}