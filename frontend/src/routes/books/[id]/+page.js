import { api } from '$lib/api.js';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	try {
		const book = await api.books.getById(params.id, true);
		return { book };
	} catch (err) {
		if (err.status === 404) {
			throw error(404, 'Libro no encontrado');
		}
		throw error(500, 'Error al cargar el libro');
	}
}
