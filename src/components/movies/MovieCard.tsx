import { motion } from 'framer-motion';
import { Play, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Movie } from '../../types/movie';
import { FavoriteButton } from './FavoriteButton';
import { yearFromDate } from '../../utils/date';
import { toImageUrl } from '../../utils/image';

export function MovieCard({ movie }: { movie: Movie }) {
  return (
    <motion.article whileHover={{ y: -6 }} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/30">
      <Link to={`/movie/${movie.id}`}>
        <img
          src={toImageUrl(movie.posterPath)}
          alt={movie.title}
          className="h-56 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-72"
          loading="lazy"
          decoding="async"
          sizes="(max-width: 640px) 42vw, (max-width: 1024px) 24vw, 176px"
        />
        <div className="absolute left-0 top-0 m-3">
          <FavoriteButton movieId={movie.id} />
        </div>
        <div className="absolute inset-x-0 bottom-0 space-y-1 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-3">
          <h3 className="line-clamp-1 font-semibold">{movie.title}</h3>
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>{yearFromDate(movie.releaseDate)}</span>
            <span className="inline-flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-400" /> {movie.rating.toFixed(1)}
            </span>
          </div>
          <div className="flex justify-end pt-1 opacity-0 transition group-hover:opacity-100">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-white">
              <Play className="h-3 w-3" /> Watch
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}