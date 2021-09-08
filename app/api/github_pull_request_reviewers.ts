import type { APIHandler } from "aleph/types";
import { prop } from "ramda";

export const handler: APIHandler = async ({ data, request, response }) => {
  const { searchParams } = new URL(request.url);
  const db = data.get('db');
  const { rows: [repository] } = await db.queryObject`
    SELECT owner, name
      FROM github_repositories
      WHERE name ILIKE ${searchParams.get('name')}
        AND owner ILIKE ${searchParams.get('owner')}
  `;
  if (!repository) {
    response.status = 404;
    response.body = 'Not found';
    return;
  }
  const { owner, name } = repository;
  console.log(`Loading pull requests for ${owner}/${name}`);
  const { rows: pullRequests } = await db.queryObject`
    SELECT id, title, author
      FROM github_pull_requests
      WHERE repository_owner = ${owner}
        AND repository_name = ${name}
  `;
  console.log(`${pullRequests.length} pull requests found`);
  const { rows: reviewers } = await db.queryObject`
    SELECT pull_request_id as "pullRequestId", reviewer
      FROM github_pull_request_reviewers
      WHERE repository_owner = ${owner}
        AND repository_name = ${name}
  `;
  const { rows: suggestedReviewers } = await db.queryObject`
    SELECT pull_request_id as "pullRequestId", reviewer
      FROM github_pull_request_suggested_reviewers
      WHERE repository_owner = ${owner}
        AND repository_name = ${name}
  `;
  const logins = Array.from(new Set([
    ...pullRequests.map(prop('author')),
    ...reviewers.map(prop('reviewer')),
  ]));
  const { rows: users } = await db.queryObject`
    SELECT login, avatar_url as "avatarUrl"
      FROM github_users
      WHERE login = ANY(${logins})
  `;
  console.log(`${users.length} pull requests found`);

  response.json({
    users,
    reviewers,
    suggestedReviewers,
    pullRequests,
  });
}
