import { Request, Response, NextFunction } from 'express';

export interface ValidationError {
	field: string;
	message: string;
}

export class ApiError extends Error {
	statusCode: number;
	errors?: ValidationError[];

	constructor(message: string, statusCode: number, errors?: ValidationError[]) {
		super(message);
		this.statusCode = statusCode;
		this.errors = errors;
		this.name = 'VALIDATION_ERROR';
	}
}

export const validateUUID = (uuid: string): boolean => {
	const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
	return uuidRegex.test(uuid);
};

export const validateAuthorData = (data: any, isUpdate: boolean = false): ValidationError[] => {
	const errors: ValidationError[] = [];

	if (!isUpdate || data.full_name !== undefined) {
		if (
			!data.full_name ||
			typeof data.full_name !== 'string' ||
			data.full_name.trim().length === 0
		) {
			errors.push({ field: 'full_name', message: 'El nombre completo es obligatorio.' });
		}
	}

	if (!isUpdate || data.country !== undefined) {
		if (!data.country || typeof data.country !== 'string' || data.country.trim().length === 0) {
			errors.push({ field: 'country', message: 'La nacionalidad es obligatoria.' });
		}
	}

	if (data.biography !== undefined && data.biography !== null) {
		if (typeof data.biography !== 'string') {
			errors.push({ field: 'biography', message: 'La biografía debe ser texto.' });
		}
	}

	return errors;
};

export const validateBookData = (data: any, isUpdate: boolean = false): ValidationError[] => {
	const errors: ValidationError[] = [];

	if (!isUpdate || data.title !== undefined) {
		if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
			errors.push({ field: 'title', message: 'El título es obligatorio.' });
		}
	}

	if (!isUpdate || data.publication_year !== undefined) {
		if (!data.publication_year || !Number.isInteger(data.publication_year)) {
			errors.push({
				field: 'publication_year',
				message: 'El año de publicación debe ser un número entero válido.'
			});
		}
	}

	if (!isUpdate && (!data.authors || !Array.isArray(data.authors))) {
		errors.push({
			field: 'authors',
			message: 'Los autores deben ser un array.'
		});
	} else if (data.authors !== undefined) {
		if (!Array.isArray(data.authors)) {
			errors.push({ field: 'authors', message: 'Los autores deben ser un array.' });
		} else {
			data.authors.forEach((authorId: any, index: number) => {
				if (!validateUUID(authorId)) {
					errors.push({ field: `authors[${index}]`, message: 'ID de autor inválido.' });
				}
			});
		}
	}

	if (data.isbn !== undefined && data.isbn !== null) {
		if (typeof data.isbn !== 'string') {
			errors.push({ field: 'isbn', message: 'El ISBN debe ser texto.' });
		}
	}

	if (data.pages !== undefined && data.pages !== null) {
		if (!Number.isInteger(data.pages) || data.pages < 0) {
			errors.push({
				field: 'pages',
				message: 'El número de páginas debe ser un entero positivo.'
			});
		}
	}

	if (data.summary !== undefined && data.summary !== null) {
		if (typeof data.summary !== 'string') {
			errors.push({ field: 'summary', message: 'El resumen debe ser texto.' });
		}
	}

	return errors;
};

export const validateLibraryData = (data: any, isUpdate: boolean = false): ValidationError[] => {
	const errors: ValidationError[] = [];

	if (!isUpdate || data.name !== undefined) {
		if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
			errors.push({ field: 'name', message: 'El nombre es obligatorio.' });
		}
	}

	if (!isUpdate || data.location !== undefined) {
		if (
			!data.location ||
			typeof data.location !== 'string' ||
			data.location.trim().length === 0
		) {
			errors.push({ field: 'location', message: 'La ubicación es obligatoria.' });
		}
	}

	if (!isUpdate && (!data.books || !Array.isArray(data.books))) {
		errors.push({
			field: 'books',
			message: 'Los libros son obligatorios y deben ser un array.'
		});
	} else if (data.books !== undefined) {
		if (!Array.isArray(data.books)) {
			errors.push({ field: 'books', message: 'Los libros deben ser un array.' });
		} else {
			data.books.forEach((bookId: any, index: number) => {
				if (!validateUUID(bookId)) {
					errors.push({ field: `books[${index}]`, message: 'ID de libro inválido.' });
				}
			});
		}
	}

	if (data.description !== undefined && data.description !== null) {
		if (typeof data.description !== 'string') {
			errors.push({ field: 'description', message: 'La descripción debe ser texto.' });
		}
	}

	return errors;
};

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
	const errors = req.validationErrors;
	if (errors && errors.length > 0) {
		return res.status(400).json({
			error: 'VALIDATION_ERROR',
			message: 'Errores de validación.',
			errors
		});
	}
	next();
};

declare global {
	namespace Express {
		interface Request {
			validationErrors?: ValidationError[];
		}
	}
}
