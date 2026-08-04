# Issue: Firebase Auth returns CONFIGURATION_NOT_FOUND

## Summary
Authentication requests fail for both Google Sign-In and email/password endpoints with:

- Firebase error: auth/configuration-not-found
- REST error: CONFIGURATION_NOT_FOUND

This blocks login and new account creation.

## Impact
- Continue with Google fails.
- Create account fails.
- Email/password login and reset can fail the same way.

## Verified Evidence
REST probe using the active API key and project settings returns:

- accounts:createAuthUri -> CONFIGURATION_NOT_FOUND
- accounts:signInWithPassword -> CONFIGURATION_NOT_FOUND

This confirms the issue is on Firebase project-side Authentication setup, not local frontend wiring.

## Root Cause
Firebase Authentication is not fully initialized/enabled for the project currently referenced by .env.

## Required Firebase Console Fix
1. Open Firebase Console for project capstone-project-644e7.
2. Navigate to Build -> Authentication.
3. Click Get started if shown.
4. Enable providers under Sign-in method:
   - Email/Password
   - Google (set a support email)
5. In Authentication -> Settings -> Authorized domains, keep/add:
   - localhost
   - production domains (web.app/firebaseapp.com/custom)
6. Save changes and wait 1-2 minutes.

## Code Safeguards Added
- Added auth backend readiness probe in src/hooks/useAuthConfiguration.ts.
- Login and Register now display actionable setup errors and disable failing submissions until auth backend is ready.
- Google sign-in includes popup-to-redirect fallback.

## Acceptance Criteria
- Google Sign-In succeeds in development and production.
- New account creation succeeds without configuration errors.
- Email/password login works.
- No auth/configuration-not-found errors are returned.
