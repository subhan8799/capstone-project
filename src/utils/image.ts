const imageBase = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

export function toImageUrl(path?: string, placeholder = 'https://placehold.co/500x750/111827/e5e7eb?text=MiniFlix') {
  if (!path) return placeholder;
  if (path.startsWith('http://')) return path.replace('http://', 'https://');
  if (path.startsWith('https://')) return path;
  return `${imageBase}${path}`;
}
