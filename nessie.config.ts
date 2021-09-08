import { PGDATABASE, PGHOST, PGPASSWORD, PGPORT, PGUSER } from "./src/env.ts";
import { ClientPostgreSQL, NessieConfig } from "nessie";

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
  migrationFolders: ["./db/migrations"],
  seedFolders: ["./db/seeds"],
};

export default config;
