import { MovieSlider } from '../components/movies/MovieSlider';
import { useMovies } from '../hooks/useMovies';

export function NewPopularPage() {
  const nowPlayingQuery = useMovies('nowPlaying');
  const upcomingQuery = useMovies('upcoming');
  const popularQuery = useMovies('popular');
  const topRatedQuery = useMovies('topRated');

  return (
    <section className="space-y-8 pb-10">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-200">New & Popular</p>
        <h1 className="text-3xl font-semibold">Fresh Releases</h1>
        <p className="text-sm text-slate-300">See what is new, hot, and trending right now.</p>
      </header>

      <MovieSlider title="Now Playing" movies={nowPlayingQuery.data} loading={nowPlayingQuery.isLoading} />
      <MovieSlider title="Coming Soon" movies={upcomingQuery.data} loading={upcomingQuery.isLoading} />
      <MovieSlider title="Popular This Week" movies={popularQuery.data} loading={popularQuery.isLoading} />
      <MovieSlider title="Critically Acclaimed" movies={topRatedQuery.data} loading={topRatedQuery.isLoading} />
    </section>
  );
}
