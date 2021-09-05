import {
  PGDATABASE,
  PGHOST,
  PGPORT,
  PGUSER,
  PGPASSWORD,
} from '../env.ts';

const client = new Client({
  database: PGDATABASE,
  hostname: PGHOST,
  port: PGPORT,
  user: PGUSER,
  password: PGPASSWORD,
});

export { client };
