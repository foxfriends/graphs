import type { GraphQLResult } from "./graphql_result.ts";
import type { GraphQLRequestOptions } from "./graphql_request_options.ts";

export class GraphQLClient {
  constructor(private url: string, private options: RequestInit) {}

  private mergeOptions(options: RequestInit): object {
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
    options: GraphQLRequestOptions = {},
  ): Promise<GraphQLResult<T>> {
    const params: Record<string, string> = { query };
    if (options.operationName) params.operationName = options.operationName;
    if (options.variables) {
      params.operationName = JSON.stringify(options.variables);
    }
    const search = new URLSearchParams(params);
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
    options: GraphQLRequestOptions = {},
  ): Promise<GraphQLResult<T>> {
    const response = await fetch(
      this.url,
      this.mergeOptions({
        method: "POST",
        body: JSON.stringify({
          query,
          operationName: options.operationName,
          variables: options.variables,
        }),
        headers: { "Content-Type": "application/json" },
      }),
    );
    return response.json();
  }
}

export type { GraphQLRequestOptions, GraphQLResult };
