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

	cart: {
		get: '/cart',
		add: '/cart',
		update: '/cart',
		updateItem: (productId: string) =>
			`/cart/items/${productId}`,
		deleteCartItem: (productId: string) =>
			`/cart/items/${productId}`,
		delete: `/cart`
	},

	checkout: {
		create: '/checkout'
	},
	
	categories: {
		list: '/categories',
	},

	profile: {
		get: '/profile',
	},
} as const;