import { curry } from "ramda";
import type { GraphQLError } from "./graphql_error.ts";

export interface GraphQLResult<T> {
  data?: T;
  errors?: GraphQLError[];
}

export const mapResult = curry(<T, U>(
  transform: (data: T) => U,
  result: GraphQLResult<T>,
): GraphQLResult<U> => {
  if (result.data) {
    return {
      ...result,
      data: transform(result.data),
    };
  }
  return result as unknown as GraphQLResult<U>;
});
