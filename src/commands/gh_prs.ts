import { transaction } from "../database/mod.ts";
import { savePullRequest } from "../database/github_pull_request.ts";
import {
  GithubRepository,
  saveRepository,
} from "../database/github_repository.ts";
import { saveUser } from "../database/github_user.ts";
import { savePullRequestReviewer } from "../database/github_pull_request_reviewer.ts";
import { getPullRequests, getRepository, getUser } from "../github/mod.ts";
import { associatedUsers } from "../github/pull_request.ts";

export async function ghPrs(
  options: any,
  repositoryOwner: string,
  repositoryName: string,
) {
  const { name, owner } = await getRepository({
    owner: repositoryOwner,
    name: repositoryName,
  });
  const repository: GithubRepository = {
    owner: owner.login,
    name,
  };
  const pullRequests = await getPullRequests(repository);
  const logins = new Set(pullRequests.flatMap(associatedUsers));
  const users = await Promise.all(Array.from(logins, getUser));

  await transaction(async function saveGithubPullRequests(db) {
    for (const user of [owner, ...users]) await saveUser(db, user);
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
