const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const configPath = path.resolve(__dirname, './config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

const packageManager = config?.packageManager || 'pnpm';
const frontendPort = config?.ports?.frontend || 8925;
const backendPort = config?.ports?.backend || 2589;

const modeCmd = {
	start: 'start',
	dev: 'dev'
};

const startBackend = (mode) => {
	const cmd = `cd backend && ${packageManager} run ${modeCmd[mode]} --port ${backendPort}`;
	const backendProcess = exec(cmd, { env: { ...process.env, PORT: backendPort } });

	backendProcess.stdout.on('data', (data) => {
		console.log('[Backend stdout]:\n', data);
	});

	backendProcess.stderr.on('data', (data) => {
		console.error('[Backend stderr]:\n', data);
	});

	backendProcess.on('error', (error) => {
		console.error('[Backend error]:\n', error.message);
	});

	backendProcess.on('exit', (code) => {
		console.error(`[Backend exit]: ${code}`);
		process.exit(code);
	});
};

const startFrontend = (mode) => {
	const cmd = `cd frontend && ${packageManager} run ${modeCmd[mode]} --port ${frontendPort}`;
	const frontendProcess = exec(cmd, { env: { ...process.env, PORT: frontendPort } });

	frontendProcess.stdout.on('data', (data) => {
		console.log('[Frontend stdout]:\n', data);
	});

	frontendProcess.stderr.on('data', (data) => {
		console.error('[Frontend stderr]:\n', data);
	});

	frontendProcess.on('error', (error) => {
		console.error('[Frontend error]:\n', error.message);
	});

	frontendProcess.on('exit', (code) => {
		console.error(`[Frontend exit]: ${code}`);
		process.exit(code);
	});
};

const mode = process.argv[2] || 'start';

console.log(`Iniciando modo ${mode} usando ${packageManager}...`);

if (mode === 'first-install') {
	console.log('Instalando dependencias de frontend y backend...');

	exec(`${packageManager} install`, (error, stdout, stderr) => {
		if (error) {
			console.error(`Error al instalar dependencias: ${error.message}`);
			return;
		}
		console.log(stdout);
		if (stderr) {
			console.error(stderr);
		}
	});

	exec(`${packageManager} install`, { cwd: 'frontend' }, (error, stdout, stderr) => {
		if (error) {
			console.error(`Error al instalar dependencias de frontend: ${error.message}`);
			return;
		}
		console.log(stdout);
		if (stderr) {
			console.error(stderr);
		}
	});
	exec(`${packageManager} install`, { cwd: 'backend' }, (error, stdout, stderr) => {
		if (error) {
			console.error(`Error al instalar dependencias de backend: ${error.message}`);
			return;
		}
		console.log(stdout);
		if (stderr) {
			console.error(stderr);
		}
	});
} else {
	startBackend(mode);
	startFrontend(mode);
}
