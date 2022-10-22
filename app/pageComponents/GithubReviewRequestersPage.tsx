import ReviewRequesters from "~/components/graphs/ReviewRequesters.tsx";
import Movable from "~/components/Movable.tsx";
import { type Repository } from "~/types/Repository.ts";
import { useGithubPullRequestReviewers } from "~/hooks/api/useGithubPullRequestReviewers.ts";
import { aggregateRepositoryData } from "~/util/aggregateRepositoryData.ts";

type Props = {
  repositories: Repository[];
};

export default function GithubReviewRequestersPage(
  { repositories }: Props,
) {
  const alldata = repositories.map((repository) =>
    useGithubPullRequestReviewers(repository)
  );
  const loaded = alldata.every(({ data }) => !!data);
  if (!loaded) return null;
  const { users, pullRequests, reviews, requestedReviewers } =
    aggregateRepositoryData(alldata);
  return (
    <Movable>
      <ReviewRequesters
        pullRequests={pullRequests}
        requestedReviewers={requestedReviewers}
        reviews={reviews}
        users={users}
      />
    </Movable>
  );
}
