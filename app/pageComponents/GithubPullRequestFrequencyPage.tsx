import { prop, uniqBy } from "ramda";
import AllPullRequests from "~/components/graphs/AllPullRequests.tsx";
import Movable from "~/components/Movable.tsx";
import { type Repository } from "~/types/Repository.ts";
import { useGithubPullRequestReviewers } from "~/hooks/api/useGithubPullRequestReviewers.ts";

type Props = {
  repositories: Repository;
};

export default function GithubPullRequestFrequencyPage(
  { repositories }: Props,
) {
  const alldata = repositories.map((repository) =>
    useGithubPullRequestReviewers(repository)
  );
  const loaded = alldata.every(({ data }) => !!data);
  if (!loaded) return null;

  const pullRequests = alldata.map(prop("data")).reduce(
    (all, { pullRequests }) => [...all, ...pullRequests],
    [],
  );
  const reviews = alldata.map(prop("data")).reduce(
    (all, { reviews }) => [...all, ...reviews],
    [],
  );
  const requestedReviewers = alldata.map(prop("data")).reduce(
    (all, { requestedReviewers }) => [...all, ...requestedReviewers],
    [],
  );
  const users = uniqBy(
    prop("login"),
    alldata.map(prop("data")).reduce(
      (all, { users }) => [...all, ...users],
      [],
    ),
  );

  return (
    <Movable>
      <AllPullRequests
        pullRequests={pullRequests}
        reviews={reviews}
        requestedReviewers={requestedReviewers}
        users={users}
      />
    </Movable>
  );
}
