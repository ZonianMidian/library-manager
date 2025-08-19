import { api } from '$lib/api.js';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	try {
		const [book, allAuthors] = await Promise.all([
			api.books.getById(params.id, true),
			api.authors.getAll()
		]);
		return { book, allAuthors };
	} catch (err) {
		if (err.status === 404) {
			throw error(404, 'Libro no encontrado');
		}
		throw error(500, 'Error al cargar el libro');
	}
}
