import logger from "../logger.ts";
import type { Transaction } from "postgres";
import type { GithubPullRequest } from "./github_pull_request.ts";

export type GithubPullRequestReviewer = {
  pullRequestId: number;
  repositoryOwner: string;
  repositoryName: string;
  reviewer: string;
};

export async function getReviewersForPullRequest(
  db: Transaction,
  pullRequest: GithubPullRequest,
): Promise<GithubPullRequestReviewer[]> {
  const result = await db.queryObject<GithubPullRequestReviewer>`
    SELECT pull_request_id as "pullRequestId", repository_owner as "repositoryOwner", repository_name as "repositoryName", reviewer
      FROM github_pull_request_reviewers
      WHERE repository_owner = ${pullRequest.repositoryOwner}
        AND repository_name = ${pullRequest.repositoryName}
        AND pull_request_id = ${pullRequest.id}
  `;
  return result?.rows ?? [];
}

export async function savePullRequestReviewer(
  db: Transaction,
  reviewer: GithubPullRequestReviewer,
): Promise<void> {
  logger.debug("savePullRequestReviewer", reviewer);
  await db.queryArray`
    INSERT INTO github_pull_request_reviewers (pull_request_id, repository_owner, repository_name, reviewer)
      VALUES (${reviewer.pullRequestId}, ${reviewer.repositoryOwner}, ${reviewer.repositoryName}, ${reviewer.reviewer})
      ON CONFLICT DO NOTHING
  `;
}
