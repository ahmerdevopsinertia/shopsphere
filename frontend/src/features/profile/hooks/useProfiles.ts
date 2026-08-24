import { useCallback } from 'react';

import { getProfile } from '../api/profile.api';

import {
	useProfileStore,
} from '../store/profile.store';

export function useProfile() {
	const profile =
		useProfileStore(
			(state) => state.profile,
		);

	const loading =
		useProfileStore(
			(state) => state.loading,
		);

	const error =
		useProfileStore(
			(state) => state.error,
		);

	const setProfile =
		useProfileStore(
			(state) => state.setProfile,
		);

	const setLoading =
		useProfileStore(
			(state) => state.setLoading,
		);

	const setError =
		useProfileStore(
			(state) => state.setError,
		);

	const loadProfile =
		useCallback(async () => {
			try {
				setLoading(true);
				setError(null);

				const data =
					await getProfile();

				setProfile(data);

				return data;
			} catch (error) {
				console.error(
					'Failed to load profile:',
					error,
				);

				setError(
					'Unable to load your profile.',
				);

				throw error;
			} finally {
				setLoading(false);
			}
		}, [
			setProfile,
			setLoading,
			setError,
		]);

	return {
		profile,
		loading,
		error,
		loadProfile,
	};
}