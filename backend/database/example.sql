BEGIN;

-- ========
-- AUTORES
-- ========
INSERT INTO
	library_manager.author (
		id,
		full_name,
		country,
		biography,
		created_at,
		updated_at
	)
VALUES
	(
		'c84ba536-78c9-41d2-93d1-563e0ff062aa',
		'Gabriel García Márquez',
		'CO',
		'Novelista, pionero del realismo mágico; Premio Nobel de Literatura (1982). Autor emblemático del siglo XX.',
		now(),
		now()
	),
	(
		'602d6309-f589-4966-82f3-5fb9ba4cbea1',
		'Isabel Allende',
		'CL',
		'Novelista conocida por sagas familiares e historias con elementos históricos y mágicos; amplia audiencia internacional.',
		now(),
		now()
	),
	(
		'ecd2cc84-3157-43b5-a818-3b6501c3ccc0',
		'Jorge Luis Borges',
		'AR',
		'Escritor y ensayista, figura central de la literatura latinoamericana del siglo XX; reconocido por sus cuentos y reflexiones filosóficas.',
		now(),
		now()
	),
	(
		'5f635da4-e2f8-47ca-a54a-0e2c4676d1d4',
		'Julio Cortázar',
		'AR',
		'Novelista y cuentista, miembro destacado del Boom latinoamericano; innovador en técnicas narrativas y estructura.',
		now(),
		now()
	),
	(
		'e578b9e1-a28d-49ac-a315-a882f777f52b',
		'Mario Vargas Llosa',
		'PE',
		'Novelista y ensayista, figura clave de la narrativa latinoamericana; ganador del Premio Nobel de Literatura (2010).',
		now(),
		now()
	),
	(
		'eec3cd8f-6c3f-4138-9edb-757fcadb6498',
		'Pablo Neruda',
		'CL',
		'Poeta y diplomático, una de las voces poéticas en lengua española más influyentes; Premio Nobel de Literatura (1971).',
		now(),
		now()
	),
	(
		'a0c1d0ec-48ba-4f51-aba7-cedb2731fcb4',
		'Miguel de Cervantes',
		'ES',
		'Escritor de la Edad de Oro; autor de ''Don Quijote de la Mancha'', obra fundacional de la novela moderna.',
		now(),
		now()
	),
	(
		'82785569-c3e2-4fc5-aead-a6bf16800e75',
		'George Orwell',
		'GB',
		'Escritor y filósofo, autor de ''1984'' y ''Animal Farm''; figura central de la literatura del siglo XX.',
		now(),
		now()
	),
	(
		'e93ad97d-c04b-400b-aeff-b07446c166ad',
		'Fiódor Dostoyevski',
		'RU',
		'Novelista, considerado uno de los más importantes de la literatura universal porque exploran la psicología humana y la condición moral del individuo en la sociedad rusa del siglo XIX.',
		now(),
		now()
	),
	(
		'72553f8c-cb7f-49dd-91a8-f10b18a00b03',
		'Jane Austen',
		'GB',
		'Novelista del siglo XIX, reconocida por su aguda observación social y sus novelas sobre relaciones y moralidad.',
		now(),
		now()
	),
	(
		'2f7f443e-e079-4b85-bd35-1e6d5c24cba1',
		'Franz Kafka',
		'CZ',
		'Escritor conocido por obras con tonadas surrealistas y existenciales que marcaron la literatura del siglo XX.',
		now(),
		now()
	),
	(
		'5ef0e16a-f0d0-4895-8a5b-c17a6dc9a358',
		'Emily Brontë',
		'GB',
		'Novelista y poeta, conocida principalmente por su única novela, Cumbres Borrascosas, publicada en 1847 bajo el seudónimo de Ellis Bell.',
		now(),
		now()
	),
	(
		'f8956ed2-8694-4785-a94a-9003b996ccdb',
		'Albert Camus',
		'FR',
		'Escritor, filósofo y periodista, conocido por su obra literaria y su pensamiento existencialista.',
		now(),
		now()
	),
	(
		'7670b0c3-18a2-4091-a024-d0621196d0fa',
		'Charles Dickens',
		'GB',
		'Novelista que retrató la vida victoriana y las injusticias sociales con personajes memorables y gran sentido narrativo.',
		now(),
		now()
	),
	(
		'b58e7e9f-891d-45f5-8d2e-8ff55dee9a0b',
		'Oscar Wilde',
		'IE',
		'Escritor y poeta, reconocido por su ingenio, estilo elegante y obras teatrales como ''La importancia de llamarse Ernesto''.',
		now(),
		now()
	),
	(
		'bc01374b-d4e9-4701-b251-f49341aab2b3',
		'Neil Gaiman',
		'GB',
		'Autor de fantasía y ficción especulativa, conocido por novelas, cómics y guiones con gran popularidad contemporánea.',
		now(),
		now()
	),
	(
		'd0072b56-d522-474d-8f7c-4573327a2527',
		'Terry Pratchett',
		'GB',
		'Autor de fantasía satírica, creador de la serie ''Mundodisco''; reconocido por su humor crítico y prolífica producción.',
		now(),
		now()
	),
	(
		'65b04e87-64b9-4ef2-b62a-3a0efe790f03',
		'Octavio Paz',
		'MX',
		'Poeta y ensayista, Premio Nobel de Literatura (1990); figura influyente en la poesía y el pensamiento hispanoamericano.',
		now(),
		now()
	),
	(
		'c727c829-de3c-4850-9591-d7b2e8450d16',
		'Laura Restrepo',
		'CO',
		'Novelista y periodista, conocida por integrar temas políticos y sociales en su narrativa con estilo vigoroso.',
		now(),
		now()
	),
	(
		'3e96f063-001d-4073-a29a-9a21735f97e8',
		'Francis Scott Fitzgerald',
		'US',
		'Novelista y escritor de cuentos, conocido por sus representaciones de la ''Era del Jazz'' y el ''Sueño Americano''.',
		now(),
		now()
	);

