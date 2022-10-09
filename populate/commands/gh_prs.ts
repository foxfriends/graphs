import { type MapTypes } from "cliffy";
import { transaction } from "$lib/database/transaction.ts";
import { savePullRequest } from "$lib/database/github_pull_request.ts";
import {
  GithubRepository,
  saveRepository,
} from "$lib/database/github_repository.ts";
import { saveUser } from "$lib/database/github_user.ts";
import { savePullRequestReviewer } from "$lib/database/github_pull_request_reviewer.ts";
import { savePullRequestSuggestedReviewer } from "$lib/database/github_pull_request_suggested_reviewer.ts";
import { savePullRequestReview } from "$lib/database/github_pull_request_review.ts";
import { getPullRequests, getRepository, getUser } from "$lib/github/mod.ts";
import { associatedUsers } from "$lib/github/pull_request.ts";
import logger from "$lib/logger.ts";

export async function ghPrs(
  _options: MapTypes<void>,
  repositoryOwner: string,
  repositoryName: string,
) {
  const { name, owner } = await getRepository({
    owner: repositoryOwner,
    name: repositoryName,
  });
  logger.info(`Analyzing GitHub repository: ${owner.login}/${name}`);
  const repository: GithubRepository = {
    owner: owner.login,
    name,
  };
  const pullRequests = await getPullRequests(repository);
  logger.info(`${pullRequests.length} pull requests found`);
  const logins = new Set(pullRequests.flatMap(associatedUsers));
  const users = await Promise.all(Array.from(logins, getUser));
  logger.info(`${users.length} users found`);

  await transaction(async function saveGithubPullRequests(db) {
    for (const user of [owner, ...users]) await saveUser(db, user);
    await saveRepository(db, repository);
    for (const pullRequest of pullRequests) {
      await savePullRequest(db, {
        ...pullRequest,
        repositoryOwner: repository.owner,
        repositoryName: repository.name,
      });
      for (const reviewer of pullRequest.requestedReviewers) {
        await savePullRequestReviewer(db, {
          pullRequestId: pullRequest.id,
          repositoryOwner: repository.owner,
          repositoryName: repository.name,
          reviewer,
        });
      }
      for (const review of pullRequest.reviews) {
        await savePullRequestReview(db, {
          pullRequestId: pullRequest.id,
          repositoryOwner: repository.owner,
          repositoryName: repository.name,
          ...review,
        });
      }
      for (const reviewer of pullRequest.suggestedReviewers) {
        await savePullRequestSuggestedReviewer(db, {
          pullRequestId: pullRequest.id,
          repositoryOwner: repository.owner,
          repositoryName: repository.name,
          reviewer,
        });
      }
    }
  });
}
