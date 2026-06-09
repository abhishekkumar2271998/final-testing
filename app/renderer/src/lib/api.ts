// HTTP client for the Django marketplace backend. JWT access/refresh tokens
// are kept in localStorage; the request interceptor attaches the access token
// and the response interceptor transparently refreshes it once on a 401.
import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';

const BASE_URL =
  (import.meta.env?.VITE_API_BASE_URL as string | undefined) ??
  'http://127.0.0.1:8000/api';

const ACCESS_KEY = 'mkt.access';
const REFRESH_KEY = 'mkt.refresh';

export const tokenStore = {
  get access() {
    return localStorage.getItem(ACCESS_KEY);
  },
  get refresh() {
    return localStorage.getItem(REFRESH_KEY);
  },
  set(access: string, refresh?: string) {
    localStorage.setItem(ACCESS_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

export const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStore.access;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Single-flight refresh: many concurrent 401s share one refresh request.
let refreshing: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refresh = tokenStore.refresh;
  if (!refresh) return null;
  try {
    const { data } = await axios.post(`${BASE_URL}/auth/refresh/`, { refresh });
    tokenStore.set(data.access);
    return data.access as string;
  } catch {
    tokenStore.clear();
    return null;
  }
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as
      | (AxiosRequestConfig & { _retried?: boolean })
      | undefined;
    if (error.response?.status === 401 && original && !original._retried) {
      original._retried = true;
      refreshing = refreshing ?? refreshAccessToken();
      const token = await refreshing;
      refreshing = null;
      if (token) {
        original.headers = { ...original.headers, Authorization: `Bearer ${token}` };
        return api(original);
      }
    }
    return Promise.reject(error);
  },
);

/** Flatten a DRF error response into a single human-readable string. */
export function apiErrorMessage(err: unknown): string {
  const ax = err as AxiosError<Record<string, unknown>>;
  const data = ax.response?.data;
  if (!data) return ax.message || 'Network error';
  if (typeof data === 'string') return data;
  if (typeof data.detail === 'string') return data.detail;
  const parts: string[] = [];
  for (const [key, val] of Object.entries(data)) {
    const text = Array.isArray(val) ? val.join(' ') : String(val);
    parts.push(key === 'non_field_errors' ? text : `${key}: ${text}`);
  }
  return parts.join('\n') || 'Request failed';
}
