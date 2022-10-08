import { type Repository } from "~/types/Repository.ts";
import { useQuery } from "../useQuery.tsx";

async function getGithubPullRequestReviewers(
  repository: Repository,
) {
  const url = new URL(
    "/api/github_pull_request_reviewers",
    window.location.origin,
  );
  url.search = new URLSearchParams(repository).toString();
  const response = await fetch(url);
  if (response.status !== 200) {
    throw new Error("Error");
  }
  return response.json();
}

export function useGithubPullRequestReviewers(repository: Repository) {
  return useQuery(getGithubPullRequestReviewers, [repository]);
}
