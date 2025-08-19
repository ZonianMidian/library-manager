import { validateUUID, validateLibraryData, ApiError } from '../utils/validation';
import { saveImage, deleteImage, processImageFromRequest } from '../utils/image';
import { asyncHandler } from '../middleware/errorHandler';
import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../utils/db';

const router = Router();

// Obtener bibliotecas
router.get(
	'/libraries',
	asyncHandler(async (req: Request, res: Response) => {
		const includeAuthors = req.query.extra === '' || req.query.extra === 'true';

		const query = `
			SELECT
				l.id,
				l.name,
				l.location,
				l.description,
				l.created_at,
				l.updated_at
			FROM
				library_manager.library AS l
			ORDER BY
				l.name;
		`;

		const result = await pool.query(query);
		let libraries = result.rows;

		if (libraries.length > 0) {
			// Obtener libros
			const libraryIds = libraries.map((library) => library.id);
			let booksQuery = `
				SELECT
					b.id,
					b.title,
					b.summary,
					b.publication_year,
					b.isbn,
					b.pages,
					b.created_at,
					b.updated_at,
					bl.library_id
				FROM
					library_manager.book b
					JOIN library_manager.book_library bl ON b.id = bl.book_id
				WHERE
					bl.library_id = ANY ($1)
				ORDER BY
					b.title
			`;

			const booksResult = await pool.query(booksQuery, [libraryIds]);

			// Obtener autores
			let authorsByBook = {};
			if (includeAuthors && booksResult.rows.length > 0) {
				const bookIds = booksResult.rows.map((book) => book.id);
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

				// Agrupar autores
				authorsByBook = authorsResult.rows.reduce((acc, author) => {
					if (!acc[author.book_id]) {
						acc[author.book_id] = [];
					}
					const { book_id, ...authorData } = author;
					acc[author.book_id].push(authorData);
					return acc;
				}, {});
			}

			// Agrupar libros
			const booksByLibrary = booksResult.rows.reduce((acc, book) => {
				if (!acc[book.library_id]) {
					acc[book.library_id] = [];
				}
				const { library_id, ...bookData } = book;

				// Agregar autores
				if (includeAuthors) {
					bookData.authors = authorsByBook[book.id] || [];
				}

				acc[book.library_id].push(bookData);
				return acc;
			}, {});

			libraries = libraries.map((library) => ({
				...library,
				books: booksByLibrary[library.id] || []
			}));
		}

		res.json(libraries);
	})
);

