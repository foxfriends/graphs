import { graphql, GraphQLError } from "../graphql/mod.ts";
import { GithubAPI } from "./client.ts";
import { ApiError } from "./api_error.ts";
import type { Repository } from "./repository.ts";
import type { User } from "./user.ts";

const QUERY = graphql`
  query GetRepository($name: String!, $owner: String!) {
    repository(name: $name, owner: $owner) {
      name
      owner {
        login
        avatarUrl
      }
    }
  }
`;

type RepositoryWithOwner = {
  name: string;
  owner: User;
};

type Response = {
  repository: RepositoryWithOwner;
};

export async function getRepository(
  repository: Repository,
): Promise<RepositoryWithOwner> {
  const { data, errors } = await GithubAPI.post<Response>(QUERY, {
    variables: {
      name: repository.name,
      owner: repository.owner,
    },
  });
  console.log(errors);
  if (errors?.length) throw new ApiError(errors);
  return data!.repository;
}
