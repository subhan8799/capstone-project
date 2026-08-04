import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearFavorites } from '../store/favoritesSlice';
import { fetchMovieDetails } from '../services/movieService';
import { MovieGrid } from '../components/movies/MovieGrid';
import { Button } from '../components/common/Button';
import type { Movie } from '../types/movie';

export function FavoritesPage() {
  const ids = useAppSelector((state) => state.favorites.ids);
  const dispatch = useAppDispatch();

  const movieQueries = useQueries({
    queries: ids.map((id) => ({
      queryKey: ['movie', id, 'favorite'],
      queryFn: () => fetchMovieDetails(id),
      staleTime: 1000 * 60 * 10,
    })),
  });

  const movies = useMemo(
    () => movieQueries.map((query) => query.data).filter((movie): movie is Movie => movie !== undefined),
    [movieQueries],
  );

  if (!ids.length) {
    return (
      <section className="glass p-8 text-center">
        <h1 className="mb-2 text-2xl font-semibold">No favorites yet</h1>
        <p className="text-slate-300">Tap the heart icon on movies to save them here.</p>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Favorites</h1>
        <Button variant="danger" className="gap-2" onClick={() => dispatch(clearFavorites())}>
          <Trash2 size={16} /> Clear All
        </Button>
      </div>
      <MovieGrid movies={movies} loading={movieQueries.some((query) => query.isLoading)} />
    </section>
  );
}