import ReviewRequesters from "~/components/graphs/ReviewRequesters.tsx";
import Movable from "~/components/Movable.tsx";
import { type Repository } from "~/types/Repository.ts";
import { useGithubPullRequestReviewers } from "~/hooks/api/useGithubPullRequestReviewers.ts";

type Props = {
  repository: Repository;
};

export default function GithubReviewRequestersPage(
  { repository }: Props,
) {
  const { data } = useGithubPullRequestReviewers(repository);
  if (!data) return null;
  return (
    <Movable>
      <ReviewRequesters data={data} />
    </Movable>
  );
}
