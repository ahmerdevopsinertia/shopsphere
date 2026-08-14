import axios, { AxiosError } from 'axios';
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


let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

apiClient.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {

    console.log('🔴 AXIOS INTERCEPTOR ERROR');
    console.log('Status:', error.response?.status);
    console.log('URL:', error.config?.url);
    console.log(
      'Auth Store:',
      useAuthStore.getState(),
    );

    const originalRequest =
      error.config as RetryableRequestConfig;

    if (
      error.response?.status !== 401 ||
      originalRequest?._retry
    ) {
      console.log('Retry flag:', originalRequest?._retry);
      return Promise.reject(error);
    }

    console.log('🟠 401 detected');
    console.log('Original URL:', originalRequest.url);
    console.log(
      'Refresh Token:',
      useAuthStore.getState().refreshToken,
    );

    // Never intercept the refresh request itself
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

    const authStore =
      useAuthStore.getState();

    console.log('🟢 Calling refresh API');

    const refreshToken =
      authStore.refreshToken;

    if (!refreshToken) {
      authStore.clearAuth();
      return Promise.reject(error);
    }

    try {

      // Another request is already refreshing
      if (isRefreshing && refreshPromise) {
        const newAccessToken =
          await refreshPromise;
        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      }

      // Start refresh
      isRefreshing = true;
      refreshPromise =
        refresh({refreshToken})
          .then((response) => {
            useAuthStore
              .getState()
              .updateTokens(
                response.accessToken,
                response.refreshToken,
              );
            return response.accessToken;
          })
          .finally(() => {
            isRefreshing = false;
            refreshPromise = null;
          });

      const newAccessToken =
        await refreshPromise;

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return apiClient(originalRequest);

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