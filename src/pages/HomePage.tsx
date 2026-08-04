import { useMemo } from 'react';
import { HeroBanner } from '../components/movies/HeroBanner';
import { MovieSlider } from '../components/movies/MovieSlider';
import { SearchBar } from '../components/movies/SearchBar';
import { useMovies } from '../hooks/useMovies';
import { useContinueWatching } from '../hooks/useContinueWatching';
import { ContentUnavailableState } from '../components/common/ContentUnavailableState';

export function HomePage() {
  const trendingQuery = useMovies('trending');
  const popularQuery = useMovies('popular');
  const recommendedQuery = useMovies('recommended');
  const nowPlayingQuery = useMovies('nowPlaying');
  const upcomingQuery = useMovies('upcoming');
  const topRatedQuery = useMovies('topRated');
  const documentaryQuery = useMovies('documentary');
  const sciFiQuery = useMovies('sciFi');
  const actionQuery = useMovies('action');
  const comedyQuery = useMovies('comedy');
  const horrorQuery = useMovies('horror');
  const romanceQuery = useMovies('romance');
  const continueWatching = useContinueWatching();

  const featuredMovie = useMemo(() => trendingQuery.data?.[0], [trendingQuery.data]);
  const queryErrors = [
    trendingQuery.error,
    popularQuery.error,
    recommendedQuery.error,
    nowPlayingQuery.error,
    upcomingQuery.error,
    topRatedQuery.error,
    documentaryQuery.error,
    sciFiQuery.error,
    actionQuery.error,
    comedyQuery.error,
    horrorQuery.error,
    romanceQuery.error,
  ].filter((error): error is Error => error instanceof Error);

  const hasAnyMovieContent = Boolean(
    trendingQuery.data?.length ||
      popularQuery.data?.length ||
      recommendedQuery.data?.length ||
      nowPlayingQuery.data?.length ||
      upcomingQuery.data?.length ||
      topRatedQuery.data?.length ||
      documentaryQuery.data?.length ||
      sciFiQuery.data?.length ||
      actionQuery.data?.length ||
      comedyQuery.data?.length ||
      horrorQuery.data?.length ||
      romanceQuery.data?.length,
  );

  return (
    <div className="space-y-8 pb-8 sm:space-y-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="max-w-2xl text-2xl font-semibold leading-tight md:text-3xl">Unlimited films, trailers, and stories.</h1>
        <SearchBar />
      </div>

      {queryErrors.length && !hasAnyMovieContent ? (
        <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          Unable to load one or more movie sections. Verify TMDB credentials in `.env` (`VITE_TMDB_API_READ_ACCESS_TOKEN` or
          `VITE_TMDB_API_KEY`).
        </div>
      ) : null}

      {queryErrors.length && hasAnyMovieContent ? (
        <ContentUnavailableState
          compact
          title="This feature is coming soon"
          message="Some sections are temporarily unavailable while we refresh the catalog."
        />
      ) : null}

      <HeroBanner movie={featuredMovie} loading={trendingQuery.isLoading} />

      <MovieSlider title="Trending Now" movies={trendingQuery.data} loading={trendingQuery.isLoading} />
      <MovieSlider title="Recommended For You" movies={recommendedQuery.data} loading={recommendedQuery.isLoading} />
      <MovieSlider title="Now Playing" movies={nowPlayingQuery.data} loading={nowPlayingQuery.isLoading} />
      <MovieSlider title="Popular" movies={popularQuery.data} loading={popularQuery.isLoading} />
      <MovieSlider title="Coming Soon" movies={upcomingQuery.data} loading={upcomingQuery.isLoading} />
      <MovieSlider title="Continue Watching" movies={continueWatching.movies} loading={continueWatching.isLoading} />
      <MovieSlider title="Top Rated" movies={topRatedQuery.data} loading={topRatedQuery.isLoading} />
      <MovieSlider title="Sci-Fi Worlds" movies={sciFiQuery.data} loading={sciFiQuery.isLoading} />
      <MovieSlider title="Documentaries" movies={documentaryQuery.data} loading={documentaryQuery.isLoading} />
      <MovieSlider title="Action" movies={actionQuery.data} loading={actionQuery.isLoading} />
      <MovieSlider title="Comedy" movies={comedyQuery.data} loading={comedyQuery.isLoading} />
      <MovieSlider title="Horror" movies={horrorQuery.data} loading={horrorQuery.isLoading} />
      <MovieSlider title="Romance" movies={romanceQuery.data} loading={romanceQuery.isLoading} />
    </div>
  );
}