import type { GraphQLError } from "../graphql/graphql_error.ts";

export class ApiError extends Error {
  public errors: GraphQLError[];

  constructor(errors: GraphQLError[]) {
    super(`Github API returned errors:\n${JSON.stringify(errors, null, 2)}`);
    this.errors = errors;
  }
}
