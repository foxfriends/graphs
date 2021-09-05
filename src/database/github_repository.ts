import type { Transaction } from "../deps/postgres.ts";

export type GithubRepository = {
  owner: string;
  name: string;
};

export async function saveRepository(
  db: Transaction,
  repository: GithubRepository,
): Promise<void> {
  await db.queryArray`
    INSERT INTO github_repositories (owner, name)
      VALUES (${repository.owner}, ${repository.name})
      ON CONFLICT DO NOTHING
  `;
}
