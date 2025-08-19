<script>
	import { getImageUrl } from '$lib/api.js';
	import { BookOpen } from '@lucide/svelte';

	let { books = [] } = $props();

	function chunkBooks(books, size) {
		const chunks = [];
		for (let i = 0; i < books.length; i += size) {
			chunks.push(books.slice(i, i + size));
		}
		return chunks;
	}

	const booksPerShelf = 8;
	const shelves = chunkBooks(books, booksPerShelf);
</script>

<div class="w-full max-w-6xl mx-auto">
	{#if books.length === 0}
		<div class="text-center py-8">
			<BookOpen size="48" class="mx-auto text-base-content/30 mb-4" />
			<p class="text-base-content/60">No hay libros en esta biblioteca</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
			{#each Array(Math.ceil(shelves.length / 2)) as _, columnIndex}
				<div class="space-y-6">
					{#each shelves.slice(columnIndex * 2, (columnIndex + 1) * 2) as shelf, shelfIndex}
						<div class="relative">
							<div
								class="bg-gradient-to-r from-amber-800 to-amber-900 h-2 rounded-full shadow-lg"
							></div>

							<div class="flex items-end justify-start space-x-1 px-2 -mt-1">
								{#each shelf as book, bookIndex}
									<a href="/books/{book.id}" class="group">
										<div
											class="relative transform hover:-translate-y-2 transition-transform duration-200"
										>
											<div
												class="w-8 h-20 rounded-t-sm shadow-md border border-gray-300 flex items-center justify-center text-white text-xs font-bold overflow-hidden"
												style="background: hsl({(bookIndex * 45 +
													columnIndex * 90 +
													shelfIndex * 180) %
													360}, 60%, 50%)"
											>
												{#if book.image}
													<img
														src={getImageUrl('book', book.id)}
														alt={book.title}
														class="w-full h-full object-cover"
													/>
												{:else}
													<div
														class="writing-vertical-rl text-[8px] leading-tight px-1 text-center break-words"
													>
														{book.title.slice(0, 15)}
													</div>
												{/if}
											</div>

											<div
												class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap"
											>
												{book.title}
											</div>
										</div>
									</a>
								{/each}
							</div>

							<div
								class="bg-gradient-to-r from-amber-700 to-amber-800 h-1 rounded-full shadow-sm mt-1"
							></div>
						</div>
					{/each}
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.writing-vertical-rl {
		writing-mode: vertical-rl;
		text-orientation: mixed;
	}
</style>
