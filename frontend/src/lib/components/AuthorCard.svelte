<script>
	import { getImageUrl } from '$lib/api.js';
	import { User } from '@lucide/svelte';

	let { author, showDetails = true } = $props();

	let imageLoaded = $state(false);
	let imageError = $state(false);
	let imageUrl = getImageUrl('author', author.id);
</script>

<div
	class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
>
	<div class="card-body p-0">
		<div class="flex flex-col sm:flex-row">
			<div class="relative flex-shrink-0">
				<div
					class="w-full sm:w-24 h-32 sm:h-24 rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10"
				>
					{#if !imageError}
						<img
							src={imageUrl}
							alt={author.full_name}
							class="w-full h-full object-cover transition-opacity duration-300"
							class:opacity-100={imageLoaded}
							class:opacity-0={!imageLoaded}
							onload={() => (imageLoaded = true)}
							onerror={() => (imageError = true)}
						/>
					{/if}

					<div
						class="w-full sm:w-24 h-32 sm:h-24 absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 transition-opacity duration-300"
						class:opacity-0={imageLoaded && !imageError}
						class:opacity-100={!imageLoaded || imageError}
					>
						<User size="28" class="text-base-content/40" />
					</div>
				</div>
			</div>

			<div class="flex-1 p-4 sm:p-3 lg:p-4">
				<div class="space-y-1">
					<h3
						class="font-bold text-base lg:text-lg text-base-content group-hover:text-primary transition-colors duration-200 line-clamp-2"
					>
						{author.full_name}
					</h3>

					<div class="flex items-center gap-2 text-sm text-base-content/70">
						<div class="w-2 h-2 rounded-full bg-primary/60"></div>
						<span class="truncate">{author.country}</span>
					</div>

					{#if showDetails && author.biography}
						<p
							class="text-xs lg:text-sm text-base-content/60 mt-2 line-clamp-2 leading-relaxed"
						>
							{author.biography}
						</p>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