-- =======
-- LIBROS
-- =======
INSERT INTO
	library_manager.book (
		id,
		title,
		summary,
		publication_year,
		isbn,
		pages,
		created_at,
		updated_at
	)
VALUES
	(
		'9afe5c93-5113-4113-8986-1185e79274e2',
		'Cien Años de Soledad',
		'Relato épico de varias generaciones de la familia Buendía que mezcla historia, mito y realismo mágico.',
		1967,
		'9788497592208',
		496,
		now(),
		now()
	),
	(
		'5b0bf8e2-a35f-4afa-b2c8-5c41a6aafae8',
		'El Amor en los Tiempos del Cólera',
		'Historia de amor persistente a lo largo de décadas, sobre memoria, deseo y segundas oportunidades.',
		1985,
		'9789588886152',
		496,
		now(),
		now()
	),
	(
		'd875cbaf-9c5c-44a4-bb60-e37543c7397e',
		'La Casa de los Espíritus',
		'Saga familiar que entrelaza lo personal y lo político con elementos fantásticos y memoria histórica.',
		1982,
		'9789588611778',
		455,
		now(),
		now()
	),
	(
		'53c90192-27b6-48ad-8f7b-92f759fe7077',
		'Ficciones',
		'Colección de cuentos que exploran laberintos mentales, metaficción y paradojas literarias.',
		1944,
		'9789588611594',
		224,
		now(),
		now()
	),
	(
		'e0f029bd-a3d9-4219-b411-637e1e2d5ce8',
		'Rayuela',
		'Novela experimental que propone múltiples formas de lectura para abordar temas existenciales y urbanos.',
		1963,
		'9788466331906',
		736,
		now(),
		now()
	),
	(
		'9451482e-15af-4935-a38b-67c9208ca8ec',
		'La Ciudad y los Perros',
		'Retrato crítico de la vida en una academia militar y de las tensiones sociales en la sociedad peruana.',
		1963,
		'9788490625934',
		448,
		now(),
		now()
	),
	(
		'af559c3d-6d9d-425a-ab5c-c6513f307d14',
		'Veinte Poemas de Amor y una Canción Desesperada',
		'Breve pero intenso libro de poemas que marcó la poesía moderna en lengua española.',
		1924,
		'9788497933056',
		96,
		now(),
		now()
	),
	(
		'5bde51a2-b811-466f-b262-6bb478827ce7',
		'Don Quijote de la Mancha',
		'Novela clásica sobre la aventura del caballero andante y su visión idealista frente a la realidad.',
		1605,
		'9788499892429',
		1064,
		now(),
		now()
	),
	(
		'05479cb9-3af2-48ef-97b8-c33a5726cef9',
		'Rebelión en la Granja',
		'Fábula satírica que critica la corrupción del poder y la traición de ideales revolucionarios.',
		1945,
		'9789588773841',
		144,
		now(),
		now()
	),
	(
		'7b81ad1e-6d64-4534-afa6-fc1d0dc5e4af',
		'Crimen y Castigo',
		'Novela psicológica que examina la culpa, el castigo y la redención tras un asesinato en San Petersburgo.',
		1866,
		'9788484506966',
		688,
		now(),
		now()
	),
	(
		'ded2e0d0-398f-4ab9-9a2a-92c55ce393d2',
		'Orgullo y Prejuicio',
		'Novela romántica que critica las convenciones sociales y explora relaciones y moral victoriana.',
		1813,
		'9788499080642',
		448,
		now(),
		now()
	),
	(
		'8e286fb3-4d8c-4d96-9f97-aed5b7dcea18',
		'La Metamorfosis',
		'Relato surrealista sobre la transformación física y la alienación personal de su protagonista.',
		1915,
		'9788466361842',
		128,
		now(),
		now()
	),
	(
		'3ee17fca-1f78-4907-a003-e45d5f2cce6a',
		'Cumbres Borrascosas',
		'Novela de amor y tragedia que narra la historia de dos adolescentes en la Inglaterra victoriana.',
		1884,
		'9788490321201',
		366,
		now(),
		now()
	),
	(
		'99c5ffd8-1110-4c47-ab58-3ee98e378169',
		'El Extranjero',
		'Relata un hombre apático y ajeno a las convenciones sociales que, tras un asesinato aparentemente sin motivo, es juzgado y condenado a muerte',
		1942,
		'9788466356138',
		128,
		now(),
		now()
	),
	(
		'c6ca6c25-0d14-413f-b5dc-06607210d066',
		'Grandes Esperanzas',
		'Novela sobre el crecimiento y la formación moral de un joven en la Inglaterra victoriana.',
		1861,
		'9788483469880',
		664,
		now(),
		now()
	),
	(
		'9271c995-36e5-485e-8c56-978db15cb68b',
		'El Retrato de Dorian Gray',
		'Novela que explora la obsesión por la belleza y la juventud eterna, así como las consecuencias morales de una vida dedicada al hedonismo.',
		1890,
		'9788497934848',
		272,
		now(),
		now()
	),
	(
		'97c751b0-85f4-446a-9cb3-9e343a5132c3',
		'Buenos Presagios',
		'Ficción cómica sobre la improbable alianza entre un ángel y un demonio ante la proximidad del fin del mundo.',
		1990,
		'9788445016480',
		400,
		now(),
		now()
	),
	(
		'a5305594-f566-4c8c-bc72-9e4668fb5f7e',
		'El Laberinto de la Soledad',
		'Ensayos sobre la identidad mexicana, la soledad y la cultura; obra clave del pensamiento latinoamericano.',
		1950,
		'9786071662798',
		374,
		now(),
		now()
	),
	(
		'4d37c5a9-4a74-4120-9f9f-26b70ccaee91',
		'Delirio',
		'Novela que mezcla memoria, violencia y pasión para explorar la realidad colombiana contemporánea.',
		2004,
		'9788466353540',
		352,
		now(),
		now()
	),
	(
		'f5542560-e130-4f25-838b-1ea46be14f34',
		'El Gran Gatsby',
		'Narra la tragedia de un millonario enigmático que busca desesperadamente reconquistar a su antiguo amor.',
		1891,
		'9789589016640',
		192,
		now(),
		now()
	);

