import { validateUUID, validateBookData, ApiError } from '../utils/validation';
import { saveImage, deleteImage, processImageFromRequest } from '../utils/image';
import { asyncHandler } from '../middleware/errorHandler';
import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../utils/db';

const router = Router();

// Obtener libros
router.get(
	'/books',
	asyncHandler(async (req: Request, res: Response) => {
		const includeAuthors = req.query.extra === '' || req.query.extra === 'true';

		let query = `
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
			ORDER BY
				b.title
		`;

		const result = await pool.query(query);
		let books = result.rows;

		if (includeAuthors && books.length > 0) {
			// Obtener libros
			const bookIds = books.map((book) => book.id);
			const authorsQuery = `
				SELECT
					a.id,
					a.full_name,
					a.country,
					a.biography,
					a.created_at,
					a.updated_at,
					ba.book_id
				FROM
					library_manager.author a
					JOIN library_manager.book_author ba ON a.id = ba.author_id
				WHERE
					ba.book_id = ANY ($1)
				ORDER BY
					a.full_name
			`;

			const authorsResult = await pool.query(authorsQuery, [bookIds]);

			// Agrupar por autor
			const authorsByBook = authorsResult.rows.reduce((acc, author) => {
				if (!acc[author.book_id]) {
					acc[author.book_id] = [];
				}
				const { book_id, ...authorData } = author;
				acc[author.book_id].push(authorData);
				return acc;
			}, {});

			books = books.map((book) => ({
				...book,
				authors: authorsByBook[book.id] || []
			}));
		}

		res.json(books);
	})
);

// Crear libro
router.post(
	'/books',
	asyncHandler(async (req: Request, res: Response) => {
		const errors = validateBookData(req.body);
		if (errors.length > 0) {
			throw new ApiError('Errores de validación', 400, errors);
		}

		const { title, summary, publication_year, isbn, pages, authors, image } = req.body;
		const id = uuidv4();

		const client = await pool.connect();

		try {
			await client.query('BEGIN');

			// Verificar que existen
			if (authors && authors.length > 0) {
				const authorsExistQuery = `
					SELECT
						id
					FROM
						library_manager.author
					WHERE
						id = ANY ($1)
				`;
				const authorsExistResult = await client.query(authorsExistQuery, [authors]);

				if (authorsExistResult.rows.length !== authors.length) {
					throw new ApiError('Uno o más autores no existen', 400);
				}
			}

			// Crear libro
			const bookQuery = `
				INSERT INTO
					library_manager.book (id, title, summary, publication_year, isbn, pages)
				VALUES
					($1, $2, $3, $4, $5, $6)
				RETURNING
					*
			`;

			const bookResult = await client.query(bookQuery, [
				id,
				title.trim(),
				summary?.trim() || null,
				publication_year,
				isbn?.trim() || null,
				pages || null
			]);

			// Asociar autores
			if (authors && authors.length > 0) {
				const bookAuthorInserts = authors
					.map((_, index: number) => `($1, $${index + 2})`)
					.join(', ');

				const bookAuthorQuery = `
					INSERT INTO
						library_manager.book_author (book_id, author_id)
					VALUES
						${bookAuthorInserts}
				`;
				await client.query(bookAuthorQuery, [id, ...authors]);
			}

			// Procesar imagen
			let imagePath = null;
			if (image) {
				const imageBuffer = processImageFromRequest(image);
				if (imageBuffer) {
					imagePath = await saveImage(imageBuffer, id, 'book');
				}
			}

			await client.query('COMMIT');

			res.status(201).json({
				...bookResult.rows[0],
				...(imagePath && { image_path: imagePath })
			});
		} catch (error) {
			await client.query('ROLLBACK');
			throw error;
		} finally {
			client.release();
		}
	})
);

// Obtener libro
router.get(
	'/books/:id',
	asyncHandler(async (req: Request, res: Response) => {
		const { id } = req.params;
		const includeAuthors = req.query.extra === '' || req.query.extra === 'true';

		if (!validateUUID(id)) {
			throw new ApiError('ID de libro inválido', 400);
		}

		const query = `
			SELECT
				id,
				title,
				summary,
				publication_year,
				isbn,
				pages,
				created_at,
				updated_at
			FROM
				library_manager.book
			WHERE
				id = $1
		`;

		const result = await pool.query(query, [id]);

		if (result.rows.length === 0) {
			throw new ApiError('Libro no encontrado', 404);
		}

		let book = result.rows[0];

		if (includeAuthors) {
			const authorsQuery = `
				SELECT
					a.id,
					a.full_name,
					a.country,
					a.biography,
					a.created_at,
					a.updated_at
				FROM
					library_manager.author a
					JOIN library_manager.book_author ba ON a.id = ba.author_id
				WHERE
					ba.book_id = $1
				ORDER BY
					a.full_name
			`;

			const authorsResult = await pool.query(authorsQuery, [id]);
			book.authors = authorsResult.rows;
		}

		res.json(book);
	})
);

