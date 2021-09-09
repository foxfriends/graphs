import type { APIHandler } from "aleph/types";

export const handler: APIHandler = async ({ data, request, response }) => {
  const db = data.get("db");
  const { rows: repositories } = await db.queryObject
    `SELECT owner, name FROM github_repositories ORDER BY owner ASC, name ASC`;
  response.json({ repositories });
};
