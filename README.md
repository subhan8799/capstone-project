# MiniFlix - Mini Netflix Clone

MiniFlix is a production-style React + TypeScript streaming UI project with Firebase Authentication, protected routing, movie discovery, search, favorites, and a polished animated interface.

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router v7
- Firebase Authentication
- Redux Toolkit
- TanStack Query (React Query)
- Axios
- Tailwind CSS
- Framer Motion
- React Hook Form
- Zod
- React Hot Toast
- Lucide React
- ESLint + Prettier

## Features

- Auth: email/password register, login, Google sign-in, logout, forgot password
- Persistent session with Firebase auth state observer
- Protected routes and public routes
- Movie browsing sections: trending, popular, top rated, action, comedy, horror, romance
- Movie details page with hero metadata and related movies
- Real-time search with debounced API requests
- Favorites state with localStorage persistence
- Continue Watching state persistence
- Responsive dark glassmorphism UI, gradients, blur layers, transitions, and micro-interactions
- Loading skeletons and graceful empty states

## Routes

- / (protected)
- /login (public)
- /register (public)
- /forgot-password (public)
- /movie/:id (protected)
- /favorites (protected)
- /profile (protected)
- * (404)

## Folder Structure

```text
src/
	app/
		hooks.ts
		store.ts
	components/
		common/
		layout/
		movies/
	context/
		AuthContext.tsx
	firebase/
		auth.ts
		config.ts
	hooks/
	layouts/
	pages/
	routes/
	services/
	store/
	styles/
	types/
	utils/
	main.tsx
```

## Environment Variables

Use a single local environment file named `.env` in the project root with these values:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`
- `VITE_TMDB_BASE_URL`
- `VITE_TMDB_IMAGE_BASE_URL`
- `VITE_TMDB_API_READ_ACCESS_TOKEN`
- `VITE_TMDB_API_KEY` (optional fallback if read token is not used)

Firebase values are used in [src/firebase/config.ts](src/firebase/config.ts).

Movie API integration is configured in [src/services/movieService.ts](src/services/movieService.ts):

- Primary provider: TMDB (requires either `VITE_TMDB_API_READ_ACCESS_TOKEN` or `VITE_TMDB_API_KEY`)
- Automatic fallback provider: public movie catalog JSON feed when TMDB returns auth/network errors

## Local Setup

1. Install dependencies:

```bash
npm install --legacy-peer-deps
```

2. Start development server:

```bash
npm run dev
```

3. Type check:

```bash
npm run typecheck
```

4. Production build:

```bash
npm run build
```

Important: run `npm run build` (without a trailing dot). `npm run build.` will fail because no script named `build.` exists.

## Movie API Setup (TMDB)

1. Create a TMDB account and open API settings.
2. Generate either:
	- Read Access Token (v4), or
	- API Key (v3)
3. Add one or both values to `.env`:

```bash
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/w500
VITE_TMDB_API_READ_ACCESS_TOKEN=YOUR_REAL_TMDB_READ_ACCESS_TOKEN
# Optional fallback auth method if not using token:
VITE_TMDB_API_KEY=YOUR_REAL_TMDB_API_KEY
```

4. Restart the dev server after editing `.env`.
5. Verify movie rows on Home, Movies, TV Shows, and New & Popular pages.

If TMDB credentials are invalid, the app now automatically falls back to a public catalog so sections still render dynamic content.

## Firebase Setup

1. Create a Firebase project.
2. Enable Authentication providers:
	 - Email/Password
	 - Google
3. Add your web app credentials to `.env` using keys from Firebase Project Settings.
4. For hosting, update project id in [.firebaserc](.firebaserc), then run:

```bash
firebase login
firebase init hosting
firebase deploy
```

## Netlify Production Setup

If your deployed URL shows `Page not found` on paths like `/login`, this is a single-page app rewrite issue.

This repository now includes [netlify.toml](netlify.toml) with a catch-all redirect to `index.html` so route paths work in production.

In Netlify Dashboard, configure these Environment Variables exactly as named in [.env.example](.env.example):

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`
- `VITE_TMDB_BASE_URL`
- `VITE_TMDB_IMAGE_BASE_URL`
- `VITE_TMDB_API_READ_ACCESS_TOKEN` or `VITE_TMDB_API_KEY`

Then trigger a new deploy with cache clear.

Important production notes:

- Vite exposes only env vars prefixed with `VITE_`.
- Do not wrap values in quotes.
- After changing env vars, redeploy (a refresh is not enough).

## Auth Troubleshooting

If login, Google popup, or sign-up returns `auth/configuration-not-found` (or API `CONFIGURATION_NOT_FOUND`), your Firebase project authentication backend is not initialized yet.

1. Open Firebase Console -> Build -> Authentication.
2. Click `Get started` if shown.
3. In `Sign-in method`, enable:
	- Email/Password
	- Google (and set Project support email)
4. In `Settings` -> `Authorized domains`, ensure these are present:
	- `localhost`
	- your deployed domain (for example `your-app.web.app` and any custom domain)
5. Verify your `.env` points to the same Firebase project id as `.firebaserc`.

After saving provider settings, restart the app (`npm run dev`) and test:
- Create account
- Continue with Google
- Login with email/password

## Notes

- This project currently runs on Node 18 with compatibility pinning for Vite.
- React Router v7 emits engine warnings on Node 18; upgrading to Node 20+ is recommended for long-term support.
