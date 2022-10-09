import { prop } from "ramda";
import { connect } from "~/lib/database.ts";

export const GET = async (request) => {
  const db = await connect();
  try {
    const { searchParams } = new URL(request.url);
    const {
      rows: [repository],
    } = await db.queryObject`
    SELECT owner, name
      FROM github_repositories
      WHERE name ILIKE ${searchParams.get("name")}
        AND owner ILIKE ${searchParams.get("owner")}
    `;
    if (!repository) {
      return Response.json({ error: "Not Found" }, { status: 404 });
    }
    const { owner, name } = repository;
    console.log(`Loading pull requests for ${owner}/${name}`);
    const { rows: pullRequests } = await db.queryObject`
    SELECT *
      FROM github_pull_requests
      WHERE repository_owner = ${owner}
        AND repository_name = ${name}
  `;
    console.log(`${pullRequests.length} pull requests found`);
    const { rows: requestedReviewers } = await db.queryObject`
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
    const { rows: reviews } = await db.queryObject`
    SELECT id, pull_request_id as "pullRequestId", reviewer, comment_count as "commentCount", submitted_at as "submittedAt"
      FROM github_pull_request_reviews
      WHERE repository_owner = ${owner}
        AND repository_name = ${name}
  `;
    const logins = Array.from(
      new Set([
        ...pullRequests.map(prop("author")),
        ...reviews.map(prop("reviewer")),
        ...requestedReviewers.map(prop("reviewer")),
        ...suggestedReviewers.map(prop("reviewer")),
      ]),
    );
    const { rows: users } = await db.queryObject`
    SELECT login, avatar_url as "avatarUrl"
      FROM github_users
      WHERE login = ANY(${logins})
  `;
    console.log(`${users.length} pull requests found`);

    return Response.json({
      users,
      requestedReviewers,
      reviews,
      suggestedReviewers,
      pullRequests,
    });
  } finally {
    await db.release();
  }
};
