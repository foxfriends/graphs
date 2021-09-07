import type { User } from "./user.ts";

export interface PullRequest {
  id: number;
  title: string;
  author: string;
  requestedReviewers: string[];
  suggestedReviewers: string[];
  reviewers: string[];
}

export function associatedUsers(pr: PullRequest): string[] {
  return [
    pr.author,
    ...pr.requestedReviewers,
    ...pr.suggestedReviewers,
    ...pr.reviewers,
  ];
}
