import type { User } from "./user.ts";

export interface PullRequest {
  id: number;
  title: string;
  author: string;
  reviewers: string[];
}

export function associatedUsers(pr: PullRequest): string[] {
  return [pr.author, ...pr.reviewers];
}
