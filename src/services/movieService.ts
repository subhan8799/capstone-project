import apiClient from './axiosClient';
import type { Movie, MovieApiResult, MovieListResponse, MovieVideoResponse } from '../types/movie';
import axios from 'axios';

const categoryQueryMap = {
  trending: '/trending/movie/week',
  popular: '/movie/popular',
  topRated: '/movie/top_rated',
  recommended: '/discover/movie?sort_by=vote_average.desc&vote_count.gte=800',
  nowPlaying: '/movie/now_playing',
  upcoming: '/movie/upcoming',
  documentary: '/discover/movie?with_genres=99',
  sciFi: '/discover/movie?with_genres=878',
  action: '/discover/movie?with_genres=28',
  comedy: '/discover/movie?with_genres=35',
  horror: '/discover/movie?with_genres=27',
  romance: '/discover/movie?with_genres=10749',
} as const;

type FallbackApiMovie = {
  id: number;
  title: string;
  plot: string;
  posterUrl: string;
  year: string;
  runtime: string;
  genres: string[];
  director: string;
};

const fallbackClient = axios.create({ timeout: 10000 });
const FALLBACK_MOVIES_URL = 'https://raw.githubusercontent.com/erik-sytnyk/movies-list/master/db.json';

const FALLBACK_GENRES = [28, 35, 27, 10749, 878, 99] as const;

let fallbackCache: Movie[] | null = null;
const fallbackTitleById = new Map<number, string>();
const fallbackSourceById = new Map<number, FallbackApiMovie>();

