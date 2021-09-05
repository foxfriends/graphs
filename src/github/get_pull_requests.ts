import { cond, prop, propEq } from "../deps/ramda.ts";
import { GithubAPI } from "./client.ts";
import { graphql } from "../graphql/mod.ts";
import { paginate } from "./paginate.ts";
import { mapResult } from "../graphql/graphql_result.ts";
import type { Repository } from "./repository.ts";
import type { PullRequest } from "./pull_request.ts";

const QUERY = graphql`
  query GetPullRequests($name: String!, $owner: String!, $after: String) {
    repository(name: $name, owner: $owner) {
      pullRequests(after: $after, first: 100) {
        nodes {
          databaseId
          author { login }
          title
          reviewRequests {
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

export function getPullRequests(owner: string, repository: string): PullRequest[] {
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

  const errors = results.flatMap(prop("errors"));
  if (errors) throw new Error(errors);
  return results.flatMap(({ data }) =>
    data
      .pullRequests
      .nodes
      .map((pullRequest) => ({
        id: pullRequest.databaseId,
        title: pullRequest.title,
        author: pullRequest.author.login,
        reviewers: reviewRequests
          .nodes
          .map(prop("requestedReviewer"))
          .flatMap(cond(
            [typenameIs("User"), ({ login }) => [login]],
            [typenameIs("Team"), ({ members }) => members.nodes.map("login")],
          )),
      }))
  );
}
