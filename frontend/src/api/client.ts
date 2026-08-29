import axios from 'axios';
import { authStorage } from '../features/auth/utils/auth-storage';
import { refresh } from '../features/auth/api/auth.api';
import { useAuthStore } from '../features/auth/store/auth.store';
import { API_ENDPOINTS } from './endpoints';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const accessToken = authStorage.getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config;
});

let refreshPromise: Promise<string> | null = null;

apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {

    const originalRequest =
      error.config as RetryableRequestConfig;

    if (
      error.response?.status !== 401 ||
      originalRequest?._retry
    ) {
      return Promise.reject(error);
    }

    if (
      originalRequest.url ===
      API_ENDPOINTS.auth.refresh
    ) {
      useAuthStore
        .getState()
        .clearAuth();

      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {

      if (!refreshPromise) {

        refreshPromise =
          refresh()
            .then((response) => {

              useAuthStore
                .getState()
                .updateTokens(
                  response.accessToken,
                );

              return response.accessToken;

            })
            .finally(() => {

              refreshPromise = null;

            });
      }

      const newAccessToken =
        await refreshPromise;

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return apiClient(
        originalRequest,
      );

    } catch (refreshError) {
      useAuthStore
        .getState()
        .clearAuth();

      return Promise.reject(
        refreshError,
      );
    }
  },
);

export { apiClient, refreshClient };