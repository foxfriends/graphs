import { assoc } from "../deps/ramda.ts";
import { mapResult } from "../graphql/graphql_result.ts";
import { GithubAPI, graphql, GraphQLResult } from "./client.ts";
import type { User } from "./user.ts";

const QUERY = graphql`
  query GetUser($login: String!) {
    user(login: $login) {
      avatarUrl
    }
  }
`;

export function getUser(login: string): User {
  const { data, errors } = await GithubAPI.post(QUERY, {
    variables: { login },
  });
  if (errors) throw new Error(errors);
  return { ...data, login };
}

export type { GraphQLResult };
