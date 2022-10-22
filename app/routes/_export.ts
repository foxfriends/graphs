// Re-imports route modules for serverless env that doesn't support the dynamic import.
// This module will be updated automaticlly in develoment mode, do NOT edit it manually.

import * as $0 from "./_app.tsx";
import * as $1 from "./_404.tsx";
import * as $2 from "./index.tsx";
import * as $3 from "./api/github_pull_request_reviewers.ts";
import * as $4 from "./api/github_repositories.ts";
import * as $5 from "./github/pull-request-over-time.tsx";
import * as $6 from "./github/pull-request-frequency.tsx";
import * as $7 from "./github/time-to-merge.tsx";
import * as $8 from "./github/review-requesters.tsx";
import * as $9 from "./github/reviewer-preference.tsx";
import * as $10 from "./github/time-to-first-review.tsx";

export default {
  "/_app": $0,
  "/_404": $1,
  "/": $2,
  "/api/github_pull_request_reviewers": $3,
  "/api/github_repositories": $4,
  "/github/pull-request-over-time": $5,
  "/github/pull-request-frequency": $6,
  "/github/time-to-merge": $7,
  "/github/review-requesters": $8,
  "/github/reviewer-preference": $9,
  "/github/time-to-first-review": $10,
};
