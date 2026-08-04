import type { Movie } from '../../types/movie';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { MovieCard } from './MovieCard';

export function MovieGrid({ movies, loading }: { movies: Movie[]; loading?: boolean }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, index) => (
          <LoadingSkeleton key={index} className="h-72 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}