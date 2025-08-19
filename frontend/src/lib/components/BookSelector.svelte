<script>
	import { api } from '$lib/api.js';
	import { onMount } from 'svelte';
	import { Search } from '@lucide/svelte';
	import BookCard from './BookCard.svelte';

	let { isOpen = $bindable(), onSelect = () => {}, excludeIds = [] } = $props();

	let books = $state([]);
	let searchTerm = $state('');
	let filteredBooks = $state([]);

	onMount(async () => {
		try {
			books = await api.books.getAll();
			filteredBooks = books.filter((book) => !excludeIds.includes(book.id));
		} catch (error) {
			console.error('Error loading books:', error);
		}
	});

	$effect(() => {
		if (searchTerm) {
			filteredBooks = books.filter(
				(book) =>
					!excludeIds.includes(book.id) &&
					book.title.toLowerCase().includes(searchTerm.toLowerCase())
			);
		} else {
			filteredBooks = books.filter((book) => !excludeIds.includes(book.id));
		}
	});

	function selectBook(book) {
		onSelect(book);
		isOpen = false;
	}
</script>

<dialog class="modal" class:modal-open={isOpen}>
	<div class="modal-box max-w-2xl">
		<h3 class="text-lg font-bold mb-4">Seleccionar Libro</h3>

		<div class="relative mb-4">
			<Search
				size="20"
				class="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50"
			/>
			<input
				type="text"
				placeholder="Buscar libro..."
				class="input input-bordered w-full pl-10"
				bind:value={searchTerm}
			/>
		</div>

		<div class="max-h-96 overflow-y-auto space-y-2">
			{#each filteredBooks as book}
				<div class="cursor-pointer" onclick={() => selectBook(book)}>
					<BookCard {book} showDetails={false} />
				</div>
			{:else}
				<p class="text-center text-base-content/60 py-4">No hay libros disponibles</p>
			{/each}
		</div>

		<div class="modal-action">
			<button class="btn btn-ghost" onclick={() => (isOpen = false)}> Cancelar </button>
		</div>
	</div>

	<div class="modal-backdrop" onclick={() => (isOpen = false)}></div>
</dialog>
