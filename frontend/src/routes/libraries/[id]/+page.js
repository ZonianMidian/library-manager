import { api } from '$lib/api.js';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	try {
		const library = await api.libraries.getById(params.id, true);
		return { library };
	} catch (err) {
		if (err.status === 404) {
			throw error(404, 'Biblioteca no encontrada');
		}
		throw error(500, 'Error al cargar la biblioteca');
	}
}
