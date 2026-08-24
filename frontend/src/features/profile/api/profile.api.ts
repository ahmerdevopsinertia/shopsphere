import { apiClient } from '../../../api/client';
import { API_ENDPOINTS } from '../../../api/endpoints';

import type {
	ProfileResponse,
} from '../types/profile.types';

export async function getProfile() {
	const response =
		await apiClient.get<ProfileResponse>(
			API_ENDPOINTS.profile.get,
		);

	return response.data.data;
}