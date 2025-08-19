<script>
	import { goto } from '$app/navigation';
	import { api, getImageUrl } from '$lib/api.js';
	import { loading, showError, showSuccess } from '$lib/stores.js';
	import { ArrowLeft, Save, Plus, X } from '@lucide/svelte';
	import ImageUpload from '$lib/components/ImageUpload.svelte';
	import AuthorSelector from '$lib/components/AuthorSelector.svelte';
	import AuthorCard from '$lib/components/AuthorCard.svelte';

	let { data } = $props();
	let originalBook = data.book;
	let allAuthors = data.allAuthors;

	let form = $state({
		title: originalBook.title,
		publication_year: originalBook.publication_year,
		summary: originalBook.summary || '',
		isbn: originalBook.isbn || '',
		pages: originalBook.pages || ''
	});

	let imageFile = $state(null);
	let removeCurrentImage = $state(false);
	let errors = $state({});
	let selectedAuthors = $state([...originalBook.authors]);
	let showAuthorSelector = $state(false);

	async function handleSubmit(event) {
		event.preventDefault();

		if (!form.title.trim() || !form.publication_year || selectedAuthors.length === 0) {
			errors = {
				title: !form.title.trim() ? 'El título es requerido' : '',
				publication_year: !form.publication_year
					? 'El año de publicación es requerido'
					: '',
				authors: selectedAuthors.length === 0 ? 'Debe seleccionar al menos un autor' : ''
			};
			return;
		}

		try {
			loading.set(true);

			const updateData = {
				title: form.title.trim(),
				publication_year: parseInt(form.publication_year),
				authors: selectedAuthors.map((a) => a.id)
			};

			if (form.summary.trim()) updateData.summary = form.summary.trim();
			if (form.isbn.trim()) updateData.isbn = form.isbn.trim();
			if (form.pages) updateData.pages = parseInt(form.pages);

			if (imageFile) {
				const reader = new FileReader();
				reader.onload = () => {
					updateData.image = reader.result.split(',')[1];
				};
				reader.readAsDataURL(imageFile);
				await new Promise((resolve) => {
					reader.onloadend = resolve;
				});
			} else if (removeCurrentImage) {
				updateData.image = null;
			}

			await api.books.update(originalBook.id, updateData);
			showSuccess('Libro actualizado correctamente');
			goto(`/books/${originalBook.id}`);
		} catch (error) {
			if (error.errors) {
				errors = error.errors.reduce((acc, err) => {
					acc[err.field] = err.message;
					return acc;
				}, {});
			} else {
				showError('Error al actualizar libro: ' + error.message);
			}
		} finally {
			loading.set(false);
		}
	}

	function handleImageChange(file) {
		imageFile = file;
		removeCurrentImage = false;
	}

	function handleImageRemove() {
		imageFile = null;
		removeCurrentImage = true;
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
		<a href="/books/{originalBook.id}" class="btn btn-ghost btn-circle">
			<ArrowLeft size="20" />
		</a>
		<h1 class="text-3xl font-bold">Editar Libro</h1>
	</div>

	<div class="card bg-base-100 shadow-xl">
		<div class="card-body">
			<form onsubmit={handleSubmit} class="space-y-6">
				<div class="flex flex-col items-center">
					<ImageUpload
						currentImage={removeCurrentImage
							? null
							: getImageUrl('book', originalBook.id)}
						onImageChange={handleImageChange}
						onImageRemove={handleImageRemove}
						aspectClass="aspect-[2/3]"
					/>
				</div>

				<div class="form-control">
					<label class="label">
						<span class="label-text">Título *</span>
					</label>
					<input
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
						<label class="label">
							<span class="label-text">Año de publicación *</span>
						</label>
						<input
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
						<label class="label">
							<span class="label-text">Páginas</span>
						</label>
						<input
							type="number"
							class="input input-bordered"
							bind:value={form.pages}
							min="1"
						/>
					</div>
				</div>

				<div class="form-control">
					<label class="label">
						<span class="label-text">ISBN</span>
					</label>
					<input type="text" class="input input-bordered" bind:value={form.isbn} />
				</div>

				<div class="form-control">
					<label class="label">
						<span class="label-text">Resumen</span>
					</label>
					<textarea class="textarea textarea-bordered h-24" bind:value={form.summary}
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
					<a href="/books/{originalBook.id}" class="btn btn-ghost"> Cancelar </a>
					<button type="submit" class="btn btn-primary">
						<Save size="20" />
						Guardar Cambios
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
