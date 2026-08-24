import { useEffect } from 'react';

import { useProfile } from '../hooks/useProfiles';

export default function ProfilePage() {
	const {
		profile,
		loading,
		error,
		loadProfile,
	} = useProfile();

	useEffect(() => {
		void loadProfile();
	}, [loadProfile]);

	if (loading && !profile) {
		return (
			<div className="flex min-h-[400px] items-center justify-center">
				<p className="text-gray-500">
					Loading profile...
				</p>
			</div>
		);
	}

	if (error && !profile) {
		return (
			<div className="mx-auto max-w-3xl p-6">
				<div className="rounded-lg bg-red-50 p-4 text-red-600">
					{error}
				</div>
			</div>
		);
	}

	if (!profile) {
		return (
			<div className="mx-auto max-w-3xl p-6">
				<div className="rounded-lg bg-gray-50 p-6 text-center">
					<p className="text-gray-500">
						Profile information is not
						available.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="mx-auto max-w-3xl px-6 py-10">

				<div className="rounded-xl bg-white p-6 shadow-sm">

					<div className="mb-8">
						<h1 className="text-3xl font-bold">
							My Profile
						</h1>

						<p className="mt-2 text-gray-500">
							View your account information.
						</p>
					</div>

					<div className="space-y-6">

						{/* First Name */}

						<div>
							<label className="text-sm font-medium text-gray-500">
								First Name
							</label>

							<p className="mt-1 text-lg font-medium">
								{profile.firstName}
							</p>
						</div>

						{/* Last Name */}

						<div>
							<label className="text-sm font-medium text-gray-500">
								Last Name
							</label>

							<p className="mt-1 text-lg font-medium">
								{profile.lastName}
							</p>
						</div>

						{/* Phone */}

						<div>
							<label className="text-sm font-medium text-gray-500">
								Phone
							</label>

							<p className="mt-1 text-lg font-medium">
								{profile.phone ||
									'Not provided'}
							</p>
						</div>

					</div>

				</div>

			</div>
		</div>
	);
}