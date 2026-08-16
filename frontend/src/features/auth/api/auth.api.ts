import { apiClient, refreshClient } from "../../../api/client";
import { API_ENDPOINTS } from "../../../api/endpoints";

import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
} from '../types/auth.types';

export async function login(
  payload: LoginRequest,
): Promise<LoginResponse> {
  const response = await apiClient.post<{
    success: boolean;
    data: LoginResponse;
  }>(
    API_ENDPOINTS.auth.login,
    payload,
  );

  return response.data.data;
}

export async function refresh(): Promise<RefreshTokenResponse> {
  const response = await refreshClient.post<{
    success: boolean;
    data: RefreshTokenResponse;
  }>(
    API_ENDPOINTS.auth.refresh,
    {},
    {
      withCredentials: true,
    },
  );

  return response.data.data;
}

export async function logout(): Promise<void> {
  await apiClient.post(
    API_ENDPOINTS.auth.logout,
  );
}

export async function orders(): Promise<void> {
  await apiClient.get(
    API_ENDPOINTS.orders.list,
  );
}