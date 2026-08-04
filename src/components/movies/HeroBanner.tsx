import { motion } from 'framer-motion';
import { Info, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Movie } from '../../types/movie';
import { Button } from '../common/Button';
import { toImageUrl } from '../../utils/image';
import { ContentUnavailableState } from '../common/ContentUnavailableState';

export function HeroBanner({ movie, loading }: { movie?: Movie; loading?: boolean }) {
  if (loading) {
    return <div className="skeleton h-[420px] w-full rounded-3xl" />;
  }

  if (!movie) {
    return (
      <ContentUnavailableState
        title="This feature is coming soon"
        message="Featured content is being prepared. Explore other sections while we update this area."
      />
    );
  }

  return (
    <motion.section
      className="relative isolate overflow-hidden rounded-3xl border border-white/10"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <img
        src={toImageUrl(movie.backdropPath || movie.posterPath, 'https://placehold.co/1280x720/111827/e5e7eb?text=MiniFlix')}
        alt={movie.title}
        className="h-[320px] w-full object-cover sm:h-[420px]"
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-0 flex max-w-2xl flex-col justify-end gap-3 p-4 sm:gap-4 sm:p-8">
        <p className="text-sm uppercase tracking-[0.18em] text-brand-200">Featured Tonight</p>
        <h1 className="text-2xl font-bold sm:text-5xl">{movie.title}</h1>
        <p className="line-clamp-3 text-sm text-slate-200 sm:text-base">{movie.overview}</p>
        <div className="flex flex-wrap gap-3">
          <Link to={`/watch/${movie.id}`}>
            <Button className="gap-2 bg-white text-black shadow-none hover:bg-slate-100">
              <Play size={16} /> Play Trailer
            </Button>
          </Link>
          <Link to={`/movie/${movie.id}`}>
            <Button variant="secondary" className="gap-2">
              <Info size={16} /> More Info
            </Button>
          </Link>
        </div>
      </div>
    </motion.section>
  );
}