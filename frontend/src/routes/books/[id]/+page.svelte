<script>
	import { goto } from '$app/navigation';
	import { getImageUrl } from '$lib/api.js';
	import {
		ArrowLeft,
		Edit,
		BookOpen,
		Calendar,
		Hash,
		FileText,
		User,
		Award
	} from '@lucide/svelte';
	import AuthorCard from '$lib/components/AuthorCard.svelte';

	let { data } = $props();
	let book = $state(data.book);

	let imageLoaded = $state(false);
	let imageError = $state(false);
	let imageUrl = getImageUrl('book', book.id);
</script>

<div class="min-h-screen bg-gradient-to-br from-base-100 to-base-200/50">
	<div class="bg-base-100 shadow-sm border-b border-base-300/50">
		<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-4">
					<a href="/books" class="btn btn-ghost btn-circle hover:bg-primary/10">
						<ArrowLeft size="20" />
					</a>
					<div>
						<h1 class="text-2xl lg:text-3xl font-bold text-base-content">
							Detalles del Libro
						</h1>
						<p class="text-sm text-base-content/60">Información completa y autores</p>
					</div>
				</div>
				<div class="flex gap-2">
					<a href="/books/{book.id}/edit" class="btn btn-primary btn-sm lg:btn-md">
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
								class="w-64 h-80 lg:w-72 lg:h-96 rounded-xl overflow-hidden bg-gradient-to-br from-accent/10 to-info/10 shadow-2xl"
							>
								{#if !imageError}
									<img
										src={imageUrl}
										alt={book.title}
										class="w-full h-full object-cover transition-opacity duration-300"
										class:opacity-100={imageLoaded}
										class:opacity-0={!imageLoaded}
										onload={() => (imageLoaded = true)}
										onerror={() => (imageError = true)}
									/>
								{/if}

								<div
									class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-accent/10 to-info/10 transition-opacity duration-300"
									class:opacity-0={imageLoaded && !imageError}
									class:opacity-100={!imageLoaded || imageError}
								>
									<BookOpen size="64" class="text-base-content/30" />
								</div>
							</div>
						</div>
					</div>

					<div class="flex-1 space-y-6">
						<div class="space-y-3">
							<h2
								class="text-3xl lg:text-4xl font-bold text-base-content leading-tight"
							>
								{book.title}
							</h2>

							<div class="flex items-center gap-2 text-xl text-base-content/70">
								<Calendar size="20" class="text-primary" />
								<span class="font-medium">{book.publication_year}</span>
							</div>
						</div>

						<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{#if book.isbn}
								<div class="stat bg-base-200/50 rounded-lg p-4">
									<div class="stat-figure text-primary">
										<Hash size="24" />
									</div>
									<div class="stat-title text-xs">ISBN</div>
									<div class="stat-value text-sm font-mono break-all">
										{book.isbn}
									</div>
								</div>
							{/if}

							{#if book.pages}
								<div class="stat bg-base-200/50 rounded-lg p-4">
									<div class="stat-figure text-secondary">
										<FileText size="24" />
									</div>
									<div class="stat-title text-xs">Páginas</div>
									<div class="stat-value text-lg">{book.pages}</div>
								</div>
							{/if}
						</div>

						{#if book.summary}
							<div class="space-y-3">
								<h3
									class="text-xl font-semibold text-base-content flex items-center gap-2"
								>
									Sinopsis
								</h3>
								<div
									class="bg-gradient-to-r from-base-200/30 to-base-300/20 rounded-lg p-6 border-l-4 border-primary/30"
								>
									<p
										class="text-base-content/80 leading-relaxed text-sm lg:text-base"
									>
										{book.summary}
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
									>Agregado: {new Date(book.created_at).toLocaleDateString(
										'es-ES',
										{
											year: 'numeric',
											month: 'long',
											day: 'numeric'
										}
									)}</span
								>
							</div>
							{#if book.updated_at !== book.created_at}
								<div class="flex items-center gap-2">
									<Calendar size="14" />
									<span
										>Actualizado: {new Date(book.updated_at).toLocaleDateString(
											'es-ES',
											{
												year: 'numeric',
												month: 'long',
												day: 'numeric'
											}
										)}</span
									>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>

		{#if book.authors && book.authors.length > 0}
			<div class="space-y-6">
				<div class="flex items-center justify-between">
					<h3
						class="text-2xl lg:text-3xl font-bold text-base-content flex items-center gap-3"
					>
						<Award size="28" class="text-primary" />
						{book.authors.length === 1 ? 'Autor' : 'Autores'}
					</h3>
					<div class="badge badge-primary badge-lg">
						{book.authors.length}
						{book.authors.length === 1 ? 'autor' : 'autores'}
					</div>
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{#each book.authors as author}
						<a href="/authors/{author.id}" class="group">
							<AuthorCard {author} />
						</a>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>
