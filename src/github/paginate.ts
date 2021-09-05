export interface PageInfo {
  hasNextPage: boolean;
  endCursor?: string;
}

export interface CursorInfo {
  after?: string;
}

export function paginate<T>(
  getPageInfo: (T) => PageInfo | undefined,
  request: (CursorInfo) => GraphQLResult<T>,
): GraphQLResult<T>[] {
  const results = [];
  const cursor = {};
  for (;;) {
    const result = await request(cursor);
    results.push(result);
    const pageInfo = getPageInfo(result.data);
    if (!pageInfo?.hasNextPage) return results;
    cursor.after = pageInfo.endCursor;
  }
}