-- ================
-- LIBRO <-> AUTOR
-- ================
INSERT INTO
	library_manager.book_author (book_id, author_id)
VALUES
	-- Cien Años de Soledad (Gabriel García Márquez)
	(
		'9afe5c93-5113-4113-8986-1185e79274e2',
		'c84ba536-78c9-41d2-93d1-563e0ff062aa'
	),
	-- El Amor en los Tiempos del Cólera (Gabriel García Márquez)
	(
		'5b0bf8e2-a35f-4afa-b2c8-5c41a6aafae8',
		'c84ba536-78c9-41d2-93d1-563e0ff062aa'
	),
	-- La Casa de los Espíritus (Isabel Allende)
	(
		'd875cbaf-9c5c-44a4-bb60-e37543c7397e',
		'602d6309-f589-4966-82f3-5fb9ba4cbea1'
	),
	-- Ficciones (Jorge Luis Borges)
	(
		'53c90192-27b6-48ad-8f7b-92f759fe7077',
		'ecd2cc84-3157-43b5-a818-3b6501c3ccc0'
	),
	-- Rayuela (Julio Cortázar)
	(
		'e0f029bd-a3d9-4219-b411-637e1e2d5ce8',
		'5f635da4-e2f8-47ca-a54a-0e2c4676d1d4'
	),
	-- La Ciudad y los Perros (Mario Vargas Llosa)
	(
		'9451482e-15af-4935-a38b-67c9208ca8ec',
		'e578b9e1-a28d-49ac-a315-a882f777f52b'
	),
	-- Veinte Poemas de Amor y una Canción Desesperada (Pablo Neruda)
	(
		'af559c3d-6d9d-425a-ab5c-c6513f307d14',
		'eec3cd8f-6c3f-4138-9edb-757fcadb6498'
	),
	-- Don Quijote de la Mancha (Miguel de Cervantes)
	(
		'5bde51a2-b811-466f-b262-6bb478827ce7',
		'a0c1d0ec-48ba-4f51-aba7-cedb2731fcb4'
	),
	-- Rebelión en la Granja (Goeorge Orwell)
	(
		'05479cb9-3af2-48ef-97b8-c33a5726cef9',
		'82785569-c3e2-4fc5-aead-a6bf16800e75'
	),
	-- Crimen y Castigo (Fiódor Dostoyevski)
	(
		'7b81ad1e-6d64-4534-afa6-fc1d0dc5e4af',
		'e93ad97d-c04b-400b-aeff-b07446c166ad'
	),
	-- Orgullo y Prejuicio (Jane Austen)
	(
		'ded2e0d0-398f-4ab9-9a2a-92c55ce393d2',
		'72553f8c-cb7f-49dd-91a8-f10b18a00b03'
	),
	-- La Metamorfosis (Franz Kafka)
	(
		'8e286fb3-4d8c-4d96-9f97-aed5b7dcea18',
		'2f7f443e-e079-4b85-bd35-1e6d5c24cba1'
	),
	-- Cumbres Borrascosas (Emily Brontë)
	(
		'3ee17fca-1f78-4907-a003-e45d5f2cce6a',
		'5ef0e16a-f0d0-4895-8a5b-c17a6dc9a358'
	),
	-- El Extranjero (Albert Camus)
	(
		'99c5ffd8-1110-4c47-ab58-3ee98e378169',
		'f8956ed2-8694-4785-a94a-9003b996ccdb'
	),
	-- Grandes Esperanzas (Charles Dickens)
	(
		'c6ca6c25-0d14-413f-b5dc-06607210d066',
		'7670b0c3-18a2-4091-a024-d0621196d0fa'
	),
	-- El Retrato de Dorian Gray (Oscar Wilde)
	(
		'9271c995-36e5-485e-8c56-978db15cb68b',
		'b58e7e9f-891d-45f5-8d2e-8ff55dee9a0b'
	),
	-- Buenos Presagios (Neil Gaiman & Terry Pratchett)
	(
		'97c751b0-85f4-446a-9cb3-9e343a5132c3',
		'bc01374b-d4e9-4701-b251-f49341aab2b3'
	),
	(
		'97c751b0-85f4-446a-9cb3-9e343a5132c3',
		'd0072b56-d522-474d-8f7c-4573327a2527'
	),
	-- El Laberinto de la Soledad (Octavio Paz)
	(
		'a5305594-f566-4c8c-bc72-9e4668fb5f7e',
		'65b04e87-64b9-4ef2-b62a-3a0efe790f03'
	),
	-- Delirio (Laura Restrepo)
	(
		'4d37c5a9-4a74-4120-9f9f-26b70ccaee91',
		'c727c829-de3c-4850-9591-d7b2e8450d16'
	),
	-- El Gran Gatsby (Francis Scott Fitzgerald)
	(
		'f5542560-e130-4f25-838b-1ea46be14f34',
		'3e96f063-001d-4073-a29a-9a21735f97e8'
	);

