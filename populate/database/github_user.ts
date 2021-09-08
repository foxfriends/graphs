import logger from "../logger.ts";
import type { Transaction } from "postgres";

export type GithubUser = {
  login: string;
  avatarUrl: string;
};

export async function getUserByLogin(
  db: Transaction,
  login: string,
): Promise<GithubUser | null> {
  const result = await db.queryObject<GithubUser>`
    SELECT login, avatar_url as "avatarUrl"
      FROM github_users
      WHERE login = ${login}
  `;
  return result?.rows?.[0] ?? null;
}

export async function saveUser(
  db: Transaction,
  user: GithubUser,
): Promise<void> {
  logger.debug("saveUser", user);
  await db.queryArray`
    INSERT INTO github_users (login, avatar_url)
      VALUES (${user.login}, ${user.avatarUrl})
      ON CONFLICT (login) DO UPDATE
      SET avatar_url = ${user.avatarUrl}
  `;
}
