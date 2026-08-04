import { useParams } from 'react-router-dom';
import { Calendar, Clock3, Play, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FavoriteButton } from '../components/movies/FavoriteButton';
import { MovieSlider } from '../components/movies/MovieSlider';
import { useMovieDetails, useRelatedMovies } from '../hooks/useMovieDetails';
import { pushContinueWatchingId } from '../utils/localStorage';
import { useEffect } from 'react';
import { Button } from '../components/common/Button';
import { toImageUrl } from '../utils/image';

export function MovieDetailsPage() {
  const { id } = useParams();
  const movieId = Number(id);
  const detailsQuery = useMovieDetails(movieId);
  const relatedQuery = useRelatedMovies(movieId);

  useEffect(() => {
    if (movieId) {
      pushContinueWatchingId(movieId);
    }
  }, [movieId]);

  if (detailsQuery.isLoading) {
    return <div className="skeleton h-[65vh] w-full rounded-3xl" />;
  }

  if (detailsQuery.error instanceof Error) {
    return (
      <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 p-5 text-rose-200">
        Unable to load this movie right now: {detailsQuery.error.message}
      </div>
    );
  }

  if (!detailsQuery.data) {
    return (
      <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 p-5 text-amber-200">
        Movie details are unavailable right now.
      </div>
    );
  }

  const movie = detailsQuery.data;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-white/10">
        <img
          src={toImageUrl(movie.backdropPath || movie.posterPath, 'https://placehold.co/1280x720/111827/e5e7eb?text=MiniFlix')}
          alt={movie.title}
          className="h-[420px] w-full object-cover"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent" />
        <div className="absolute inset-0 flex max-w-3xl flex-col justify-end gap-4 p-7">
          <h1 className="text-3xl font-bold sm:text-5xl">{movie.title}</h1>
          <p className="line-clamp-3 text-slate-200">{movie.overview}</p>
          <div className="flex flex-wrap gap-4 text-sm text-slate-200">
            <span className="inline-flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400" /> {movie.rating.toFixed(1)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-4 w-4" /> {movie.releaseDate || 'Unknown'}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock3 className="h-4 w-4" /> {movie.runtime ? `${movie.runtime} min` : 'Runtime N/A'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FavoriteButton movieId={movie.id} />
            <span className="text-sm text-slate-200">Save to favorites</span>
          </div>
          <div>
            <Link to={`/watch/${movie.id}`}>
              <Button className="gap-2 bg-white text-black shadow-none hover:bg-slate-100">
                <Play className="h-4 w-4" /> Watch Trailer
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {movie.genres?.map((genre) => (
              <span key={genre.id} className="rounded-full bg-white/15 px-3 py-1 text-xs">
                {genre.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {relatedQuery.error instanceof Error ? (
        <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Related titles are temporarily unavailable: {relatedQuery.error.message}
        </div>
      ) : null}

      <MovieSlider title="Related Movies" movies={relatedQuery.data} loading={relatedQuery.isLoading} />
    </div>
  );
}