-- ============
-- BIBLIOTECAS
-- ============
INSERT INTO
	library_manager.library (
		id,
		name,
		location,
		description,
		created_at,
		updated_at
	)
VALUES
	(
		'57b54723-ea46-44eb-96c4-f6e30337188a',
		'Biblioteca Luis Ángel Arango',
		'Bogotá',
		'Es un centro cultural y de investigación con una vasta colección de libros y recursos electrónicos, además de ofrecer exposiciones de arte, conciertos y visitas guiadas.',
		now(),
		now()
	),
	(
		'a4dd431e-0c84-49cf-8eaa-bd967ac997e4',
		'Biblioteca Pública Piloto',
		'Medellín',
		'Busca promover el acceso a la información, el conocimiento y la lectura, así como preservar el patrimonio bibliográfico y documental de la región.',
		now(),
		now()
	),
	(
		'9cb61f50-8075-408e-a500-9ecd3fc66863',
		'Biblioteca Departamental Olegario Rivera',
		'Neiva',
		'Es una institución cultural y educativa que ofrece servicios de biblioteca y promueve el acceso al conocimiento y la cultura.',
		now(),
		now()
	);

-- =====================
-- BIBLIOTECA <-> LIBRO
-- =====================
-- Biblioteca Luis Ángel Arango (Bogotá) - 9 libros
INSERT INTO
	library_manager.book_library (library_id, book_id)
