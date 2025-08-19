<script>
	import { api } from '$lib/api.js';
	import { onMount } from 'svelte';
	import { Search } from '@lucide/svelte';
	import AuthorCard from './AuthorCard.svelte';

	let { isOpen = $bindable(), onSelect = () => {}, excludeIds = [] } = $props();

	let authors = $state([]);
	let searchTerm = $state('');
	let filteredAuthors = $state([]);

	onMount(async () => {
		try {
			authors = await api.authors.getAll();
			filteredAuthors = authors.filter((author) => !excludeIds.includes(author.id));
		} catch (error) {
			console.error('Error loading authors:', error);
		}
	});

	$effect(() => {
		if (searchTerm) {
			filteredAuthors = authors.filter(
				(author) =>
					!excludeIds.includes(author.id) &&
					author.full_name.toLowerCase().includes(searchTerm.toLowerCase())
			);
		} else {
			filteredAuthors = authors.filter((author) => !excludeIds.includes(author.id));
		}
	});

	function selectAuthor(author) {
		onSelect(author);
		isOpen = false;
	}
</script>

<dialog class="modal" class:modal-open={isOpen}>
	<div class="modal-box max-w-2xl">
		<h3 class="text-lg font-bold mb-4">Seleccionar Autor</h3>

		<div class="relative mb-4">
			<Search
				size="20"
				class="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50"
			/>
			<input
				type="text"
				placeholder="Buscar autor..."
				class="input input-bordered w-full pl-10"
				bind:value={searchTerm}
			/>
		</div>

		<div class="max-h-96 overflow-y-auto space-y-2">
			{#each filteredAuthors as author}
				<div class="cursor-pointer" onclick={() => selectAuthor(author)}>
					<AuthorCard {author} showDetails={false} />
				</div>
			{:else}
				<p class="text-center text-base-content/60 py-4">No hay autores disponibles</p>
			{/each}
		</div>

		<div class="modal-action">
			<button class="btn btn-ghost" onclick={() => (isOpen = false)}> Cancelar </button>
		</div>
	</div>

	<div class="modal-backdrop" onclick={() => (isOpen = false)}></div>
</dialog>
