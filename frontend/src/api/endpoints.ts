export const API_ENDPOINTS = {
	health: '/health',

	auth: {
		register: '/auth/register',
		login: '/auth/login',
		logout: '/auth/logout',
		refresh: '/auth/refresh',
	},

	products: {
		list: '/products',
		detail: (id: string) => `/products/${id}`,
	},

	orders: {
		list: '/orders',
		detail: (id: string) => `/orders/${id}`,
	},
} as const;