VALUES
	(
		'57b54723-ea46-44eb-96c4-f6e30337188a',
		'9afe5c93-5113-4113-8986-1185e79274e2'
	), -- Cien Años de Soledad
	(
		'57b54723-ea46-44eb-96c4-f6e30337188a',
		'5b0bf8e2-a35f-4afa-b2c8-5c41a6aafae8'
	), -- El Amor en los Tiempos del Cólera
	(
		'57b54723-ea46-44eb-96c4-f6e30337188a',
		'd875cbaf-9c5c-44a4-bb60-e37543c7397e'
	), -- La Casa de los Espíritus
	(
		'57b54723-ea46-44eb-96c4-f6e30337188a',
		'53c90192-27b6-48ad-8f7b-92f759fe7077'
	), -- Ficciones
	(
		'57b54723-ea46-44eb-96c4-f6e30337188a',
		'e0f029bd-a3d9-4219-b411-637e1e2d5ce8'
	), -- Rayuela
	(
		'57b54723-ea46-44eb-96c4-f6e30337188a',
		'9451482e-15af-4935-a38b-67c9208ca8ec'
	), -- La Ciudad y los Perros
	(
		'57b54723-ea46-44eb-96c4-f6e30337188a',
		'af559c3d-6d9d-425a-ab5c-c6513f307d14'
	), -- Veinte Poemas de Amor y una Canción Desesperada
	(
		'57b54723-ea46-44eb-96c4-f6e30337188a',
		'5bde51a2-b811-466f-b262-6bb478827ce7'
	), -- Don Quijote de la Mancha
	(
		'57b54723-ea46-44eb-96c4-f6e30337188a',
		'7b81ad1e-6d64-4534-afa6-fc1d0dc5e4af'
	);