// Crear biblioteca
router.post(
	'/libraries',
	asyncHandler(async (req: Request, res: Response) => {
		const errors = validateLibraryData(req.body);
		if (errors.length > 0) {
			throw new ApiError('Errores de validación', 400, errors);
		}

		const { name, location, description, books, image } = req.body;
		const id = uuidv4();

		const client = await pool.connect();

		try {
			await client.query('BEGIN');

			// Verificar que existen
			if (books && books.length > 0) {
				const booksExistQuery = `
					SELECT
						id
					FROM
						library_manager.book
					WHERE
						id = ANY ($1)
				`;
				const booksExistResult = await client.query(booksExistQuery, [books]);

				if (booksExistResult.rows.length !== books.length) {
					throw new ApiError('Uno o más libros no existen', 400);
				}
			}

			// Crear biblioteca
			const libraryQuery = `
				INSERT INTO
					library_manager.library (id, name, location, description)
				VALUES
					($1, $2, $3, $4)
				RETURNING
					*
			`;

			const libraryResult = await client.query(libraryQuery, [
				id,
				name.trim(),
				location.trim(),
				description?.trim() || null
			]);

			// Asociar libros
			if (books && books.length > 0) {
				const bookLibraryInserts = books
					.map((_, index: number) => `($1, $${index + 2})`)
					.join(', ');

				const bookLibraryQuery = `
					INSERT INTO
						library_manager.book_library (library_id, book_id)
					VALUES
						${bookLibraryInserts}
				`;

				await client.query(bookLibraryQuery, [id, ...books]);
			}

			// Procesar imagen
			let imagePath = null;
			if (image) {
				const imageBuffer = processImageFromRequest(image);
				if (imageBuffer) {
					imagePath = await saveImage(imageBuffer, id, 'library');
				}
			}

			await client.query('COMMIT');

			res.status(201).json({
				...libraryResult.rows[0],
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

// Obtener biblioteca
router.get(
	'/libraries/:id',
	asyncHandler(async (req: Request, res: Response) => {
		const { id } = req.params;
		const includeAuthors = req.query.extra === '' || req.query.extra === 'true';

		if (!validateUUID(id)) {
			throw new ApiError('ID de biblioteca inválido', 400);
		}

		const query = `
			SELECT
				id,
				name,
				location,
				description,
				created_at,
				updated_at
			FROM
				library_manager.library
			WHERE
				id = $1
		`;

		const result = await pool.query(query, [id]);

		if (result.rows.length === 0) {
			throw new ApiError('Biblioteca no encontrada', 404);
		}

		let library = result.rows[0];

		// Obtener libros
		let booksQuery = `
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
				JOIN library_manager.book_library bl ON b.id = bl.book_id
			WHERE
				bl.library_id = $1
			ORDER BY
				b.title
		`;

		const booksResult = await pool.query(booksQuery, [id]);
		let books = booksResult.rows;

		// Obtener autores
		if (includeAuthors && books.length > 0) {
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

			// Agrupar autores
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

		library.books = books;
		res.json(library);
	})
);

// Eliminar biblioteca
router.delete(
	'/libraries/:id',
	asyncHandler(async (req: Request, res: Response) => {
		const { id } = req.params;

		if (!validateUUID(id)) {
			throw new ApiError('ID de biblioteca inválido', 400);
		}

		const query = `
			DELETE FROM library_manager.library
			WHERE
				id = $1
			RETURNING
				*
		`;

		const result = await pool.query(query, [id]);

		if (result.rows.length === 0) {
			throw new ApiError('Biblioteca no encontrada', 404);
		}

		// Eliminar imagen
		await deleteImage(id, 'library');

		res.json(result.rows[0]);
	})
);

// Actualizar biblioteca
router.put(
	'/libraries/:id',
	asyncHandler(async (req: Request, res: Response) => {
		const { id } = req.params;

		if (!validateUUID(id)) {
			throw new ApiError('ID de biblioteca inválido', 400);
		}

		const errors = validateLibraryData(req.body, true);
		if (errors.length > 0) {
			throw new ApiError('Errores de validación', 400, errors);
		}

		const client = await pool.connect();

		try {
			await client.query('BEGIN');

			// Verificar que existe
			const existsQuery = `SELECT id FROM library_manager.library WHERE id = $1`;
			const existsResult = await client.query(existsQuery, [id]);

			if (existsResult.rows.length === 0) {
				throw new ApiError('Biblioteca no encontrada', 404);
			}

			const { name, location, description, books, image } = req.body;

			// Campos a actualizar
			const updateFields = [];
			const updateValues = [];
			let paramCount = 1;

			if (name !== undefined) {
				updateFields.push(`name = $${paramCount++}`);
				updateValues.push(name.trim());
			}

			if (location !== undefined) {
				updateFields.push(`location = $${paramCount++}`);
				updateValues.push(location.trim());
			}

			if (description !== undefined) {
				updateFields.push(`description = $${paramCount++}`);
				updateValues.push(description?.trim() || null);
			}

			// Actualizar libros
			if (books !== undefined) {
				// Verificar que existen
				if (books.length > 0) {
					const booksExistQuery = `
						SELECT
							id
						FROM
							library_manager.book
						WHERE
							id = ANY ($1)
					`;
					const booksExistResult = await client.query(booksExistQuery, [books]);

					if (booksExistResult.rows.length !== books.length) {
						throw new ApiError('Uno o más libros no existen', 400);
					}
				}

				// Eliminar asociaciones
				await client.query(
					`DELETE FROM library_manager.book_library WHERE library_id = $1`,
					[id]
				);

				// Crear asociaciones
				if (books.length > 0) {
					const bookLibraryInserts = books
						.map((_, index: number) => `($1, $${index + 2})`)
						.join(', ');

					const bookLibraryQuery = `
						INSERT INTO
							library_manager.book_library (library_id, book_id)
						VALUES
							${bookLibraryInserts}
					`;

					await client.query(bookLibraryQuery, [id, ...books]);
				}
			}

			if (updateFields.length === 0 && books === undefined && !image) {
				throw new ApiError('No hay campos para actualizar', 400);
			}

			// Procesar imagen
			if (image === null) {
				await deleteImage(id, 'library');
			} else if (image) {
				const imageBuffer = processImageFromRequest(image);
				if (imageBuffer) {
					await saveImage(imageBuffer, id, 'library');
				}
			}

			let result;

			if (updateFields.length > 0) {
				updateValues.push(id);
				const query = `
        			UPDATE
						library_manager.library 
        			SET
						${updateFields.join(', ')}
        			WHERE
						id = $${paramCount}
        			RETURNING
						*
      			`;
				result = await client.query(query, updateValues);
			} else {
				// Solo actualizaron libros
				const query = `SELECT * FROM library_manager.library WHERE id = $1`;
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
