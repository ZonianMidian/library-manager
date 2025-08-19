import express, { Express } from 'express';
import config from '../../config.json';
import morgan from 'morgan';
import cors from 'cors';

import { errorHandler } from './middleware/errorHandler';
import libraryRouter from './routes/library';
import authorRouter from './routes/author';
import bookRouter from './routes/book';

const app: Express = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rutas
app.use('/api', libraryRouter);
app.use('/api', authorRouter);
app.use('/api', bookRouter);

// Errores
app.use(errorHandler);

app.get('/api/health', (req, res) => {
	res.json({
		status: 'OK',
		timestamp: new Date().toISOString(),
		service: 'Library Manager API'
	});
});

app.use(/(.*)/, (req, res) => {
	res.status(404).json({
		error: 'NOT_FOUND',
		message: 'Endpoint no encontrado'
	});
});

app.listen(config.ports.backend, () => {
	console.log(`Iniciada la Library Manager API | Puerto ${config.ports.backend}`);
});

export default app;
