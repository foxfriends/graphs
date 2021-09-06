import { complement, cond, path, prop, propEq, propOr } from "../deps/ramda.ts";
import { graphql, GraphQLError } from "../graphql/mod.ts";
import { GithubAPI } from "./client.ts";
import { paginate } from "./paginate.ts";
import { mapResult } from "../graphql/graphql_result.ts";
import { ApiError } from "./api_error.ts";
import type { PullRequest } from "./pull_request.ts";
import type { Repository } from "./repository.ts";

const QUERY = graphql`
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
          reviewRequests(first: 100) {
            nodes {
              requestedReviewer {
                __typename
                ...on User { login }
                ...on Team {
                  members {
                    nodes { login }
                  }
                }
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
      GithubAPI.post(QUERY, {
        variables: {
          name: repository.name,
          owner: repository.owner,
          after,
        },
      }),
  );

  const errors: GraphQLError[] = results
    .flatMap(propOr([], "errors"));
  if (errors.length) throw new ApiError(errors);
  return results.flatMap(({ data }: any) =>
    data
      .repository
      .pullRequests
      .nodes
      .filter(({ author }: any) => typenameIs("User", author))
      .map((pullRequest: any) => ({
        id: pullRequest.number,
        title: pullRequest.title,
        author: pullRequest.author.login,
        reviewers: pullRequest
          .reviewRequests
          .nodes
          .map(prop("requestedReviewer"))
          .flatMap(cond([
            [typenameIs("User"), ({ login }: any) => [login]],
            [typenameIs("Team"), ({ members }: any) =>
              members.nodes.map("login")],
          ])),
      }))
  ) as PullRequest[];
}
