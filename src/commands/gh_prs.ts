import { transaction } from "../database/mod.ts";
import { savePullRequest } from "../database/github_pull_request.ts";
import {
  GithubRepository,
  saveRepository,
} from "../database/github_repository.ts";
import { saveUser } from "../database/github_user.ts";
import { savePullRequestReviewer } from "../database/github_pull_request_reviewer.ts";
import { getPullRequests, getUser } from "../github/mod.ts";
import { associatedUsers } from "../github/pull_request.ts";

export async function ghPrs(options: any, owner: string, repository: string) {
  return getGithubPullRequestsForRepository({ owner, name: repository });
}

async function getGithubPullRequestsForRepository(
  repository: GithubRepository,
) {
  const pullRequests = await getPullRequests(repository);
  const logins = new Set(pullRequests.flatMap(associatedUsers));
  const users = await Promise.all(Array.from(logins, getUser));

  await transaction(async (db) => {
    for (const user of users) await saveUser(db, user);
    await saveRepository(db, repository);
    for (const pullRequest of pullRequests) {
      await savePullRequest(db, {
        id: pullRequest.id,
        repositoryOwner: repository.owner,
        repositoryName: repository.name,
        title: pullRequest.title,
        author: pullRequest.author,
      });
      for (const reviewer of pullRequest.reviewers) {
        await savePullRequestReviewer(db, {
          pullRequestId: pullRequest.id,
          repositoryOwner: repository.owner,
          repositoryName: repository.name,
          reviewer,
        });
      }
    }
  });
}
