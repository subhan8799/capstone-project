import { useEffect, useState } from 'react';

type AuthConfigStatus = {
  loading: boolean;
  ready: boolean;
  message: string | null;
};

type CachedProbe = {
  ready: boolean;
  message: string | null;
};

let cachedProbe: CachedProbe | null = null;
let pendingProbe: Promise<CachedProbe> | null = null;

async function probeFirebaseAuthConfiguration(): Promise<CachedProbe> {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

  if (!apiKey) {
    return {
      ready: false,
      message: 'Firebase API key is missing. Update your .env file and restart the app.',
    };
  }

  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:createAuthUri?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: 'healthcheck@example.com',
          continueUri: window.location.origin,
          providerId: 'google.com',
        }),
      },
    );

    if (response.ok) {
      return { ready: true, message: null };
    }

    const payload = (await response.json().catch(() => null)) as
      | { error?: { message?: string } }
      | null;
    const code = payload?.error?.message ?? 'UNKNOWN';

    if (code === 'CONFIGURATION_NOT_FOUND') {
      return {
        ready: false,
        message:
          'Firebase Authentication is not initialized for this project. In Firebase Console, open Authentication, click Get started, enable Email/Password and Google, set support email, and keep localhost + production domains authorized.',
      };
    }

    return {
      ready: false,
      message: `Firebase Authentication check failed: ${code}. Verify Firebase Auth providers and authorized domains.`,
    };
  } catch {
    return {
      ready: false,
      message: 'Unable to verify Firebase Authentication readiness. Check network access and Firebase project settings.',
    };
  }
}

export function useAuthConfiguration(): AuthConfigStatus {
  const [status, setStatus] = useState<AuthConfigStatus>({
    loading: cachedProbe === null,
    ready: cachedProbe?.ready ?? false,
    message: cachedProbe?.message ?? null,
  });

  useEffect(() => {
    if (cachedProbe) {
      setStatus({ loading: false, ready: cachedProbe.ready, message: cachedProbe.message });
      return;
    }

    if (!pendingProbe) {
      pendingProbe = probeFirebaseAuthConfiguration().then((result) => {
        cachedProbe = result;
        return result;
      });
    }

    let alive = true;

    pendingProbe.then((result) => {
      if (!alive) return;
      setStatus({ loading: false, ready: result.ready, message: result.message });
    });

    return () => {
      alive = false;
    };
  }, []);

  return status;
}
