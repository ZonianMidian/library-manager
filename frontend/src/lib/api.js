const API_BASE = '/api';

class APIError extends Error {
	constructor(message, status, errors = []) {
		super(message);
		this.status = status;
		this.errors = errors;
	}
}

async function request(endpoint, options = {}) {
	const url = `${API_BASE}${endpoint}`;
	const config = {
		headers: {
			'Content-Type': 'application/json',
			...options.headers
		},
		...options
	};

	if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
		config.body = JSON.stringify(config.body);
	}

	const response = await fetch(url, config);
	const data = await response.json();
	console.log(data);

	if (!response.ok) {
		throw new APIError(
			data.message || 'Error en la petición',
			response.status,
			data.errors || []
		);
	}

	return data;
}

export const api = {
	authors: {
		getAll: (extra = false) => request(`/authors${extra ? '?extra=true' : ''}`),
		getById: (id, extra = false) => request(`/authors/${id}${extra ? '?extra=true' : ''}`),
		create: (data) => request('/authors', { method: 'POST', body: data }),
		update: (id, data) => request(`/authors/${id}`, { method: 'PUT', body: data }),
		delete: (id) => request(`/authors/${id}`, { method: 'DELETE' })
	},
	books: {
		getAll: (extra = false) => request(`/books${extra ? '?extra=true' : ''}`),
		getById: (id, extra = false) => request(`/books/${id}${extra ? '?extra=true' : ''}`),
		create: (data) => request('/books', { method: 'POST', body: data }),
		update: (id, data) => request(`/books/${id}`, { method: 'PUT', body: data }),
		delete: (id) => request(`/books/${id}`, { method: 'DELETE' })
	},
	libraries: {
		getAll: (extra = false) => request(`/libraries${extra ? '?extra=true' : ''}`),
		getById: (id, extra = false) => request(`/libraries/${id}${extra ? '?extra=true' : ''}`),
		create: (data) => request('/libraries', { method: 'POST', body: data }),
		update: (id, data) => request(`/libraries/${id}`, { method: 'PUT', body: data }),
		delete: (id) => request(`/libraries/${id}`, { method: 'DELETE' })
	}
};

export function getImageUrl(type, id) {
	return `/assets/${type}/${id}.webp`;
}
