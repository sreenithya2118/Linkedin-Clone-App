const normalizeBaseUrl = (value?: string) => {
  if (!value) return undefined;
  return value.endsWith("/") ? value.slice(0, -1) : value;
};

export const backendApiBaseUrl =
  normalizeBaseUrl(process.env.BACKEND_URL) ??
  normalizeBaseUrl(process.env.NEXT_PUBLIC_BACKEND_URL) ??
  "http://localhost:5000/api";

export const backendApiFetch = (path: string, init?: RequestInit) => {
  const url = `${backendApiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  return fetch(url, init);
};

