<script>
	import { Camera, X } from '@lucide/svelte';

	let {
		currentImage = null,
		onImageChange = () => {},
		onImageRemove = () => {},
		aspectClass = 'aspect-square'
	} = $props();

	let fileInput;
	let imagePreview = $state(currentImage);

	function handleFileSelect(event) {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				imagePreview = e.target.result;
				onImageChange(file);
			};
			reader.readAsDataURL(file);
		}
	}

	function removeImage() {
		imagePreview = null;
		onImageRemove();
		if (fileInput) fileInput.value = '';
	}
</script>

<div
	class={`relative ${aspectClass} w-full max-w-xs mx-auto border-2 border-dashed border-gray-300 rounded-lg overflow-hidden hover:border-primary transition-colors`}
>
	{#if imagePreview}
		<img src={imagePreview} alt="Preview" class="w-full h-full object-cover" />
		<button
			type="button"
			class="absolute top-2 right-2 btn btn-circle btn-sm btn-error"
			onclick={removeImage}
		>
			<X size="16" />
		</button>
	{:else}
		<button
			type="button"
			class="w-full h-full flex flex-col items-center justify-center text-gray-500 hover:text-primary transition-colors"
			onclick={() => fileInput.click()}
		>
			<Camera size="32" />
			<span class="mt-2 text-sm">Agregar imagen</span>
		</button>
	{/if}

	<input
		bind:this={fileInput}
		type="file"
		accept="image/*"
		class="hidden"
		onchange={handleFileSelect}
	/>
</div>
