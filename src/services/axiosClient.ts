import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_TMDB_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = import.meta.env.VITE_TMDB_API_READ_ACCESS_TOKEN;
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const looksLikePlaceholder = typeof token === 'string' && token.toLowerCase().includes('your_tmdb');

  if (token && !looksLikePlaceholder) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (apiKey) {
    config.params = { ...(config.params ?? {}), api_key: apiKey };
  }

  config.params = {
    include_adult: false,
    language: 'en-US',
    ...(config.params ?? {}),
  };

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.status_message ??
      error?.response?.data?.errors?.[0] ??
      error?.message ??
      'Movie API request failed.';

    return Promise.reject(new Error(message));
  },
);

export default apiClient;