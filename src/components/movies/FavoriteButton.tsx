import { Heart } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { toggleFavorite } from '../../store/favoritesSlice';
import { cn } from '../../utils/cn';

export function FavoriteButton({ movieId }: { movieId: number }) {
  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector((state) => state.favorites.ids.includes(movieId));

  return (
    <button
      className={cn(
        'rounded-full border border-white/20 bg-black/50 p-2 transition hover:scale-105',
        isFavorite && 'border-rose-400 bg-rose-500/20 text-rose-300',
      )}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        dispatch(toggleFavorite(movieId));
      }}
    >
      <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
    </button>
  );
}