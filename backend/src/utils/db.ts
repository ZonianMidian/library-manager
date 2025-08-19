import config from '../../../config.json';
import pg from 'pg';

const { Pool } = pg;

export const pool = new Pool({
	host: config.database.host,
	user: config.database.user,
	password: config.database.pass,
	database: config.database.name,
	max: config.database.connectionLimit
});
