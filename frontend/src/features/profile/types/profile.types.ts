export interface Profile {
	id: string;
	firstName: string;
	lastName: string;
	phone?: string;
}

export interface ProfileResponse {
	success: boolean;
	data: Profile;
}