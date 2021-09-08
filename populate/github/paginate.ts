import { GraphQLResult } from "../graphql/graphql_result.ts";

export interface PageInfo {
  hasNextPage: boolean;
  endCursor?: string;
}

export interface CursorInfo {
  after?: string;
}

export async function paginate<T>(
  getPageInfo: (data: T) => PageInfo | undefined,
  request: (cursor: CursorInfo) => Promise<GraphQLResult<T>>,
): Promise<GraphQLResult<T>[]> {
  const results: GraphQLResult<T>[] = [];
  const cursor: CursorInfo = {};
  for (;;) {
    const result = await request(cursor);
    results.push(result);
    const pageInfo = result.data && getPageInfo(result.data);
    if (!pageInfo?.hasNextPage) return results;
    cursor.after = pageInfo.endCursor;
  }
}
