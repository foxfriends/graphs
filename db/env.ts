import type { LevelName } from "log";
import { config } from "dotenv";

function int(str: string): number {
  const value = parseInt(str);
  if (Number.isNaN(value)) throw new TypeError("Not a number");
  return value;
}

const env = config({ safe: true });

export const PGUSER: string = env.PGUSER;
export const PGPASSWORD: string = env.PGPASSWORD;
export const PGDATABASE: string = env.PGDATABASE;
export const PGHOST: string = env.PGHOST;
export const PGPORT: number = int(env.PGPORT);
