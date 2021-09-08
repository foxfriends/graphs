import type { GraphQLErrorLocation } from "./graphql_error_location.ts";

export interface GraphQLError {
  message: string;
  locations: GraphQLErrorLocation[];
}
