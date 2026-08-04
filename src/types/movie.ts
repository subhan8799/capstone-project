export interface Movie {
  id: number;
  title: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  releaseDate: string;
  rating: number;
  genreIds: number[];
  runtime?: number;
  genres?: { id: number; name: string }[];
  source?: 'tmdb' | 'fallback';
}

export interface MovieVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface MovieApiResult {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  runtime?: number;
  genres?: { id: number; name: string }[];
}

export interface MovieListResponse {
  page: number;
  results: MovieApiResult[];
  total_pages: number;
  total_results: number;
}

export interface MovieVideoResponse {
  id: number;
  results: MovieVideo[];
}

export interface Genre {
  id: number;
  name: string;
}

export type CategoryKey =
  | 'trending'
  | 'popular'
  | 'topRated'
  | 'recommended'
  | 'nowPlaying'
  | 'upcoming'
  | 'documentary'
  | 'sciFi'
  | 'action'
  | 'comedy'
  | 'horror'
  | 'romance';