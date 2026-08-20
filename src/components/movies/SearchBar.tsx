import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setSearchQuery } from '../../store/searchSlice';
import { useSearchMovies } from '../../hooks/useSearchMovies';
import { Link } from 'react-router-dom';
import { toImageUrl } from '../../utils/image';
import { useEffect, useState } from 'react';
import { rerankSearch } from '../../services/aiService';

export function SearchBar() {
  const dispatch = useAppDispatch();
  const query = useAppSelector((state) => state.search.query);
  const { data: results = [] } = useSearchMovies(query);
  const [aiResults, setAiResults] = useState<typeof results | null>(null);

  useEffect(() => {
    let mounted = true;
    if (query.trim().length > 1 && results.length) {
      // call AI reranker but do not block UI
      rerankSearch(query, results.slice(0, 20)).then((r) => {
        if (mounted) setAiResults(r as any);
      });
    } else {
      setAiResults(null);
    }
    return () => {
      mounted = false;
    };
  }, [query, results]);

  return (
    <div className="relative w-full max-w-xl md:min-w-[22rem]">
      <label htmlFor="movie-search" className="sr-only">
        Search movies
      </label>
      <div className="glass flex items-center gap-2 px-3 py-2.5">
        <Search className="text-slate-400" size={17} />
        <input
          id="movie-search"
          value={query}
          onChange={(event) => dispatch(setSearchQuery(event.target.value))}
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          placeholder="Search movies by title..."
          aria-label="Search movies"
        />
      </div>

      {query.trim().length > 1 ? (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-30 mt-2 max-h-80 w-full overflow-auto rounded-xl border border-white/10 bg-slate-900/95 p-2 shadow-2xl"
        >
          {results.length ? (
            (aiResults || results).slice(0, 8).map((movie) => (
              <Link
                to={`/movie/${movie.id}`}
                key={movie.id}
                className="flex items-center gap-3 rounded-lg p-2 transition hover:bg-white/10"
              >
                <img
                  src={toImageUrl(movie.posterPath, 'https://placehold.co/100x150/111827/e5e7eb?text=MiniFlix')}
                  alt={movie.title}
                  className="h-14 w-10 rounded object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="text-sm">
                  <p className="line-clamp-1">{movie.title}</p>
                  <p className="text-xs text-slate-400">Rating: {movie.rating.toFixed(1)}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="px-2 py-3 text-sm text-slate-300">No movies found.</p>
          )}
        </motion.div>
      ) : null}
    </div>
  );
}