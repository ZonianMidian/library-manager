<script>
	import { goto } from '$app/navigation';
	import { api, getImageUrl } from '$lib/api.js';
	import { loading, showError, showSuccess } from '$lib/stores.js';
	import { ArrowLeft, Save, Plus, X } from '@lucide/svelte';
	import ImageUpload from '$lib/components/ImageUpload.svelte';
	import BookSelector from '$lib/components/BookSelector.svelte';
	import BookCard from '$lib/components/BookCard.svelte';

	let { data } = $props();
	let originalLibrary = data.library;
	let allBooks = data.allBooks;

	let form = $state({
		name: originalLibrary.name,
		location: originalLibrary.location,
		description: originalLibrary.description || ''
	});

	let imageFile = $state(null);
	let removeCurrentImage = $state(false);
	let errors = $state({});
	let selectedBooks = $state([...originalLibrary.books]);
	let showBookSelector = $state(false);

	async function handleSubmit(event) {
		event.preventDefault();

		if (!form.name.trim() || !form.location.trim()) {
			errors = {
				name: !form.name.trim() ? 'El nombre es requerido' : '',
				location: !form.location.trim() ? 'La ubicación es requerida' : ''
			};
			return;
		}

		try {
			loading.set(true);

			const updateData = {
				name: form.name.trim(),
				location: form.location.trim(),
				books: selectedBooks.map((b) => b.id)
			};

			if (form.description.trim()) updateData.description = form.description.trim();

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

			await api.libraries.update(originalLibrary.id, updateData);
			showSuccess('Biblioteca actualizada correctamente');
			goto(`/libraries/${originalLibrary.id}`);
		} catch (error) {
			if (error.errors) {
				errors = error.errors.reduce((acc, err) => {
					acc[err.field] = err.message;
					return acc;
				}, {});
			} else {
				showError('Error al actualizar biblioteca: ' + error.message);
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

	function addBook(book) {
		selectedBooks = [...selectedBooks, book];
	}

	function removeBook(bookId) {
		selectedBooks = selectedBooks.filter((b) => b.id !== bookId);
	}
</script>

<div class="max-w-2xl mx-auto space-y-6">
	<div class="flex items-center gap-4">
		<a href="/libraries/{originalLibrary.id}" class="btn btn-ghost btn-circle">
			<ArrowLeft size="20" />
		</a>
		<h1 class="text-3xl font-bold">Editar Biblioteca</h1>
	</div>

	<div class="card bg-base-100 shadow-xl">
		<div class="card-body">
			<form onsubmit={handleSubmit} class="space-y-6">
				<div class="flex flex-col items-center">
					<ImageUpload
						currentImage={removeCurrentImage
							? null
							: getImageUrl('library', originalLibrary.id)}
						onImageChange={handleImageChange}
						onImageRemove={handleImageRemove}
						aspectClass="aspect-[5/3]"
					/>
				</div>

				<div class="form-control">
					<label class="label">
						<span class="label-text">Nombre *</span>
					</label>
					<input
						type="text"
						class="input input-bordered"
						class:input-error={errors.name}
						bind:value={form.name}
						required
					/>
					{#if errors.name}
						<label class="label">
							<span class="label-text-alt text-error">{errors.name}</span>
						</label>
					{/if}
				</div>

				<div class="form-control">
					<label class="label">
						<span class="label-text">Ubicación *</span>
					</label>
					<input
						type="text"
						class="input input-bordered"
						class:input-error={errors.location}
						bind:value={form.location}
						required
					/>
					{#if errors.location}
						<label class="label">
							<span class="label-text-alt text-error">{errors.location}</span>
						</label>
					{/if}
				</div>

				<div class="form-control">
					<label class="label">
						<span class="label-text">Descripción</span>
					</label>
					<textarea class="textarea textarea-bordered h-24" bind:value={form.description}
					></textarea>
				</div>

				<div class="form-control">
					<label class="label">
						<span class="label-text">Libros</span>
					</label>
					<div class="space-y-2">
						{#each selectedBooks as book}
							<div class="flex items-center gap-2">
								<div class="flex-1">
									<BookCard {book} showDetails={false} />
								</div>
								<button
									type="button"
									class="btn btn-error btn-circle btn-sm"
									onclick={() => removeBook(book.id)}
								>
									<X size="16" />
								</button>
							</div>
						{/each}

						<button
							type="button"
							class="btn btn-outline w-full"
							onclick={() => (showBookSelector = true)}
						>
							<Plus size="20" />
							Agregar Libro
						</button>
					</div>
				</div>

				<div class="card-actions justify-end">
					<a href="/libraries/{originalLibrary.id}" class="btn btn-ghost"> Cancelar </a>
					<button type="submit" class="btn btn-primary">
						<Save size="20" />
						Guardar Cambios
					</button>
				</div>
			</form>
		</div>
	</div>
</div>

<BookSelector
	bind:isOpen={showBookSelector}
	onSelect={addBook}
	excludeIds={selectedBooks.map((b) => b.id)}
/>
