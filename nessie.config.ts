import {
  PGDATABASE,
  PGHOST,
  PGPORT,
  PGPASSWORD,
  PGUSER,
} from './src/env.ts';
import {
    ClientPostgreSQL,
    NessieConfig,
} from 'https://deno.land/x/nessie@2.0.1/mod.ts';

const client = new ClientPostgreSQL({
    database: PGDATABASE,
    hostname: PGHOST,
    port: PGPORT,
    user: PGUSER,
    password: PGPASSWORD,
});

/** This is the final config object */
const config: NessieConfig = {
    client,
    migrationFolders: ['./db/migrations'],
    seedFolders: ['./db/seeds'],
};

export default config;
