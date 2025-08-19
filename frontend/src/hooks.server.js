import { config as localConfig } from '$lib/stores';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('../config.json', 'utf-8'));
globalThis.url = config.url;
localConfig.set(config);

const backendPort = config?.ports?.backend || 3524;

export async function handle({ event, resolve }) {
	if (event.url.pathname.startsWith('/api/')) {
		const eventUrl = event.url;
		const proxyUrl = new URL(
			eventUrl.href.replace(eventUrl.origin, `http://localhost:${backendPort}`)
		);
		const request = new Request(proxyUrl.toString(), event.request);
		return await fetch(request);
	}

	return await resolve(event);
}
