import type { APIMiddleware } from "aleph/types";
import { connect } from "./pool.ts";

export const database: APIMiddleware = async ({ response, data }, next) => {
  const db = await connect();
  try {
    data.set("db", db);
    await next();
  } finally {
    await db.release();
  }
};
