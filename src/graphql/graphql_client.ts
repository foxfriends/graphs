import type { GraphQLResult } from "./graphql_result.ts";
import type { GraphQLRequestOptions } from "./graphql_request_options.ts";

export class GraphQLClient {
  constructor(private url: string, private options: object) {}

  private mergeOptions(options: object): object {
    return {
      ...this.options,
      ...options,
      headers: {
        ...this.options.headers,
        ...options.headers,
      },
    };
  }

  async get<T>(
    query: string,
    options?: GraphQLRequestOptions,
  ): GraphQLResult<T> {
    const search = new URLSearchParams({
      query,
      operationName: options?.operationName,
      variables: options?.variables && JSON.stringify(options.variables),
    });
    const url = new URL(this.url);
    url.search = search.toString();
    const response = await fetch(
      url,
      this.mergeOptions({
        method: "GET",
      }),
    );
    return response.json();
  }

  async post<T>(
    query: string,
    options?: GraphQLRequestOptions,
  ): GraphQLResult<T> {
    const response = await fetch(
      this.url,
      this.mergeOptions({
        method: "POST",
        body: JSON.stringify({
          query,
          operationName: options?.operationName,
          variables: options?.variables,
        }),
        headers: { "Content-Type": "application/json" },
      }),
    );
    return response.json();
  }
}

export type { GraphQLRequestOptions, GraphQLResult };
