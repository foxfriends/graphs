import logger from "../logger.ts";
import type { Transaction } from "../deps/postgres.ts";
import type { GithubPullRequest } from "./github_pull_request.ts";

export type GithubPullRequestSuggestedReviewer = {
  pullRequestId: number;
  repositoryOwner: string;
  repositoryName: string;
  reviewer: string;
};

export async function getSuggestedReviewersForPullRequest(
  db: Transaction,
  pullRequest: GithubPullRequest,
): Promise<GithubPullRequestSuggestedReviewer[]> {
  const result = await db.queryObject<GithubPullRequestSuggestedReviewer>`
    SELECT pull_request_id as "pullRequestId", repository_owner as "repositoryOwner", repository_name as "repositoryName", reviewer
      FROM github_pull_request_suggested_reviewers
      WHERE repository_owner = ${pullRequest.repositoryOwner}
        AND repository_name = ${pullRequest.repositoryName}
        AND pull_request_id = ${pullRequest.id}
  `;
  return result?.rows ?? [];
}

export async function savePullRequestSuggestedReviewer(
  db: Transaction,
  reviewer: GithubPullRequestSuggestedReviewer,
): Promise<void> {
  logger.debug("savePullRequestReviewer", reviewer);
  await db.queryArray`
    INSERT INTO github_pull_request_suggested_reviewers (pull_request_id, repository_owner, repository_name, reviewer)
      VALUES (${reviewer.pullRequestId}, ${reviewer.repositoryOwner}, ${reviewer.repositoryName}, ${reviewer.reviewer})
      ON CONFLICT DO NOTHING
  `;
}
