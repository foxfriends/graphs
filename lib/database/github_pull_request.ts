import type { Transaction } from "postgres";
import logger from "../logger.ts";
import type { GithubRepository } from "./github_repository.ts";

export type GithubPullRequest = {
  id: number;
  repositoryOwner: string;
  repositoryName: string;
  title: string;
  author: string;
};

export async function getPullRequestById(
  db: Transaction,
  repository: GithubRepository,
  id: number,
): Promise<GithubPullRequest | null> {
  const result = await db.queryObject<GithubPullRequest>`
    SELECT id, repository_owner as "repositoryOwner", repository_name as "repositoryName", title, author
      FROM github_pull_requests
      WHERE repository_owner = ${repository.owner}
        AND repository_name = ${repository.name}
        AND id = ${id}
  `;
  return result?.rows?.[0] ?? null;
}

export async function savePullRequest(
  db: Transaction,
  pullRequest: GithubPullRequest,
): Promise<void> {
  logger.debug("savePullRequest", pullRequest);
  await db.queryArray`
    INSERT INTO github_pull_requests (id, repository_owner, repository_name, title, author, deletions, additions, created_at, merged_at, closed_at)
      VALUES (${pullRequest.id}, ${pullRequest.repositoryOwner}, ${pullRequest.repositoryName}, ${pullRequest.title}, ${pullRequest.author}, ${pullRequest.deletions}, ${pullRequest.additions}, ${pullRequest.createdAt}, ${pullRequest.mergedAt}, ${pullRequest.closedAt})
      ON CONFLICT (repository_owner, repository_name, id) DO UPDATE
      SET title = ${pullRequest.title},
          author = ${pullRequest.author},
          deletions = ${pullRequest.deletions},
          additions = ${pullRequest.additions},
          created_at = ${pullRequest.createdAt},
          merged_at = ${pullRequest.mergedAt},
          closed_at = ${pullRequest.closedAt}
  `;
}
