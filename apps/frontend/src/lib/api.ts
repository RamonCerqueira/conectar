import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";
const BASE_API_URL = API_URL.endsWith("/api") ? API_URL : `${API_URL}/api`;

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
  (error) => Promise.reject(error)
);

// Interceptor de Response — Refresh Token automático
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${BASE_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const { accessToken } = response.data;
        setAccessToken(accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token expirado — redireciona para login
        setAccessToken(null);
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ─── Access Token em Memória (mais seguro que localStorage) ──────────────────
let _accessToken: string | null = null;

export function getAccessToken(): string | null {
  return _accessToken;
}

export function setAccessToken(token: string | null): void {
  _accessToken = token;
}
