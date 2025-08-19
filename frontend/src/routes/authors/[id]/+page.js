import { api } from '$lib/api.js';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	try {
		const author = await api.authors.getById(params.id, true);
		return { author };
	} catch (err) {
		if (err.status === 404) {
			throw error(404, 'Autor no encontrado');
		}
		throw error(500, 'Error al cargar el autor');
	}
}
