import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

export function NotFoundPage() {
  return (
    <section className="grid min-h-[60vh] place-items-center text-center">
      <div className="space-y-4">
        <p className="text-6xl font-bold text-brand-400">404</p>
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="text-slate-300">The page you are looking for does not exist.</p>
        <Link to="/">
          <Button>Go Home</Button>
        </Link>
      </div>
    </section>
  );
}