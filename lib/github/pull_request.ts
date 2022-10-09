import { type PullRequestReview } from "./review.ts";

export interface PullRequest {
  id: number;
  title: string;
  author: string;
  requestedReviewers: string[];
  suggestedReviewers: string[];
  reviews: PullRequestReview[];
  deletions: number;
  additions: number;
  createdAt: string | null;
  mergedAt: string | null;
  closedAt: string | null;
}

export function associatedUsers(pr: PullRequest): string[] {
  return [
    pr.author,
    ...pr.requestedReviewers,
    ...pr.suggestedReviewers,
    ...pr.reviews.map((review) => review.reviewer),
  ];
}
