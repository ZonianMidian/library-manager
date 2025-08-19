<script>
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import { loading } from '$lib/stores.js';
</script>

<div class="min-h-screen bg-base-100">
	<Navbar />

	<main class="container mx-auto px-4 py-8">
		<slot />
	</main>

	<Toast />

	{#if $loading}
		<LoadingSpinner />
	{/if}
</div>
