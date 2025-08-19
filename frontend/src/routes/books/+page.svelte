<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { api } from '$lib/api.js';
	import { loading, showError, showSuccess } from '$lib/stores.js';
	import { Plus, Edit, Trash2 } from '@lucide/svelte';
	import BookCard from '$lib/components/BookCard.svelte';
	import Modal from '$lib/components/Modal.svelte';

	let books = $state([]);
	let showDeleteModal = $state(false);
	let bookToDelete = $state(null);

	onMount(async () => {
		await loadBooks();
	});

	async function loadBooks() {
		try {
			loading.set(true);
			books = await api.books.getAll();
		} catch (error) {
			showError('Error al cargar libros: ' + error.message);
		} finally {
			loading.set(false);
		}
	}

	function confirmDelete(book) {
		bookToDelete = book;
		showDeleteModal = true;
	}

	async function deleteBook() {
		if (!bookToDelete) return;

		try {
			loading.set(true);
			await api.books.delete(bookToDelete.id);
			books = books.filter((b) => b.id !== bookToDelete.id);
			showSuccess('Libro eliminado correctamente');
			showDeleteModal = false;
			bookToDelete = null;
		} catch (error) {
			showError('Error al eliminar libro: ' + error.message);
		} finally {
			loading.set(false);
		}
	}
</script>

<div class="space-y-6">
	<div class="flex justify-between items-center">
		<h1 class="text-3xl font-bold">Libros</h1>
		<a href="/books/create" class="btn btn-primary">
			<Plus size="20" />
			Nuevo Libro
		</a>
	</div>

	{#if books.length === 0}
		<div class="text-center py-12">
			<p class="text-xl text-base-content/60">No hay libros registrados</p>
			<p class="text-base-content/40 mt-2">Crea el primer libro para comenzar</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each books as book}
				<div class="relative group">
					<a href="/books/{book.id}" class="block">
						<BookCard {book} />
					</a>

					<div
						class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity space-x-2"
					>
						<button
							class="btn btn-sm btn-neutral btn-circle hover:bg-neutral/80"
							onclick={(e) => {
								e.preventDefault();
								goto(`/books/${book.id}/edit`);
							}}
						>
							<Edit size="16" />
						</button>
						<button
							class="btn btn-sm btn-error btn-circle hover:bg-error/80"
							onclick={(e) => {
								e.preventDefault();
								confirmDelete(book);
							}}
						>
							<Trash2 size="16" />
						</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<Modal
	bind:isOpen={showDeleteModal}
	title="Confirmar eliminación"
	onConfirm={deleteBook}
	confirmText="Eliminar"
>
	{#snippet children()}
		<p>¿Estás seguro de que deseas eliminar el libro <strong>{bookToDelete?.title}</strong>?</p>
		<p class="text-sm text-base-content/60 mt-2">Esta acción no se puede deshacer.</p>
	{/snippet}
</Modal>