function hashToPositiveInt(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

function mapGenreNameToId(name: string) {
  const normalized = name.toLowerCase();
  if (normalized.includes('action') || normalized.includes('adventure')) return 28;
  if (normalized.includes('comedy') || normalized.includes('animation')) return 35;
  if (normalized.includes('horror') || normalized.includes('thriller')) return 27;
  if (normalized.includes('romance') || normalized.includes('drama')) return 10749;
  if (normalized.includes('science fiction') || normalized.includes('sci-fi') || normalized.includes('fantasy')) return 878;
  if (normalized.includes('documentary') || normalized.includes('history')) return 99;
  return null;
}

function inferGenreIds(movie: FallbackApiMovie, stableId: number) {
  const text = `${movie.title} ${movie.plot}`.toLowerCase();
  const ids = new Set<number>();

  movie.genres.forEach((genre) => {
    const genreId = mapGenreNameToId(genre);
    if (genreId) {
      ids.add(genreId);
    }
  });

  if (text.includes('war') || text.includes('battle') || text.includes('fight')) ids.add(28);
  if (text.includes('love') || text.includes('romance') || text.includes('heart')) ids.add(10749);
  if (text.includes('spirit') || text.includes('ghost') || text.includes('witch') || text.includes('monster')) ids.add(27);
  if (text.includes('fun') || text.includes('comedy') || text.includes('laugh')) ids.add(35);
  if (text.includes('future') || text.includes('science') || text.includes('magic') || text.includes('flying')) ids.add(878);
  if (text.includes('history') || text.includes('true story') || text.includes('biography')) ids.add(99);

  ids.add(FALLBACK_GENRES[stableId % FALLBACK_GENRES.length]);
  return Array.from(ids);
}

function mapFallbackMovie(item: FallbackApiMovie): Movie {
  const stableId = Number(item.id) || hashToPositiveInt(item.title);
  const genreIds = inferGenreIds(item, stableId);
  const runtimeMatch = item.runtime?.match(/(\d+)/g);
  const runtime = runtimeMatch?.length ? runtimeMatch.map(Number).reduce((sum, part) => sum + part, 0) : undefined;
  const rating = 6 + (hashToPositiveInt(`${item.title}-${item.year}`) % 40) / 10;

  const movie: Movie = {
    id: stableId,
    title: item.title,
    overview: item.plot,
    posterPath: item.posterUrl,
    backdropPath: item.posterUrl,
    releaseDate: `${item.year}-01-01`,
    rating: Number.isFinite(rating) ? rating : 7,
    genreIds,
    runtime,
    genres: [],
    source: 'fallback',
  };

  fallbackTitleById.set(movie.id, movie.title);
  fallbackSourceById.set(movie.id, item);
  return movie;
}

async function getFallbackMovies() {
  if (fallbackCache) {
    return fallbackCache;
  }

  const { data } = await fallbackClient.get<{ movies: FallbackApiMovie[] }>(FALLBACK_MOVIES_URL);
  fallbackCache = data.movies
    .map(mapFallbackMovie)
    .filter((movie) => Boolean(movie.posterPath))
    .sort((a, b) => b.rating - a.rating);

  return fallbackCache;
}

function categoryFallback(movies: Movie[], category: keyof typeof categoryQueryMap) {
  const sortedByDate = [...movies].sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
  const sortedByRating = [...movies].sort((a, b) => b.rating - a.rating);

  const byGenre = (genreId: number) => movies.filter((movie) => movie.genreIds.includes(genreId));

  const filtered =
    category === 'trending'
      ? sortedByDate
      : category === 'popular'
        ? sortedByRating
        : category === 'topRated'
          ? sortedByRating
          : category === 'recommended'
            ? sortedByRating.filter((movie) => movie.rating >= 8)
            : category === 'nowPlaying'
              ? sortedByDate
              : category === 'upcoming'
                ? [...sortedByDate].reverse()
                : category === 'documentary'
                  ? byGenre(99)
                  : category === 'sciFi'
                    ? byGenre(878)
                    : category === 'action'
                      ? byGenre(28)
                      : category === 'comedy'
                        ? byGenre(35)
                        : category === 'horror'
                          ? byGenre(27)
                          : category === 'romance'
                            ? byGenre(10749)
                            : movies;

  if (filtered.length) {
    return filtered.slice(0, 20);
  }

  const start = hashToPositiveInt(category) % Math.max(1, movies.length);
  const rotated = [...movies.slice(start), ...movies.slice(0, start)];
  return rotated.slice(0, 20);
}

async function withFallback<T>(primary: () => Promise<T>, fallback: () => Promise<T>) {
  try {
    return await primary();
  } catch (primaryError) {
    try {
      return await fallback();
    } catch (fallbackError) {
      const primaryMessage = primaryError instanceof Error ? primaryError.message : 'Primary source failed.';
      const fallbackMessage = fallbackError instanceof Error ? fallbackError.message : 'Fallback source failed.';
      throw new Error(`${primaryMessage} ${fallbackMessage}`.trim());
    }
  }
}

function mapMovie(item: MovieApiResult): Movie {
  return {
    id: item.id,
    title: item.title,
    overview: item.overview,
    posterPath: item.poster_path,
    backdropPath: item.backdrop_path,
    releaseDate: item.release_date,
    rating: item.vote_average,
    genreIds: item.genre_ids ?? item.genres?.map((genre) => genre.id) ?? [],
    runtime: item.runtime,
    genres: item.genres,
    source: 'tmdb',
  };
}

export async function fetchMoviesByCategory(category: keyof typeof categoryQueryMap) {
  return withFallback(
    async () => {
      const { data } = await apiClient.get<MovieListResponse>(categoryQueryMap[category], {
        params: { page: 1 },
      });
      return data.results
        .map(mapMovie)
        .filter((movie) => Boolean(movie.posterPath || movie.backdropPath))
        .slice(0, 20);
    },
    async () => {
      const movies = await getFallbackMovies();
      return categoryFallback(movies, category);
    },
  );
}

export async function fetchMovieDetails(movieId: number) {
  return withFallback(
    async () => {
      const { data } = await apiClient.get<MovieApiResult>(`/movie/${movieId}`);
      return mapMovie(data);
    },
    async () => {
      const movies = await getFallbackMovies();
      const movie = movies.find((item) => item.id === movieId);
      if (movie) {
        return movie;
      }

      const firstMovie = movies[0];
      if (!firstMovie) {
        throw new Error('No movie data available from fallback provider.');
      }

      return firstMovie;
    },
  );
}

export async function fetchRelatedMovies(movieId: number) {
  return withFallback(
    async () => {
      const { data } = await apiClient.get<MovieListResponse>(`/movie/${movieId}/similar`, {
        params: { page: 1 },
      });
      return data.results
        .map(mapMovie)
        .filter((movie) => Boolean(movie.posterPath || movie.backdropPath))
        .slice(0, 20);
    },
    async () => {
      const movies = await getFallbackMovies();
      const current = movies.find((movie) => movie.id === movieId);
      if (!current) {
        return movies.slice(0, 12);
      }

      const sameGenre = movies.filter(
        (movie) => movie.id !== movieId && movie.genreIds.some((genreId) => current.genreIds.includes(genreId)),
      );

      if (sameGenre.length) {
        return sameGenre.slice(0, 20);
      }

      return movies.filter((movie) => movie.id !== movieId).slice(0, 20);
    },
  );
}

export async function searchMovies(query: string) {
  return withFallback(
    async () => {
      const { data } = await apiClient.get<MovieListResponse>(`/search/movie`, {
        params: { query, page: 1 },
      });
      return data.results
        .map(mapMovie)
        .filter((movie) => Boolean(movie.posterPath || movie.backdropPath))
        .slice(0, 20);
    },
    async () => {
      const movies = await getFallbackMovies();
      const normalizedQuery = query.trim().toLowerCase();
      return movies.filter((movie) => movie.title.toLowerCase().includes(normalizedQuery)).slice(0, 20);
    },
  );
}

export async function fetchMovieTrailer(movieId: number) {
  return withFallback(
    async () => {
      const { data } = await apiClient.get<MovieVideoResponse>(`/movie/${movieId}/videos`);

      const trailer =
        data.results.find((video) => video.site === 'YouTube' && video.type === 'Trailer' && video.official) ??
        data.results.find((video) => video.site === 'YouTube' && video.type === 'Trailer') ??
        data.results.find((video) => video.site === 'YouTube');

      return trailer?.key ?? null;
    },
    async () => {
      const title = fallbackTitleById.get(movieId) ?? fallbackSourceById.get(movieId)?.title;
      if (!title) {
        return null;
      }

      return `search:${encodeURIComponent(`${title} official trailer`)}`;
    },
  );
}
