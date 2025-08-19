<script>
	import { toasts } from '$lib/stores.js';
	import { CheckCircle, XCircle, Info } from '@lucide/svelte';
</script>

<div class="toast toast-top toast-end z-50">
	{#each $toasts as toast (toast.id)}
		<div
			class="alert"
			class:alert-success={toast.type === 'success'}
			class:alert-error={toast.type === 'error'}
			class:alert-info={toast.type === 'info'}
		>
			{#if toast.type === 'success'}
				<CheckCircle size="20" />
			{:else if toast.type === 'error'}
				<XCircle size="20" />
			{:else}
				<Info size="20" />
			{/if}
			<span>{toast.message}</span>
		</div>
	{/each}
</div>
