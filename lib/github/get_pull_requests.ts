// deno-lint-ignore-file no-explicit-any
import { cond, path, pipe, prop, propEq, propOr } from "ramda";
import { graphql, GraphQLError } from "../graphql/mod.ts";
import { GithubAPI } from "./client.ts";
import { paginate } from "./paginate.ts";
import { ApiError } from "./api_error.ts";
import type { PullRequest } from "./pull_request.ts";
import type { Repository } from "./repository.ts";
import type { User } from "./user.ts";

const GET_PULL_REQUESTS_QUERY = graphql`
  query GetPullRequests($name: String!, $owner: String!, $after: String) {
    repository(name: $name, owner: $owner) {
      pullRequests(after: $after, first: 100) {
        nodes {
          number
          author {
            __typename
            login
          }
          title
          changedFiles
          deletions
          additions
          createdAt
          mergedAt
          closedAt
          reviewRequests(first: 20) {
            nodes {
              requestedReviewer {
                __typename
                ... on User {
                  login
                }
                ... on Team {
                  members {
                    nodes {
                      login
                    }
                  }
                }
              }
            }
          }
          suggestedReviewers {
            reviewer {
              login
            }
          }
          reviews(first: 40) {
            nodes {
              databaseId
              submittedAt
              comments { totalCount }
              author {
                __typename
                login
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

const typenameIs = propEq("__typename");

export async function getPullRequests(
  repository: Repository,
): Promise<PullRequest[]> {
  const results = await paginate(
    path(["repository", "pullRequests", "pageInfo"]),
    ({ after }) =>
      GithubAPI.post(GET_PULL_REQUESTS_QUERY, {
        variables: {
          name: repository.name,
          owner: repository.owner,
          after,
        },
      }),
  );

  const errors: GraphQLError[] = results.flatMap(propOr([], "errors"));
  if (errors.length) throw new ApiError(errors);
  return results.flatMap(({ data }: any) =>
    data.repository.pullRequests.nodes
      .filter(({ author }: any) => typenameIs("User", author))
      .map((pullRequest: any) => ({
        id: pullRequest.number,
        title: pullRequest.title,
        author: pullRequest.author.login,
        deletions: pullRequest.deletions,
        additions: pullRequest.additions,
        createdAt: pullRequest.createdAt,
        mergedAt: pullRequest.mergedAt,
        closedAt: pullRequest.closedAt,
        requestedReviewers: pullRequest.reviewRequests.nodes
          .map(prop("requestedReviewer"))
          .flatMap(
            cond([
              [typenameIs("User"), ({ login }: User) => [login]],
              [
                typenameIs("Team"),
                ({ members }: any) => members.nodes.map("login"),
              ],
            ]),
          ),
        suggestedReviewers: pullRequest.suggestedReviewers.map(
          path(["reviewer", "login"]),
        ),
        reviews: pullRequest.reviews.nodes
          .filter(pipe(prop("author"), typenameIs("User")))
          .map((review: any) => ({
            id: review.databaseId,
            submittedAt: review.submittedAt,
            commentCount: review.comments.totalCount,
            reviewer: review.author.login,
          })),
      }))
  ) as PullRequest[];
}
