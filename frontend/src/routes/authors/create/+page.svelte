<script>
	import { loading, showError, showSuccess } from '$lib/stores.js';
	import { ArrowLeft, Save } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { api } from '$lib/api.js';

	import ImageUpload from '$lib/components/ImageUpload.svelte';

	let form = $state({
		full_name: '',
		country: '',
		biography: ''
	});

	let imageFile = $state(null);
	let errors = $state({});

	async function handleSubmit(event) {
		event.preventDefault();

		if (!form.full_name.trim() || !form.country.trim()) {
			errors = {
				full_name: !form.full_name.trim() ? 'El nombre es requerido' : '',
				country: !form.country.trim() ? 'El país es requerido' : ''
			};
			return;
		}

		try {
			loading.set(true);

			const authorData = {
				full_name: form.full_name.trim(),
				country: form.country.trim()
			};

			if (form.biography.trim()) authorData.biography = form.biography.trim();
			if (imageFile) {
				const reader = new FileReader();
				reader.onload = () => {
					authorData.image = reader.result.split(',')[1];
				};
				reader.readAsDataURL(imageFile);
				await new Promise((resolve) => {
					reader.onloadend = resolve;
				});
			}

			await api.authors.create(authorData);
			showSuccess('Autor creado correctamente');
			goto('/authors');
		} catch (error) {
			if (error.errors) {
				errors = error.errors.reduce((acc, err) => {
					acc[err.field] = err.message;
					return acc;
				}, {});
			} else {
				showError('Error al crear autor: ' + error.message);
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
</script>

<div class="max-w-2xl mx-auto space-y-6">
	<div class="flex items-center gap-4">
		<a href="/authors" class="btn btn-ghost btn-circle">
			<ArrowLeft size="20" />
		</a>
		<h1 class="text-3xl font-bold">Nuevo Autor</h1>
	</div>

	<div class="card bg-base-100 shadow-xl">
		<div class="card-body">
			<form onsubmit={handleSubmit} class="space-y-6">
				<div class="flex flex-col items-center">
					<ImageUpload
						onImageChange={handleImageChange}
						onImageRemove={handleImageRemove}
						aspectClass="aspect-square"
					/>
				</div>

				<div class="form-control">
					<label class="label" for="full_name">
						<span class="label-text">Nombre completo *</span>
					</label>
					<input
						id="full_name"
						type="text"
						class="input input-bordered"
						class:input-error={errors.full_name}
						bind:value={form.full_name}
						required
					/>
					{#if errors.full_name}
						<label class="label">
							<span class="label-text-alt text-error">{errors.full_name}</span>
						</label>
					{/if}
				</div>

				<div class="form-control">
					<label class="label" for="country">
						<span class="label-text">País *</span>
					</label>
					<input
						id="country"
						type="text"
						class="input input-bordered"
						class:input-error={errors.country}
						bind:value={form.country}
						required
					/>
					{#if errors.country}
						<label class="label">
							<span class="label-text-alt text-error">{errors.country}</span>
						</label>
					{/if}
				</div>

				<div class="form-control">
					<label class="label" for="biography">
						<span class="label-text">Biografía</span>
					</label>
					<textarea
						id="biography"
						class="textarea textarea-bordered h-24"
						bind:value={form.biography}
					></textarea>
				</div>

				<div class="card-actions justify-end">
					<a href="/authors" class="btn btn-ghost"> Cancelar </a>
					<button type="submit" class="btn btn-primary">
						<Save size="20" />
						Crear Autor
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