-- Crimen y Castigo
-- Biblioteca Pública Piloto (Medellín) - 7 libros
INSERT INTO
	library_manager.book_library (library_id, book_id)
VALUES
	(
		'a4dd431e-0c84-49cf-8eaa-bd967ac997e4',
		'9afe5c93-5113-4113-8986-1185e79274e2'
	), -- Cien Años de Soledad
	(
		'a4dd431e-0c84-49cf-8eaa-bd967ac997e4',
		'd875cbaf-9c5c-44a4-bb60-e37543c7397e'
	), -- La Casa de los Espíritus
	(
		'a4dd431e-0c84-49cf-8eaa-bd967ac997e4',
		'e0f029bd-a3d9-4219-b411-637e1e2d5ce8'
	), -- Rayuela
	(
		'a4dd431e-0c84-49cf-8eaa-bd967ac997e4',
		'ded2e0d0-398f-4ab9-9a2a-92c55ce393d2'
	), -- Orgullo y Prejuicio
	(
		'a4dd431e-0c84-49cf-8eaa-bd967ac997e4',
		'8e286fb3-4d8c-4d96-9f97-aed5b7dcea18'
	), -- La Metamorfosis
	(
		'a4dd431e-0c84-49cf-8eaa-bd967ac997e4',
		'97c751b0-85f4-446a-9cb3-9e343a5132c3'
	), -- Buenos Presagios
	(
		'a4dd431e-0c84-49cf-8eaa-bd967ac997e4',
		'99c5ffd8-1110-4c47-ab58-3ee98e378169'
	);

-- El Extranjero
-- Biblioteca Departamental Olegario Rivera (Neiva) - 8 libros
INSERT INTO
	library_manager.book_library (library_id, book_id)
VALUES
	(
		'9cb61f50-8075-408e-a500-9ecd3fc66863',
		'5b0bf8e2-a35f-4afa-b2c8-5c41a6aafae8'
	), -- El Amor en los Tiempos del Cólera
	(
		'9cb61f50-8075-408e-a500-9ecd3fc66863',
		'53c90192-27b6-48ad-8f7b-92f759fe7077'
	), -- Ficciones
	(
		'9cb61f50-8075-408e-a500-9ecd3fc66863',
		'5bde51a2-b811-466f-b262-6bb478827ce7'
	), -- Don Quijote de la Mancha
	(
		'9cb61f50-8075-408e-a500-9ecd3fc66863',
		'3ee17fca-1f78-4907-a003-e45d5f2cce6a'
	), -- Cumbres Borrascosas
	(
		'9cb61f50-8075-408e-a500-9ecd3fc66863',
		'c6ca6c25-0d14-413f-b5dc-06607210d066'
	), -- Grandes Esperanzas
	(
		'9cb61f50-8075-408e-a500-9ecd3fc66863',
		'9271c995-36e5-485e-8c56-978db15cb68b'
	), -- El Retrato de Dorian Gray
	(
		'9cb61f50-8075-408e-a500-9ecd3fc66863',
		'4d37c5a9-4a74-4120-9f9f-26b70ccaee91'
	), -- Delirio
	(
		'9cb61f50-8075-408e-a500-9ecd3fc66863',
		'f5542560-e130-4f25-838b-1ea46be14f34'
	);

-- El Gran Gatsby
COMMIT;
