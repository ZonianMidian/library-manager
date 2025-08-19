import { writable } from 'svelte/store';

export const loading = writable(false);

export const config = writable({});
export const toasts = writable([]);

export function showToast(message, type = 'info') {
	const id = Date.now();
	toasts.update((t) => [...t, { id, message, type }]);
	setTimeout(() => {
		toasts.update((t) => t.filter((toast) => toast.id !== id));
	}, 5000);
}

export function showSuccess(message) {
	showToast(message, 'success');
}

export function showError(message) {
	showToast(message, 'error');
}
