import type { Movie } from '../../types/movie';
import { MovieCard } from './MovieCard';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { ContentUnavailableState } from '../common/ContentUnavailableState';

interface MovieSliderProps {
  title: string;
  movies?: Movie[];
  loading?: boolean;
}

export function MovieSlider({ title, movies = [], loading }: MovieSliderProps) {
  const hasMovies = movies.length > 0;

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold sm:text-xl">{title}</h2>
      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 sm:gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => <LoadingSkeleton key={index} className="h-64 min-w-36 sm:h-72 sm:min-w-44" />)
          : movies.map((movie) => (
              <div key={movie.id} className="min-w-36 max-w-36 snap-start flex-shrink-0 sm:min-w-44 sm:max-w-44">
                <MovieCard movie={movie} />
              </div>
            ))}
      </div>
      {!loading && !hasMovies ? (
        <ContentUnavailableState
          compact
          title="This feature is coming soon"
          message="No titles are available in this section yet."
        />
      ) : null}
    </section>
  );
}