import type { Transaction } from "postgres";
import logger from "../logger.ts";

export type GithubRepository = {
  owner: string;
  name: string;
};

export async function saveRepository(
  db: Transaction,
  repository: GithubRepository,
): Promise<void> {
  logger.debug("saveRepository", repository);
  await db.queryArray`
    INSERT INTO github_repositories (owner, name)
      VALUES (${repository.owner}, ${repository.name})
      ON CONFLICT DO NOTHING
  `;
}
