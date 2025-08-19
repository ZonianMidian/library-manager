<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { api } from '$lib/api.js';
	import { loading, showError, showSuccess } from '$lib/stores.js';
	import { Plus, Edit, Trash2 } from '@lucide/svelte';
	import LibraryCard from '$lib/components/LibraryCard.svelte';
	import Modal from '$lib/components/Modal.svelte';

	let libraries = $state([]);
	let showDeleteModal = $state(false);
	let libraryToDelete = $state(null);

	onMount(async () => {
		await loadLibraries();
	});

	async function loadLibraries() {
		try {
			loading.set(true);
			libraries = await api.libraries.getAll();
		} catch (error) {
			showError('Error al cargar bibliotecas: ' + error.message);
		} finally {
			loading.set(false);
		}
	}

	function confirmDelete(library) {
		libraryToDelete = library;
		showDeleteModal = true;
	}

	async function deleteLibrary() {
		if (!libraryToDelete) return;

		try {
			loading.set(true);
			await api.libraries.delete(libraryToDelete.id);
			libraries = libraries.filter((l) => l.id !== libraryToDelete.id);
			showSuccess('Biblioteca eliminada correctamente');
			showDeleteModal = false;
			libraryToDelete = null;
		} catch (error) {
			showError('Error al eliminar biblioteca: ' + error.message);
		} finally {
			loading.set(false);
		}
	}
</script>

<div class="space-y-6">
	<div class="flex justify-between items-center">
		<h1 class="text-3xl font-bold">Bibliotecas</h1>
		<a href="/libraries/create" class="btn btn-primary">
			<Plus size="20" />
			Nueva Biblioteca
		</a>
	</div>

	{#if libraries.length === 0}
		<div class="text-center py-12">
			<p class="text-xl text-base-content/60">No hay bibliotecas registradas</p>
			<p class="text-base-content/40 mt-2">Crea la primera biblioteca para comenzar</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each libraries as library}
				<div class="relative group">
					<a href="/libraries/{library.id}" class="block">
						<LibraryCard {library} />
					</a>

					<div
						class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity space-x-2"
					>
						<button
							class="btn btn-sm btn-neutral btn-circle hover:bg-neutral/80"
							onclick={(e) => {
								e.preventDefault();
								goto(`/libraries/${library.id}/edit`);
							}}
						>
							<Edit size="16" />
						</button>
						<button
							class="btn btn-sm btn-error btn-circle hover:bg-error/80"
							onclick={(e) => {
								e.preventDefault();
								confirmDelete(library);
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
	onConfirm={deleteLibrary}
	confirmText="Eliminar"
>
	{#snippet children()}
		<p>
			¿Estás seguro de que deseas eliminar la biblioteca <strong
				>{libraryToDelete?.name}</strong
			>?
		</p>
		<p class="text-sm text-base-content/60 mt-2">Esta acción no se puede deshacer.</p>
	{/snippet}
</Modal>
