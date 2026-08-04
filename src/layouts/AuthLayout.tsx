import { Outlet } from 'react-router-dom';
import { Film } from 'lucide-react';

export function AuthLayout() {
  return (
    <main className="mx-auto grid min-h-screen max-w-6xl place-items-center px-4 py-10">
      <section className="glass w-full max-w-md p-7">
        <div className="mb-6 flex items-center justify-center gap-2 text-2xl font-semibold">
          <Film className="text-brand-500" /> MiniFlix
        </div>
        <Outlet />
      </section>
    </main>
  );
}