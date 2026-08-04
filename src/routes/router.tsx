import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

const HomePage = lazy(() => import('../pages/HomePage').then((mod) => ({ default: mod.HomePage })));
const LoginPage = lazy(() => import('../pages/LoginPage').then((mod) => ({ default: mod.LoginPage })));
const RegisterPage = lazy(() => import('../pages/RegisterPage').then((mod) => ({ default: mod.RegisterPage })));
const ForgotPasswordPage = lazy(() =>
  import('../pages/ForgotPasswordPage').then((mod) => ({ default: mod.ForgotPasswordPage })),
);
const MovieDetailsPage = lazy(() =>
  import('../pages/MovieDetailsPage').then((mod) => ({ default: mod.MovieDetailsPage })),
);
const WatchPage = lazy(() => import('../pages/WatchPage').then((mod) => ({ default: mod.WatchPage })));
const FavoritesPage = lazy(() => import('../pages/FavoritesPage').then((mod) => ({ default: mod.FavoritesPage })));
const MoviesPage = lazy(() => import('../pages/MoviesPage').then((mod) => ({ default: mod.MoviesPage })));
const TVShowsPage = lazy(() => import('../pages/TVShowsPage').then((mod) => ({ default: mod.TVShowsPage })));
const NewPopularPage = lazy(() => import('../pages/NewPopularPage').then((mod) => ({ default: mod.NewPopularPage })));
const ProfilePage = lazy(() => import('../pages/ProfilePage').then((mod) => ({ default: mod.ProfilePage })));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage').then((mod) => ({ default: mod.NotFoundPage })));

function withSuspense(element: React.ReactElement) {
  return <Suspense fallback={<LoadingSkeleton className="h-[65vh] w-full" />}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: withSuspense(<HomePage />) },
      { path: 'movies', element: withSuspense(<MoviesPage />) },
      { path: 'tv-shows', element: withSuspense(<TVShowsPage />) },
      { path: 'new-popular', element: withSuspense(<NewPopularPage />) },
      { path: 'my-list', element: withSuspense(<FavoritesPage />) },
      { path: 'movie/:id', element: withSuspense(<MovieDetailsPage />) },
      { path: 'watch/:id', element: withSuspense(<WatchPage />) },
      { path: 'favorites', element: withSuspense(<FavoritesPage />) },
      { path: 'profile', element: withSuspense(<ProfilePage />) },
    ],
  },
  {
    path: '/',
    element: (
      <PublicRoute>
        <AuthLayout />
      </PublicRoute>
    ),
    children: [
      { path: 'login', element: withSuspense(<LoginPage />) },
      { path: 'register', element: withSuspense(<RegisterPage />) },
      { path: 'forgot-password', element: withSuspense(<ForgotPasswordPage />) },
    ],
  },
  {
    path: '*',
    element: withSuspense(<NotFoundPage />),
  },
]);