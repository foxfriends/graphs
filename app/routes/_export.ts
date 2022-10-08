// Re-imports route modules for serverless env that doesn't support the dynamic import.
// This module will be updated automaticlly in develoment mode, do NOT edit it manually.

import * as $0 from "./_404.tsx";
import * as $1 from "./_app.tsx";
import * as $2 from "./index.tsx";
import * as $3 from "./github/pull-request-frequency.tsx";
import * as $4 from "./github/reviewer-preference.tsx";
import * as $5 from "./github/review-requesters.tsx";
import * as $6 from "./github/time-to-merge.tsx";
import * as $7 from "./api/github_repositories.ts";
import * as $8 from "./api/github_pull_request_reviewers.ts";

export default {
  "/_404": $0,
  "/_app": $1,
  "/": $2,
  "/github/pull-request-frequency": $3,
  "/github/reviewer-preference": $4,
  "/github/review-requesters": $5,
  "/github/time-to-merge": $6,
  "/api/github_repositories": $7,
  "/api/github_pull_request_reviewers": $8,
};
