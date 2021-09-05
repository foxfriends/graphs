import { curry } from "../deps/ramda.ts";
import type { GraphQLError } from "./graphql_error.ts";

export interface GraphQLResult<T> {
  data?: T;
  errors?: GraphQLError[];
}

export const mapResult = curry(<T, U>(
  transform: (T) => U,
  result: GraphQLResult<T>,
): GraphQLResult<U> => {
  if (result.data) {
    return {
      ...result,
      data: transform(result.data),
    };
  }
  return result;
});
