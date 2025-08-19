<script>
	let {
		isOpen = $bindable(),
		title = '',
		onConfirm = null,
		confirmText = 'Confirmar',
		cancelText = 'Cancelar',
		children
	} = $props();
</script>

<dialog class="modal" class:modal-open={isOpen}>
	<div class="modal-box">
		<h3 class="text-lg font-bold mb-4">{title}</h3>

		{@render children?.()}

		<div class="modal-action">
			<button class="btn btn-ghost" onclick={() => (isOpen = false)}>
				{cancelText}
			</button>
			{#if onConfirm}
				<button class="btn btn-error" onclick={onConfirm}>
					{confirmText}
				</button>
			{/if}
		</div>
	</div>

	<div class="modal-backdrop" onclick={() => (isOpen = false)}></div>
</dialog>
