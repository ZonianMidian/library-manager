<script>
	import { loading, showError, showSuccess } from '$lib/stores.js';
	import { ArrowLeft, Save, Plus, X } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { api } from '$lib/api.js';
	import { onMount } from 'svelte';

	import AuthorSelector from '$lib/components/AuthorSelector.svelte';
	import ImageUpload from '$lib/components/ImageUpload.svelte';
	import AuthorCard from '$lib/components/AuthorCard.svelte';

	let form = $state({
		title: '',
		publication_year: new Date().getFullYear(),
		summary: '',
		isbn: '',
		pages: ''
	});

	let imageFile = $state(null);
	let errors = $state({});
	let selectedAuthors = $state([]);
	let showAuthorSelector = $state(false);

	async function handleSubmit(event) {
		event.preventDefault();

		if (!form.title.trim() || !form.publication_year) {
			errors = {
				title: !form.title.trim() ? 'El título es requerido' : '',
				publication_year: !form.publication_year ? 'El año de publicación es requerido' : ''
			};
			return;
		}

		try {
			loading.set(true);

			const bookData = {
				title: form.title.trim(),
				publication_year: parseInt(form.publication_year),
				authors: selectedAuthors.map((a) => a.id)
			};

			if (form.summary.trim()) bookData.summary = form.summary.trim();
			if (form.isbn.trim()) bookData.isbn = form.isbn.trim();
			if (form.pages) bookData.pages = parseInt(form.pages);
			if (imageFile) {
				const reader = new FileReader();
				reader.onload = () => {
					bookData.image = reader.result.split(',')[1];
				};
				reader.readAsDataURL(imageFile);
				await new Promise((resolve) => {
					reader.onloadend = resolve;
				});
			}

			await api.books.create(bookData);
			showSuccess('Libro creado correctamente');
			goto('/books');
		} catch (error) {
			if (error.errors) {
				errors = error.errors.reduce((acc, err) => {
					acc[err.field] = err.message;
					return acc;
				}, {});
			} else {
				showError('Error al crear libro: ' + error.message);
			}
		} finally {
			loading.set(false);
		}
	}

	function handleImageChange(file) {
		imageFile = file;
	}

	function handleImageRemove() {
		imageFile = null;
	}

	function addAuthor(author) {
		selectedAuthors = [...selectedAuthors, author];
	}

	function removeAuthor(authorId) {
		selectedAuthors = selectedAuthors.filter((a) => a.id !== authorId);
	}
</script>

<div class="max-w-2xl mx-auto space-y-6">
	<div class="flex items-center gap-4">
		<a href="/books" class="btn btn-ghost btn-circle">
			<ArrowLeft size="20" />
		</a>
		<h1 class="text-3xl font-bold">Nuevo Libro</h1>
	</div>

	<div class="card bg-base-100 shadow-xl">
		<div class="card-body">
			<form onsubmit={handleSubmit} class="space-y-6">
				<div class="flex flex-col items-center">
					<ImageUpload
						onImageChange={handleImageChange}
						onImageRemove={handleImageRemove}
						aspectClass="aspect-[2/3]"
					/>
				</div>

				<div class="form-control">
					<label class="label" for="title">
						<span class="label-text">Título *</span>
					</label>
					<input
						id="title"
						type="text"
						class="input input-bordered"
						class:input-error={errors.title}
						bind:value={form.title}
						required
					/>
					{#if errors.title}
						<label class="label">
							<span class="label-text-alt text-error">{errors.title}</span>
						</label>
					{/if}
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div class="form-control">
						<label class="label" for="publication_year">
							<span class="label-text">Año de publicación *</span>
						</label>
						<input
							id="publication_year"
							type="number"
							class="input input-bordered"
							class:input-error={errors.publication_year}
							bind:value={form.publication_year}
							min="1000"
							max={new Date().getFullYear() + 10}
							required
						/>
						{#if errors.publication_year}
							<label class="label">
								<span class="label-text-alt text-error"
									>{errors.publication_year}</span
								>
							</label>
						{/if}
					</div>

					<div class="form-control">
						<label class="label" for="pages">
							<span class="label-text">Páginas</span>
						</label>
						<input
							id="pages"
							type="number"
							class="input input-bordered"
							bind:value={form.pages}
							min="1"
						/>
					</div>
				</div>

				<div class="form-control">
					<label class="label" for="isbn">
						<span class="label-text">ISBN</span>
					</label>
					<input
						id="isbn"
						type="text"
						class="input input-bordered"
						bind:value={form.isbn}
					/>
				</div>

				<div class="form-control">
					<label class="label" for="summary">
						<span class="label-text">Resumen</span>
					</label>
					<textarea
						id="summary"
						class="textarea textarea-bordered h-24"
						bind:value={form.summary}
					></textarea>
				</div>

				<div class="form-control">
					<label class="label">
						<span class="label-text">Autores *</span>
					</label>
					<div class="space-y-2">
						{#each selectedAuthors as author}
							<div class="flex items-center gap-2">
								<div class="flex-1">
									<AuthorCard {author} showDetails={false} />
								</div>
								<button
									type="button"
									class="btn btn-error btn-circle btn-sm"
									onclick={() => removeAuthor(author.id)}
									aria-label="Remover autor {author.full_name}"
								>
									<X size="16" />
								</button>
							</div>
						{/each}

						<button
							type="button"
							class="btn btn-outline w-full"
							onclick={() => (showAuthorSelector = true)}
						>
							<Plus size="20" />
							Agregar Autor
						</button>

						{#if errors.authors}
							<label class="label">
								<span class="label-text-alt text-error">{errors.authors}</span>
							</label>
						{/if}
					</div>
				</div>

				<div class="card-actions justify-end">
					<a href="/books" class="btn btn-ghost"> Cancelar </a>
					<button type="submit" class="btn btn-primary">
						<Save size="20" />
						Crear Libro
					</button>
				</div>
			</form>
		</div>
	</div>
</div>

<AuthorSelector
	bind:isOpen={showAuthorSelector}
	onSelect={addAuthor}
	excludeIds={selectedAuthors.map((a) => a.id)}
/>
