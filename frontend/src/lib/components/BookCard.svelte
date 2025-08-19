<script>
	import { getImageUrl } from '$lib/api.js';
	import { BookOpen, Calendar, Hash, FileText } from '@lucide/svelte';

	let { book, showDetails = true } = $props();

	let imageLoaded = $state(false);
	let imageError = $state(false);
	let imageUrl = getImageUrl('book', book.id);
</script>

<div
	class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
>
	<div class="card-body p-0">
		<div class="flex flex-col sm:flex-row">
			<div class="relative flex-shrink-0">
				<div
					class="w-full sm:w-20 h-40 sm:h-28 rounded-t-md sm:rounded-l-md sm:rounded-tr-none overflow-hidden bg-gradient-to-br from-accent/10 to-info/10"
				>
					{#if !imageError}
						<img
							src={imageUrl}
							alt={book.title}
							class="w-full h-full object-cover transition-opacity duration-300 shadow-inner"
							class:opacity-100={imageLoaded}
							class:opacity-0={!imageLoaded}
							onload={() => (imageLoaded = true)}
							onerror={() => (imageError = true)}
						/>
					{/if}

					<div
						class="w-full sm:w-20 h-40 sm:h-28 absolute inset-0 flex items-center justify-center bg-gradient-to-br from-accent/10 to-info/10 transition-opacity duration-300"
						class:opacity-0={imageLoaded && !imageError}
						class:opacity-100={!imageLoaded || imageError}
					>
						<BookOpen size="24" class="text-base-content/40" />
					</div>
				</div>
			</div>

			<div class="flex-1 p-4 sm:p-3 lg:p-4">
				<div class="space-y-2">
					<h3
						class="font-bold text-base lg:text-lg text-base-content group-hover:text-primary transition-colors duration-200 line-clamp-2 leading-tight"
					>
						{book.title}
					</h3>

					<div class="flex items-center gap-2 text-sm text-base-content/70">
						<Calendar size="14" />
						<span>{book.publication_year}</span>
					</div>

					{#if showDetails}
						<div class="flex flex-wrap gap-3 text-xs text-base-content/60">
							{#if book.isbn}
								<div class="flex items-center gap-1">
									<Hash size="12" />
									<span class="truncate max-w-24">ISBN: {book.isbn}</span>
								</div>
							{/if}
							{#if book.pages}
								<div class="flex items-center gap-1">
									<FileText size="12" />
									<span>{book.pages}p</span>
								</div>
							{/if}
						</div>

						{#if book.summary}
							<p
								class="text-xs lg:text-sm text-base-content/60 line-clamp-2 leading-relaxed border-l-2 border-primary/20 pl-2 ml-1"
							>
								{book.summary}
							</p>
						{/if}
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
