import { MovieSlider } from '../components/movies/MovieSlider';
import { useMovies } from '../hooks/useMovies';

export function TVShowsPage() {
  const trendingQuery = useMovies('trending');
  const recommendedQuery = useMovies('recommended');
  const documentaryQuery = useMovies('documentary');
  const sciFiQuery = useMovies('sciFi');

  return (
    <section className="space-y-8 pb-10">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-200">TV Shows</p>
        <h1 className="text-3xl font-semibold">Series and Stories</h1>
        <p className="text-sm text-slate-300">Binge-worthy picks updated dynamically from live catalog feeds.</p>
      </header>

      <MovieSlider title="Trending Series" movies={trendingQuery.data} loading={trendingQuery.isLoading} />
      <MovieSlider title="Recommended Series" movies={recommendedQuery.data} loading={recommendedQuery.isLoading} />
      <MovieSlider title="Documentary Series" movies={documentaryQuery.data} loading={documentaryQuery.isLoading} />
      <MovieSlider title="Sci-Fi Series" movies={sciFiQuery.data} loading={sciFiQuery.isLoading} />
    </section>
  );
}
