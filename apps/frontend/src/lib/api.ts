import axios from "axios";

const configuredUrl = process.env.NEXT_PUBLIC_API_URL?.trim().replace(
  /\/+$/,
  "",
);
const defaultUrl =
  typeof window !== "undefined" &&
  !["localhost", "127.0.0.1"].includes(window.location.hostname)
    ? window.location.hostname.startsWith("app.")
      ? `${window.location.protocol}//api.${window.location.hostname.slice(4)}`
      : window.location.origin
    : "http://localhost:5101";
export const BASE_API_URL = `${(configuredUrl || defaultUrl).replace(/\/api$/, "")}/api`;
export const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL || BASE_API_URL.replace(/\/api$/, "");
let refreshPromise: Promise<string> | null = null;
async function refreshAccessToken() {
  if (!refreshPromise)
    refreshPromise = axios
      .post(`${BASE_API_URL}/auth/refresh`, {}, { withCredentials: true })
      .then((response) => {
        setAccessToken(response.data.accessToken);
        return response.data.accessToken as string;
      })
      .finally(() => {
        refreshPromise = null;
      });
  return refreshPromise;
}

export const api = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true, // Envia cookies HttpOnly (refresh token)
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de Request — Adiciona Access Token
api.interceptors.request.use(
  (config) => {
    // Token armazenado em memória (não localStorage por segurança)
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor de Response — Refresh Token automático
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !/\/auth\/(login|login-responsavel|refresh)$/.test(
        originalRequest.url || "",
      )
    ) {
      originalRequest._retry = true;

      try {
        const accessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token expirado — redireciona para login correspondente
        setAccessToken(null);
        if (typeof window !== "undefined") {
          const isPortal = window.location.pathname.startsWith("/portal");
          window.location.href = isPortal ? "/portal/login" : "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

// ─── Access Token em Memória (mais seguro que localStorage) ──────────────────
let _accessToken: string | null = null;

export function getAccessToken(): string | null {
  return _accessToken;
}

export function setAccessToken(token: string | null): void {
  _accessToken = token;
}
