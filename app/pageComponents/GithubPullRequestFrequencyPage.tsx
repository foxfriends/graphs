import AllPullRequests from "~/components/graphs/AllPullRequests.tsx";
import Movable from "~/components/Movable.tsx";
import { type Repository } from "~/types/Repository.ts";
import { useGithubPullRequestReviewers } from "~/hooks/api/useGithubPullRequestReviewers.ts";
import { aggregateRepositoryData } from "~/util/aggregateRepositoryData.ts";

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
  const { pullRequests, reviews, requestedReviewers, users } =
    aggregateRepositoryData(alldata);

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
