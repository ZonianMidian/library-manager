<script>
	import { goto } from '$app/navigation';
	import { getImageUrl } from '$lib/api.js';
	import {
		ArrowLeft,
		Edit,
		Building2,
		MapPin,
		Calendar,
		BookOpen,
		BarChart3
	} from '@lucide/svelte';
	import LibraryBookshelf from '$lib/components/LibraryBookshelf.svelte';

	let { data } = $props();
	let library = $state(data.library);

	let imageLoaded = $state(false);
	let imageError = $state(false);
	let imageUrl = getImageUrl('library', library.id);
</script>

<div class="min-h-screen bg-gradient-to-br from-base-100 to-base-200/50">
	<div class="bg-base-100 shadow-sm border-b border-base-300/50">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-4">
					<a href="/libraries" class="btn btn-ghost btn-circle hover:bg-primary/10">
						<ArrowLeft size="20" />
					</a>
					<div>
						<h1 class="text-2xl lg:text-3xl font-bold text-base-content">Biblioteca</h1>
						<p class="text-sm text-base-content/60">Información completa y colección</p>
					</div>
				</div>
				<div class="flex gap-2">
					<a href="/libraries/{library.id}/edit" class="btn btn-primary btn-sm lg:btn-md">
						<Edit size="16" />
						<span class="hidden sm:inline">Editar</span>
					</a>
				</div>
			</div>
		</div>
	</div>

	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
		<div class="card bg-base-100 shadow-xl border border-base-300/20">
			<div class="card-body p-8">
				<div class="flex flex-col xl:flex-row gap-8">
					<div class="flex-shrink-0 mx-auto xl:mx-0">
						<div class="relative">
							<div
								class="w-80 h-48 lg:w-96 lg:h-56 rounded-2xl overflow-hidden bg-gradient-to-r from-success/10 via-info/10 to-warning/10 shadow-lg"
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
									<Building2 size="64" class="text-base-content/30" />
								</div>

								<div
									class="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"
								></div>
							</div>

							<div
								class="absolute -inset-1 bg-gradient-to-r from-success/20 via-info/20 to-warning/20 rounded-2xl -z-10"
							></div>
						</div>
					</div>

					<div class="flex-1 space-y-6">
						<div class="space-y-4">
							<h2
								class="text-3xl lg:text-4xl font-bold text-base-content leading-tight"
							>
								{library.name}
							</h2>

							<div class="flex items-start gap-3 text-base-content/70">
								<MapPin size="20" class="text-primary mt-1 flex-shrink-0" />
								<span class="font-medium text-lg">{library.location}</span>
							</div>
						</div>

						<div
							class="stats stats-vertical sm:stats-horizontal shadow-lg bg-gradient-to-r from-base-200/50 to-base-300/30"
						>
							<div class="stat place-items-center">
								<div class="stat-figure text-primary">
									<BookOpen size="32" />
								</div>
								<div class="stat-title">Libros</div>
								<div class="stat-value text-primary">
									{library.books?.length || 0}
								</div>
								<div class="stat-desc">en la colección</div>
							</div>
						</div>

						{#if library.description}
							<div class="space-y-3">
								<h3
									class="text-xl font-semibold text-base-content flex items-center gap-2"
								>
									Acerca de esta biblioteca
								</h3>
								<div
									class="bg-gradient-to-r from-base-200/30 to-base-300/20 rounded-lg p-6 border-l-4 border-primary/30"
								>
									<p
										class="text-base-content/80 leading-relaxed text-sm lg:text-base"
									>
										{library.description}
									</p>
								</div>
							</div>
						{/if}

						<div
							class="flex flex-wrap gap-4 text-sm text-base-content/60 pt-4 border-t border-base-300/30"
						>
							<div class="flex items-center gap-2">
								<Calendar size="14" />
								<span
									>Agregada: {new Date(library.created_at).toLocaleDateString(
										'es-ES',
										{
											year: 'numeric',
											month: 'long',
											day: 'numeric'
										}
									)}</span
								>
							</div>
							{#if library.updated_at !== library.created_at}
								<div class="flex items-center gap-2">
									<Calendar size="14" />
									<span
										>Actualizada: {new Date(
											library.updated_at
										).toLocaleDateString('es-ES', {
											year: 'numeric',
											month: 'long',
											day: 'numeric'
										})}</span
									>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="space-y-6">
			<div class="text-center space-y-2">
				<h3
					class="text-2xl lg:text-3xl font-bold text-base-content flex items-center justify-center gap-3"
				>
					<BookOpen size="28" class="text-primary" />
					Estantería Digital
				</h3>
				<p class="text-base-content/60">
					Explora la colección completa de {library.books?.length || 0} libros
				</p>
			</div>

			{#if library.books && library.books.length > 0}
				<div
					class="card bg-gradient-to-br from-amber-50/80 to-orange-50/80 dark:from-amber-900/20 dark:to-orange-900/20 shadow-xl border border-amber-200/30 dark:border-amber-800/30"
				>
					<div class="card-body p-8 lg:p-12">
						<LibraryBookshelf books={library.books} />
					</div>
				</div>
			{:else}
				<div class="card bg-gradient-to-br from-base-200/50 to-base-300/30 shadow-inner">
					<div class="card-body text-center py-16">
						<BookOpen size="64" class="mx-auto text-base-content/20 mb-6" />
						<h4 class="text-xl font-semibold text-base-content/70 mb-3">
							Biblioteca vacía
						</h4>
						<p class="text-base-content/60 max-w-lg mx-auto">
							Esta biblioteca aún no tiene libros en su colección. ¡Comienza agregando
							algunos libros para crear una estantería increíble!
						</p>
						<div class="mt-6">
							<a href="/books" class="btn btn-primary">
								<BookOpen size="16" />
								Explorar libros
							</a>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
