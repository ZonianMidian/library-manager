import { api } from '$lib/api.js';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	try {
		const [library, allBooks] = await Promise.all([
			api.libraries.getById(params.id, true),
			api.books.getAll()
		]);
		return { library, allBooks };
	} catch (err) {
		if (err.status === 404) {
			throw error(404, 'Biblioteca no encontrada');
		}
		throw error(500, 'Error al cargar la biblioteca');
	}
}
