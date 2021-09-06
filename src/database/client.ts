import { Client } from "../deps/postgres.ts";
import { PGDATABASE, PGHOST, PGPASSWORD, PGPORT, PGUSER } from "../env.ts";

const client = new Client({
  applicationName: "Graphs",
  database: PGDATABASE,
  hostname: PGHOST,
  port: PGPORT,
  user: PGUSER,
  password: PGPASSWORD,
});

export { client };
