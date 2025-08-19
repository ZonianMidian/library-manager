<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { api } from '$lib/api.js';
	import { loading, showError, showSuccess } from '$lib/stores.js';
	import { Plus, Edit, Trash2 } from '@lucide/svelte';
	import AuthorCard from '$lib/components/AuthorCard.svelte';
	import Modal from '$lib/components/Modal.svelte';

	let authors = $state([]);
	let showDeleteModal = $state(false);
	let authorToDelete = $state(null);

	onMount(async () => {
		await loadAuthors();
	});

	async function loadAuthors() {
		try {
			loading.set(true);
			authors = await api.authors.getAll();
		} catch (error) {
			showError('Error al cargar autores: ' + error.message);
		} finally {
			loading.set(false);
		}
	}

	function confirmDelete(author) {
		authorToDelete = author;
		showDeleteModal = true;
	}

	async function deleteAuthor() {
		if (!authorToDelete) return;

		try {
			loading.set(true);
			await api.authors.delete(authorToDelete.id);
			authors = authors.filter((a) => a.id !== authorToDelete.id);
			showSuccess('Autor eliminado correctamente');
			showDeleteModal = false;
			authorToDelete = null;
		} catch (error) {
			showError('Error al eliminar autor: ' + error.message);
		} finally {
			loading.set(false);
		}
	}
</script>

<div class="space-y-6">
	<div class="flex justify-between items-center">
		<h1 class="text-3xl font-bold">Autores</h1>
		<a href="/authors/create" class="btn btn-primary">
			<Plus size="20" />
			Nuevo Autor
		</a>
	</div>

	{#if authors.length === 0}
		<div class="text-center py-12">
			<p class="text-xl text-base-content/60">No hay autores registrados</p>
			<p class="text-base-content/40 mt-2">Crea el primer autor para comenzar</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each authors as author}
				<div class="relative group">
					<a href="/authors/{author.id}" class="block">
						<AuthorCard {author} />
					</a>

					<div
						class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity space-x-2"
					>
						<button
							class="btn btn-sm btn-neutral btn-circle hover:bg-neutral/80"
							onclick={(e) => {
								e.preventDefault();
								goto(`/authors/${author.id}/edit`);
							}}
						>
							<Edit size="16" />
						</button>
						<button
							class="btn btn-sm btn-error btn-circle hover:bg-error/80"
							onclick={(e) => {
								e.preventDefault();
								confirmDelete(author);
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
	onConfirm={deleteAuthor}
	confirmText="Eliminar"
>
	{#snippet children()}
		<p>
			¿Estás seguro de que deseas eliminar al autor <strong
				>{authorToDelete?.full_name}</strong
			>?
		</p>
		<p class="text-sm text-base-content/60 mt-2">Esta acción no se puede deshacer.</p>
	{/snippet}
</Modal>
