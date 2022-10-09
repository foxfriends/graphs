import type { Transaction } from "postgres";
import logger from "../logger.ts";

export type GithubPullRequestReview = {
  id: number;
  pullRequestId: number;
  repositoryOwner: string;
  repositoryName: string;
  reviewer: string;
  commentCount: number;
  submittedAt: string;
};

export async function savePullRequestReview(
  db: Transaction,
  review: GithubPullRequestReview,
): Promise<void> {
  logger.debug("saveReview", review);
  await db.queryArray`
    INSERT INTO github_pull_request_reviews (id, pull_request_id, repository_owner, repository_name, reviewer, comment_count, submitted_at)
      VALUES (${review.id}, ${review.pullRequestId}, ${review.repositoryOwner}, ${review.repositoryName}, ${review.reviewer}, ${review.commentCount}, ${review.submittedAt})
      ON CONFLICT (id) DO UPDATE
      SET reviewer = ${review.reviewer},
          comment_count = ${review.commentCount},
          submitted_at = ${review.submittedAt}
  `;
}