// Eliminar libro
router.delete(
	'/books/:id',
	asyncHandler(async (req: Request, res: Response) => {
		const { id } = req.params;

		if (!validateUUID(id)) {
			throw new ApiError('ID de libro inválido', 400);
		}

		const query = `
			DELETE FROM library_manager.book
			WHERE
				id = $1
			RETURNING
				*
		`;

		const result = await pool.query(query, [id]);

		if (result.rows.length === 0) {
			throw new ApiError('Libro no encontrado', 404);
		}

		// Eliminar imagen
		await deleteImage(id, 'book');

		res.json(result.rows[0]);
	})
);

// Actualizar libro
router.put(
	'/books/:id',
	asyncHandler(async (req: Request, res: Response) => {
		const { id } = req.params;

		if (!validateUUID(id)) {
			throw new ApiError('ID de libro inválido', 400);
		}

		const errors = validateBookData(req.body, true);
		if (errors.length > 0) {
			throw new ApiError('Errores de validación', 400, errors);
		}

		const client = await pool.connect();

		try {
			await client.query('BEGIN');

			// Verificar que existe
			const existsQuery = `SELECT id FROM library_manager.book WHERE id = $1`;
			const existsResult = await client.query(existsQuery, [id]);

			if (existsResult.rows.length === 0) {
				throw new ApiError('Libro no encontrado', 404);
			}

			const { title, summary, publication_year, isbn, pages, authors, image } = req.body;

			// Campos a actualizar
			const updateFields = [];
			const updateValues = [];
			let paramCount = 1;

			if (title !== undefined) {
				updateFields.push(`title = $${paramCount++}`);
				updateValues.push(title.trim());
			}

			if (summary !== undefined) {
				updateFields.push(`summary = $${paramCount++}`);
				updateValues.push(summary?.trim() || null);
			}

			if (publication_year !== undefined) {
				updateFields.push(`publication_year = $${paramCount++}`);
				updateValues.push(publication_year);
			}

			if (isbn !== undefined) {
				updateFields.push(`isbn = $${paramCount++}`);
				updateValues.push(isbn?.trim() || null);
			}

			if (pages !== undefined) {
				updateFields.push(`pages = $${paramCount++}`);
				updateValues.push(pages || null);
			}

			// Actualizar autores
			if (authors !== undefined) {
				// Verificar que existen
				if (authors.length > 0) {
					const authorsExistQuery = `
						SELECT
							id
						FROM
							library_manager.author
						WHERE
							id = ANY ($1)
					`;
					const authorsExistResult = await client.query(authorsExistQuery, [authors]);

					if (authorsExistResult.rows.length !== authors.length) {
						throw new ApiError('Uno o más autores no existen', 400);
					}
				}

				// Eliminar asociaciones
				await client.query(`DELETE FROM library_manager.book_author WHERE book_id = $1`, [
					id
				]);

				// Crear asociaciones
				if (authors.length > 0) {
					const bookAuthorInserts = authors
						.map((_, index: number) => `($1, $${index + 2})`)
						.join(', ');

					const bookAuthorQuery = `
						INSERT INTO
							library_manager.book_author (book_id, author_id)
						VALUES
							${bookAuthorInserts}
					`;

					await client.query(bookAuthorQuery, [id, ...authors]);
				}
			}

			if (updateFields.length === 0 && authors === undefined && !image) {
				throw new ApiError('No hay campos para actualizar', 400);
			}

			// Procesar imagen
			if (image === null) {
				await deleteImage(id, 'book');
			} else if (image) {
				const imageBuffer = processImageFromRequest(image);
				if (imageBuffer) {
					await saveImage(imageBuffer, id, 'book');
				}
			}

			let result;

			if (updateFields.length > 0) {
				updateValues.push(id);
				const query = `
					UPDATE library_manager.book
					SET
						${updateFields.join(', ')}
					WHERE
						id = $${paramCount}
					RETURNING
						*
				`;
				result = await client.query(query, updateValues);
			} else {
				// Solo actualizaron autores o imagen
				const query = `SELECT * FROM library_manager.book WHERE id = $1`;
				result = await client.query(query, [id]);
			}

			await client.query('COMMIT');
			res.json(result.rows[0]);
		} catch (error) {
			await client.query('ROLLBACK');
			throw error;
		} finally {
			client.release();
		}
	})
);

export default router;
