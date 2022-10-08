// Re-imports route modules for serverless env that doesn't support the dynamic import.
// This module will be updated automaticlly in develoment mode, do NOT edit it manually.

import * as $0 from "./_404.tsx";
import * as $1 from "./_app.tsx";
import * as $2 from "./index.tsx";
import * as $3 from "./github/pull-request-reviewers.tsx";
import * as $4 from "./api/github_repositories.ts";
import * as $5 from "./api/github_pull_request_reviewers.ts";

export default {
  "/_404": $0,
  "/_app": $1,
  "/": $2,
  "/github/pull-request-reviewers": $3,
  "/api/github_repositories": $4,
  "/api/github_pull_request_reviewers": $5,
};
