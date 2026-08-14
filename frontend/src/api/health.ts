import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';

export interface HealthResponse {
  status: string;
}

export const checkHealth = async (): Promise<HealthResponse> => {
  const response = await apiClient.get<HealthResponse>(
    API_ENDPOINTS.health,
  );

  return response.data;
};