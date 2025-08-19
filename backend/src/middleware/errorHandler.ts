import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/validation';
import { DatabaseError } from 'pg-protocol';

export const errorHandler = (
	error: DatabaseError | ApiError,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	console.error('Error:', error);

	// Validación
	if (error instanceof ApiError) {
		return res.status(error.statusCode).json({
			error: error.name,
			message: error.message,
			...(error.errors && { fields: error.errors })
		});
	}

	// Postgres
	if (error.code === '23505') {
		return res.status(409).json({
			error: 'DUPLICATE_KEY_ERROR',
			message: error.detail || 'Clave duplicada.'
		});
	}

	if (error.code === '23503') {
		return res.status(400).json({
			error: 'FOREIGN_KEY_ERROR',
			message: error.detail || 'Violación de clave foránea.'
		});
	}

	if (error.code === '23502') {
		return res.status(400).json({
			error: 'NOT_NULL_ERROR',
			message: error.detail || 'Campo obligatorio faltante.'
		});
	}

	// Fallback
	res.status(500).json({
		error: 'INTERNAL_SERVER_ERROR',
		message: error.message || 'Error interno del servidor.'
	});
};

export const asyncHandler = (fn: Function) => {
	return (req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
};
