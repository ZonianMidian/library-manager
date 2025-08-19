<script>
	import { loading, showError, showSuccess } from '$lib/stores.js';
	import { ArrowLeft, Save, Plus, X } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { api } from '$lib/api.js';

	import BookSelector from '$lib/components/BookSelector.svelte';
	import ImageUpload from '$lib/components/ImageUpload.svelte';
	import BookCard from '$lib/components/BookCard.svelte';

	let form = $state({
		name: '',
		location: '',
		description: ''
	});

	let imageFile = $state(null);
	let errors = $state({});
	let selectedBooks = $state([]);
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

			const libraryData = {
				name: form.name.trim(),
				location: form.location.trim(),
				books: selectedBooks.map((b) => b.id)
			};

			if (form.description.trim()) libraryData.description = form.description.trim();
			if (imageFile) {
				const reader = new FileReader();
				reader.onload = () => {
					libraryData.image = reader.result.split(',')[1];
				};
				reader.readAsDataURL(imageFile);
				await new Promise((resolve) => {
					reader.onloadend = resolve;
				});
			}

			await api.libraries.create(libraryData);
			showSuccess('Biblioteca creada correctamente');
			goto('/libraries');
		} catch (error) {
			if (error.errors) {
				errors = error.errors.reduce((acc, err) => {
					acc[err.field] = err.message;
					return acc;
				}, {});
			} else {
				showError('Error al crear biblioteca: ' + error.message);
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

	function addBook(book) {
		selectedBooks = [...selectedBooks, book];
	}

	function removeBook(bookId) {
		selectedBooks = selectedBooks.filter((b) => b.id !== bookId);
	}
</script>

<div class="max-w-2xl mx-auto space-y-6">
	<div class="flex items-center gap-4">
		<a href="/libraries" class="btn btn-ghost btn-circle">
			<ArrowLeft size="20" />
		</a>
		<h1 class="text-3xl font-bold">Nueva Biblioteca</h1>
	</div>

	<div class="card bg-base-100 shadow-xl">
		<div class="card-body">
			<form onsubmit={handleSubmit} class="space-y-6">
				<div class="flex flex-col items-center">
					<ImageUpload
						onImageChange={handleImageChange}
						onImageRemove={handleImageRemove}
						aspectClass="aspect-[5/3]"
					/>
				</div>

				<div class="form-control">
					<label class="label" for="name">
						<span class="label-text">Nombre *</span>
					</label>
					<input
						id="name"
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
					<label class="label" for="location">
						<span class="label-text">Ubicación *</span>
					</label>
					<input
						id="location"
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
					<label class="label" for="description">
						<span class="label-text">Descripción</span>
					</label>
					<textarea
						id="description"
						class="textarea textarea-bordered h-24"
						bind:value={form.description}
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
									aria-label="Remover libro {book.title}"
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
					<a href="/libraries" class="btn btn-ghost"> Cancelar </a>
					<button type="submit" class="btn btn-primary">
						<Save size="20" />
						Crear Biblioteca
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
