import { connect } from "~/lib/database.ts";

export const GET = async (request) => {
  const db = await connect();
  const { rows: repositories } =
    await db.queryObject`SELECT owner, name FROM github_repositories ORDER BY owner ASC, name ASC`;
  return Response.json({ repositories });
};
