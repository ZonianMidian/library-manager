<script>
	import { getImageUrl } from '$lib/api.js';
	import { Building2, MapPin } from '@lucide/svelte';

	let { library, showDetails = true } = $props();

	let imageLoaded = $state(false);
	let imageError = $state(false);
	let imageUrl = getImageUrl('library', library.id);
</script>

<div
	class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
>
	<div class="card-body p-0">
		<div class="flex flex-col">
			<div class="relative">
				<div
					class="w-full h-60 sm:h-50 rounded-t-2xl overflow-hidden bg-gradient-to-r from-success/10 via-info/10 to-warning/10"
				>
					{#if !imageError}
						<img
							src={imageUrl}
							alt={library.name}
							class="w-full h-full object-cover transition-opacity duration-300"
							class:opacity-100={imageLoaded}
							class:opacity-0={!imageLoaded}
							onload={() => (imageLoaded = true)}
							onerror={() => (imageError = true)}
						/>
					{/if}

					<div
						class="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-success/10 via-info/10 to-warning/10 transition-opacity duration-300"
						class:opacity-0={imageLoaded && !imageError}
						class:opacity-100={!imageLoaded || imageError}
					>
						<Building2 size="32" class="text-base-content/40" />
					</div>
				</div>

				<div
					class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-t-2xl"
				></div>
			</div>

			<div class="p-4 sm:p-3 lg:p-4">
				<div class="space-y-2">
					<h3
						class="font-bold text-base lg:text-lg text-base-content group-hover:text-primary transition-colors duration-200 line-clamp-1"
					>
						{library.name}
					</h3>

					<div class="flex items-start gap-2 text-sm text-base-content/70">
						<MapPin size="14" class="mt-0.5 flex-shrink-0" />
						<span class="line-clamp-2 leading-relaxed">{library.location}</span>
					</div>

					{#if showDetails && library.description}
						<div class="mt-3 pt-2 border-t border-base-300/50">
							<p
								class="text-xs lg:text-sm text-base-content/60 line-clamp-3 leading-relaxed"
							>
								{library.description}
							</p>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
