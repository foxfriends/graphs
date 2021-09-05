import { client } from '../pg';
import { getUser, getPullRequests } from '../github/mod.ts';

export async function ghPrs(options: any, owner: string, repository: string) {
  const pullRequests = await getPullRequests(owner, repository);
  const
}
