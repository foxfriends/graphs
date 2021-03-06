import { GraphQLClient } from "../graphql/mod.ts";
import { GHACCESSTOKEN } from "../env.ts";

export const GithubAPI = new GraphQLClient("https://api.github.com/graphql", {
  headers: {
    Authorization: `Bearer ${GHACCESSTOKEN}`,
  },
});
