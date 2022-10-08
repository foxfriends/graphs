// Re-imports route modules for serverless env that doesn't support the dynamic import.
// This module will be updated automaticlly in develoment mode, do NOT edit it manually.

import * as $0 from "./_404.tsx";
import * as $1 from "./_app.tsx";
import * as $2 from "./index.tsx";
import * as $3 from "./github_pull_request_reviewers.tsx";
import * as $4 from "./_components/AllPullRequests.tsx";
import * as $5 from "./_components/GithubPullRequestReviewersDashboard.tsx";
import * as $6 from "./_components/ReviewerPreference.tsx";
import * as $7 from "./_components/ReviewRequesters.tsx";
import * as $8 from "./api/github_repositories.ts";
import * as $9 from "./api/github_pull_request_reviewers.ts";

export default {
  "/_404": $0,
  "/_app": $1,
  "/": $2,
  "/github_pull_request_reviewers": $3,
  "/_components/AllPullRequests": $4,
  "/_components/GithubPullRequestReviewersDashboard": $5,
  "/_components/ReviewerPreference": $6,
  "/_components/ReviewRequesters": $7,
  "/api/github_repositories": $8,
  "/api/github_pull_request_reviewers": $9,
};
