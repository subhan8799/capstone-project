import { MovieSlider } from '../components/movies/MovieSlider';
import { useMovies } from '../hooks/useMovies';

export function MoviesPage() {
  const popularQuery = useMovies('popular');
  const topRatedQuery = useMovies('topRated');
  const actionQuery = useMovies('action');
  const comedyQuery = useMovies('comedy');
  const horrorQuery = useMovies('horror');
  const romanceQuery = useMovies('romance');

  return (
    <section className="space-y-8 pb-10">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-200">Movies</p>
        <h1 className="text-3xl font-semibold">Browse Movies</h1>
        <p className="text-sm text-slate-300">Discover blockbuster hits and timeless favorites.</p>
      </header>

      <MovieSlider title="Popular Movies" movies={popularQuery.data} loading={popularQuery.isLoading} />
      <MovieSlider title="Top Rated Movies" movies={topRatedQuery.data} loading={topRatedQuery.isLoading} />
      <MovieSlider title="Action Collection" movies={actionQuery.data} loading={actionQuery.isLoading} />
      <MovieSlider title="Comedy Collection" movies={comedyQuery.data} loading={comedyQuery.isLoading} />
      <MovieSlider title="Horror Collection" movies={horrorQuery.data} loading={horrorQuery.isLoading} />
      <MovieSlider title="Romance Collection" movies={romanceQuery.data} loading={romanceQuery.isLoading} />
    </section>
  );
}
