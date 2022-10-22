import { prop, uniqBy } from "ramda";

export function aggregateRepositoryData(alldata) {
  const pullRequests = alldata.map(prop("data")).reduce(
    (all, { pullRequests }) => all.concat(pullRequests),
    [],
  );
  const reviews = alldata.map(prop("data")).reduce(
    (all, { reviews }) => all.concat(reviews),
    [],
  );
  const requestedReviewers = alldata.map(prop("data")).reduce(
    (all, { requestedReviewers }) => all.concat(requestedReviewers),
    [],
  );
  const users = uniqBy(
    prop("login"),
    alldata.map(prop("data")).reduce(
      (all, { users }) => all.concat(users),
      [],
    ),
  );

  return { pullRequests, reviews, requestedReviewers, users };
}
