import { assoc } from "../deps/ramda.ts";
import { graphql } from "../graphql/mod.ts";
import { GraphQLResult, mapResult } from "../graphql/graphql_result.ts";
import { GithubAPI } from "./client.ts";
import { ApiError } from "./api_error.ts";
import type { User } from "./user.ts";

const QUERY = graphql`
  query GetUser($login: String!) {
    user(login: $login) {
      login
      avatarUrl
    }
  }
`;

type Response = {
  user: User;
};

export async function getUser(login: string): Promise<User> {
  const { data, errors } = await GithubAPI.post<Response>(QUERY, {
    variables: { login },
  });
  if (errors) throw new ApiError(errors);
  return data!.user;
}

export type { GraphQLResult };
