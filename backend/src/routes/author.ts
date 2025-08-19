import { validateUUID, validateAuthorData, ApiError } from '../utils/validation';
import { saveImage, deleteImage, processImageFromRequest } from '../utils/image';
import { asyncHandler } from '../middleware/errorHandler';
import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../utils/db';

const router = Router();

// Obtener autores
router.get(
	'/authors',
	asyncHandler(async (req: Request, res: Response) => {
		const includeBooks = req.query.extra === '' || req.query.extra === 'true';

		let query = `
			SELECT
				a.id,
				a.full_name,
				a.country,
				a.biography,
				a.created_at,
				a.updated_at
			FROM
				library_manager.author a
			ORDER BY
				a.full_name
		`;

		const result = await pool.query(query);
		let authors = result.rows;

		if (includeBooks && authors.length > 0) {
			// Obtener libros
			const authorIds = authors.map((author) => author.id);
			const booksQuery = `
				SELECT
					b.id,
					b.title,
					b.summary,
					b.publication_year,
					b.isbn,
					b.pages,
					b.created_at,
					b.updated_at,
					ba.author_id
				FROM
					library_manager.book b
					JOIN library_manager.book_author ba ON b.id = ba.book_id
				WHERE
					ba.author_id = ANY ($1)
				ORDER BY
					b.title
			`;

			const booksResult = await pool.query(booksQuery, [authorIds]);

			// Agrupar por autor
			const booksByAuthor = booksResult.rows.reduce((acc, book) => {
				if (!acc[book.author_id]) {
					acc[book.author_id] = [];
				}
				const { author_id, ...bookData } = book;
				acc[book.author_id].push(bookData);
				return acc;
			}, {});

			authors = authors.map((author) => ({
				...author,
				books: booksByAuthor[author.id] || []
			}));
		}

		res.json(authors);
	})
);

// Crear autor
router.post(
	'/authors',
	asyncHandler(async (req: Request, res: Response) => {
		const errors = validateAuthorData(req.body);
		if (errors.length > 0) {
			throw new ApiError('Errores de validación', 400, errors);
		}

		const { full_name, country, biography, image } = req.body;
		const id = uuidv4();

		// Procesar imagen
		let imagePath = null;
		if (image) {
			const imageBuffer = processImageFromRequest(image);
			if (imageBuffer) {
				imagePath = await saveImage(imageBuffer, id, 'author');
			}
		}

		const query = `
			INSERT INTO
				library_manager.author (id, full_name, country, biography)
			VALUES
				($1, $2, $3, $4)
			RETURNING
				*
		`;

		const result = await pool.query(query, [
			id,
			full_name.trim(),
			country.trim(),
			biography?.trim() || null
		]);

		res.status(201).json({
			...result.rows[0],
			...(imagePath && { image_path: imagePath })
		});
	})
);

// Obtener autor
router.get(
	'/authors/:id',
	asyncHandler(async (req: Request, res: Response) => {
		const { id } = req.params;
		const includeBooks = req.query.extra === '' || req.query.extra === 'true';

		if (!validateUUID(id)) {
			throw new ApiError('ID de autor inválido', 400);
		}

		const query = `
			SELECT
				id,
				full_name,
				country,
				biography,
				created_at,
				updated_at
			FROM
				library_manager.author
			WHERE
				id = $1
		`;

		const result = await pool.query(query, [id]);

		if (result.rows.length === 0) {
			throw new ApiError('Autor no encontrado', 404);
		}

		let author = result.rows[0];

		if (includeBooks) {
			const booksQuery = `
				SELECT
					b.id,
					b.title,
					b.summary,
					b.publication_year,
					b.isbn,
					b.pages,
					b.created_at,
					b.updated_at
				FROM
					library_manager.book b
					JOIN library_manager.book_author ba ON b.id = ba.book_id
				WHERE
					ba.author_id = $1
				ORDER BY
					b.title
			`;

			const booksResult = await pool.query(booksQuery, [id]);
			author.books = booksResult.rows;
		}

		res.json(author);
	})
);

// Eliminar autor
router.delete(
	'/authors/:id',
	asyncHandler(async (req: Request, res: Response) => {
		const { id } = req.params;

		if (!validateUUID(id)) {
			throw new ApiError('ID de autor inválido', 400);
		}

		// Verificar si el autor tiene libros
		const checkBooksQuery = `
			SELECT
				COUNT(*) AS book_count
			FROM
				library_manager.book_author
			WHERE
				author_id = $1
		`;

		const bookCheck = await pool.query(checkBooksQuery, [id]);

		if (parseInt(bookCheck.rows[0].book_count) > 0) {
			throw new ApiError('No se puede eliminar el autor porque tiene libros asociados', 400);
		}

		const query = `
			DELETE FROM library_manager.author
			WHERE
				id = $1
			RETURNING
				*
		`;

		const result = await pool.query(query, [id]);

		if (result.rows.length === 0) {
			throw new ApiError('Autor no encontrado', 404);
		}

		// Eliminar imagen
		await deleteImage(id, 'author');

		res.json(result.rows[0]);
	})
);

// Actualizar autor
router.put(
	'/authors/:id',
	asyncHandler(async (req: Request, res: Response) => {
		const { id } = req.params;

		if (!validateUUID(id)) {
			throw new ApiError('ID de autor inválido', 400);
		}

		const errors = validateAuthorData(req.body, true);
		if (errors.length > 0) {
			throw new ApiError('Errores de validación', 400, errors);
		}

		// Verificar que existe
		const existsQuery = `SELECT id FROM library_manager.author WHERE id = $1`;
		const existsResult = await pool.query(existsQuery, [id]);

		if (existsResult.rows.length === 0) {
			throw new ApiError('Autor no encontrado', 404);
		}

		const { full_name, country, biography, image } = req.body;

		// Campos a actualizar
		const updateFields = [];
		const updateValues = [];
		let paramCount = 1;

		if (full_name !== undefined) {
			updateFields.push(`full_name = $${paramCount++}`);
			updateValues.push(full_name.trim());
		}

		if (country !== undefined) {
			updateFields.push(`country = $${paramCount++}`);
			updateValues.push(country.trim());
		}

		if (biography !== undefined) {
			updateFields.push(`biography = $${paramCount++}`);
			updateValues.push(biography?.trim() || null);
		}

		if (updateFields.length === 0 && !image) {
			throw new ApiError('No hay campos para actualizar', 400);
		}

		// Procesar imagen
		if (image === null) {
			await deleteImage(id, 'author');
		} else if (image) {
			const imageBuffer = processImageFromRequest(image);
			if (imageBuffer) {
				await saveImage(imageBuffer, id, 'author');
			}
		}

		let query = ``;
		let result;

		if (updateFields.length > 0) {
			updateValues.push(id);
			query = `
      			UPDATE
					library_manager.author 
      			SET
					${updateFields.join(', ')}
      			WHERE
					id = $${paramCount}
      			RETURNING
					*
    		`;
			result = await pool.query(query, updateValues);
		} else {
			// Solo actualizaron imagen
			query = `
				SELECT
					*
				FROM
					library_manager.author
				WHERE
					id = $1
			`;
			result = await pool.query(query, [id]);
		}

		res.json(result.rows[0]);
	})
);

export default router;
