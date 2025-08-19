<script>
	import { goto } from '$app/navigation';
	import { getImageUrl } from '$lib/api.js';
	import { ArrowLeft, Edit, User, MapPin, Calendar, BookOpen, Globe } from '@lucide/svelte';
	import BookCard from '$lib/components/BookCard.svelte';

	let { data } = $props();
	let author = $state(data.author);

	let imageLoaded = $state(false);
	let imageError = $state(false);
	let imageUrl = getImageUrl('author', author.id);
</script>

<div class="min-h-screen bg-gradient-to-br from-base-100 to-base-200/50">
	<div class="bg-base-100 shadow-sm border-b border-base-300/50">
		<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-4">
					<a href="/authors" class="btn btn-ghost btn-circle hover:bg-primary/10">
						<ArrowLeft size="20" />
					</a>
					<div>
						<h1 class="text-2xl lg:text-3xl font-bold text-base-content">
							Perfil del Autor
						</h1>
						<p class="text-sm text-base-content/60">Información detallada y obras</p>
					</div>
				</div>
				<div class="flex gap-2">
					<a href="/authors/{author.id}/edit" class="btn btn-primary btn-sm lg:btn-md">
						<Edit size="16" />
						<span class="hidden sm:inline">Editar</span>
					</a>
				</div>
			</div>
		</div>
	</div>

	<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
		<div class="card bg-base-100 shadow-xl border border-base-300/20">
			<div class="card-body p-8">
				<div class="flex flex-col lg:flex-row gap-8">
					<div class="flex-shrink-0 mx-auto lg:mx-0">
						<div class="relative">
							<div
								class="w-48 h-48 lg:w-56 lg:h-56 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 shadow-lg"
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
									class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 transition-opacity duration-300"
									class:opacity-0={imageLoaded && !imageError}
									class:opacity-100={!imageLoaded || imageError}
								>
									<User size="64" class="text-base-content/30" />
								</div>
							</div>

							<div
								class="absolute -inset-1 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl -z-10"
							></div>
						</div>
					</div>

					<div class="flex-1 space-y-6">
						<div class="space-y-3">
							<h2
								class="text-3xl lg:text-4xl font-bold text-base-content leading-tight"
							>
								{author.full_name}
							</h2>

							<div class="flex flex-wrap gap-4 text-base-content/70">
								<div class="flex items-center gap-2">
									<Globe size="18" class="text-primary" />
									<span class="font-medium">{author.country}</span>
								</div>

								{#if author.books && author.books.length > 0}
									<div class="flex items-center gap-2">
										<BookOpen size="18" class="text-secondary" />
										<span
											>{author.books.length}
											{author.books.length === 1 ? 'libro' : 'libros'}</span
										>
									</div>
								{/if}
							</div>
						</div>

						{#if author.biography}
							<div class="space-y-3">
								<h3
									class="text-xl font-semibold text-base-content flex items-center gap-2"
								>
									Biografía
								</h3>
								<div
									class="bg-base-200/50 rounded-lg p-4 border-l-4 border-primary/30"
								>
									<p
										class="text-base-content/80 leading-relaxed text-sm lg:text-base"
									>
										{author.biography}
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
									>Creado: {new Date(author.created_at).toLocaleDateString(
										'es-ES',
										{
											year: 'numeric',
											month: 'long',
											day: 'numeric'
										}
									)}</span
								>
							</div>
							{#if author.updated_at !== author.created_at}
								<div class="flex items-center gap-2">
									<Calendar size="14" />
									<span
										>Actualizado: {new Date(
											author.updated_at
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
			<div class="flex items-center justify-between">
				<h3 class="text-2xl lg:text-3xl font-bold text-base-content">Obras del Autor</h3>
				{#if author.books && author.books.length > 0}
					<div class="badge badge-primary badge-lg">
						{author.books.length}
						{author.books.length === 1 ? 'libro' : 'libros'}
					</div>
				{/if}
			</div>

			{#if author.books && author.books.length > 0}
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{#each author.books as book}
						<a href="/books/{book.id}" class="group">
							<BookCard {book} />
						</a>
					{/each}
				</div>
			{:else}
				<div class="card bg-gradient-to-br from-base-200/50 to-base-300/30 shadow-inner">
					<div class="card-body text-center py-12">
						<BookOpen size="48" class="mx-auto text-base-content/30 mb-4" />
						<h4 class="text-lg font-semibold text-base-content/70 mb-2">
							Sin obras registradas
						</h4>
						<p class="text-base-content/60 max-w-md mx-auto">
							Este autor aún no tiene libros asociados en nuestra biblioteca.
						</p>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
