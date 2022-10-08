import { Pool } from "postgres";
import { PGDATABASE, PGHOST, PGPASSWORD, PGPORT, PGUSER } from "~/env.ts";

const pool = new Pool({
  applicationName: "Graphs",
  database: PGDATABASE,
  hostname: PGHOST,
  port: PGPORT,
  user: PGUSER,
  password: PGPASSWORD,
}, 2);

export function connect() {
  return pool.connect();
}
