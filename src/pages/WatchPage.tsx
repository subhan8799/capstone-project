import { AlertCircle, ArrowLeft, PlayCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { useMovieDetails, useMovieTrailer } from '../hooks/useMovieDetails';

function buildTrailerEmbedUrl(trailerValue: string | null) {
  if (!trailerValue) return null;
  if (trailerValue.startsWith('search:')) {
    const query = trailerValue.slice('search:'.length);
    return `https://www.youtube.com/embed?listType=search&list=${query}&autoplay=1&rel=0`;
  }
  return `https://www.youtube.com/embed/${trailerValue}?autoplay=1&rel=0&modestbranding=1`;
}

export function WatchPage() {
  const { id } = useParams();
  const movieId = Number(id);

  const detailsQuery = useMovieDetails(movieId);
  const trailerQuery = useMovieTrailer(movieId);

  if (detailsQuery.isLoading || trailerQuery.isLoading) {
    return <div className="skeleton h-[70vh] w-full rounded-3xl" />;
  }

  if (detailsQuery.error instanceof Error) {
    return (
      <section className="space-y-4">
        <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 p-5 text-rose-200">
          Unable to load this title right now: {detailsQuery.error.message}
        </div>
        <Link to="/">
          <Button variant="secondary" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Button>
        </Link>
      </section>
    );
  }

  if (!detailsQuery.data) {
    return (
      <section className="space-y-4">
        <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 p-5 text-amber-200">
          Movie playback is unavailable because this title could not be loaded.
        </div>
        <Link to="/">
          <Button variant="secondary" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Button>
        </Link>
      </section>
    );
  }

  const movie = detailsQuery.data;
  const trailerKey = trailerQuery.data ?? null;
  const trailerEmbedUrl = buildTrailerEmbedUrl(trailerKey);

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brand-200">Now Watching</p>
          <h1 className="text-2xl font-semibold sm:text-3xl">{movie?.title ?? 'Movie'}</h1>
        </div>
        <Link to={movie ? `/movie/${movie.id}` : '/'}>
          <Button variant="secondary" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to details
          </Button>
        </Link>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/15 bg-black/60 shadow-xl">
        {trailerEmbedUrl ? (
          <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
            <iframe
              title={`${movie?.title ?? 'Movie'} trailer`}
              src={trailerEmbedUrl}
              className="absolute left-0 top-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="flex min-h-[55vh] flex-col items-center justify-center gap-3 p-6 text-center">
            <PlayCircle className="h-14 w-14 text-slate-300" />
            <h2 className="text-xl font-semibold">Trailer unavailable</h2>
            <p className="max-w-xl text-sm text-slate-300">
              This title does not have a playable YouTube trailer at the moment. Try another movie from the home page.
            </p>
          </div>
        )}
      </div>

      {trailerQuery.error instanceof Error ? (
        <div className="inline-flex items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
          <AlertCircle className="h-4 w-4" /> Trailer service warning: {trailerQuery.error.message}
        </div>
      ) : null}

      {movie?.overview ? <p className="max-w-4xl text-sm text-slate-300">{movie.overview}</p> : null}
    </section>
  );
}
