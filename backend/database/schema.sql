BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE SCHEMA IF NOT EXISTS library_manager;

SET
	search_path = library_manager,
	public;

CREATE TABLE IF NOT EXISTS library_manager.author (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	full_name text NOT NULL,
	country text NOT NULL,
	biography text,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS library_manager.book (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	title text NOT NULL,
	summary text,
	publication_year integer,
	isbn varchar(50) UNIQUE,
	pages integer,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS library_manager.book_author (
	book_id uuid NOT NULL,
	author_id uuid NOT NULL,
	PRIMARY KEY (book_id, author_id)
);

CREATE TABLE IF NOT EXISTS library_manager.library (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	name text NOT NULL,
	location text,
	description text,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS library_manager.book_library (
	library_id uuid NOT NULL,
	book_id uuid NOT NULL,
	PRIMARY KEY (library_id, book_id)
);

DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
								 WHERE constraint_name = 'book_author_book_id_fkey' 
								 AND table_schema = 'library_manager') THEN
		ALTER TABLE library_manager.book_author 
		ADD CONSTRAINT book_author_book_id_fkey 
		FOREIGN KEY (book_id) REFERENCES library_manager.book(id) ON DELETE CASCADE;
	END IF;
	
	IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
								 WHERE constraint_name = 'book_author_author_id_fkey' 
								 AND table_schema = 'library_manager') THEN
		ALTER TABLE library_manager.book_author 
		ADD CONSTRAINT book_author_author_id_fkey 
		FOREIGN KEY (author_id) REFERENCES library_manager.author(id) ON DELETE RESTRICT;
	END IF;
	
	IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
								 WHERE constraint_name = 'book_library_library_id_fkey' 
								 AND table_schema = 'library_manager') THEN
		ALTER TABLE library_manager.book_library 
		ADD CONSTRAINT book_library_library_id_fkey 
		FOREIGN KEY (library_id) REFERENCES library_manager.library(id) ON DELETE CASCADE;
	END IF;
	
	IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
								 WHERE constraint_name = 'book_library_book_id_fkey' 
								 AND table_schema = 'library_manager') THEN
		ALTER TABLE library_manager.book_library 
		ADD CONSTRAINT book_library_book_id_fkey 
		FOREIGN KEY (book_id) REFERENCES library_manager.book(id) ON DELETE CASCADE;
	END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_book_title ON library_manager.book (title);

CREATE INDEX IF NOT EXISTS idx_author_name ON library_manager.author (full_name);

CREATE OR REPLACE FUNCTION library_manager.set_updated_at () RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
	NEW.updated_at = now();
	RETURN NEW;
END;
$$;

DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM information_schema.triggers 
								 WHERE trigger_name = 'trg_author_updated_at' 
								 AND event_object_schema = 'library_manager') THEN
		CREATE TRIGGER trg_author_updated_at
			BEFORE UPDATE ON library_manager.author
			FOR EACH ROW EXECUTE FUNCTION library_manager.set_updated_at();
	END IF;
	
	IF NOT EXISTS (SELECT 1 FROM information_schema.triggers 
								 WHERE trigger_name = 'trg_book_updated_at' 
								 AND event_object_schema = 'library_manager') THEN
		CREATE TRIGGER trg_book_updated_at
			BEFORE UPDATE ON library_manager.book
			FOR EACH ROW EXECUTE FUNCTION library_manager.set_updated_at();
	END IF;
	
	IF NOT EXISTS (SELECT 1 FROM information_schema.triggers 
								 WHERE trigger_name = 'trg_library_updated_at' 
								 AND event_object_schema = 'library_manager') THEN
		CREATE TRIGGER trg_library_updated_at
			BEFORE UPDATE ON library_manager.library
			FOR EACH ROW EXECUTE FUNCTION library_manager.set_updated_at();
	END IF;
END $$;

COMMIT;
