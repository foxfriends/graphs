import AllPullRequests from "~/components/graphs/AllPullRequests.tsx";
import Movable from "~/components/Movable.tsx";
import { type Repository } from "~/types/Repository.ts";
import { useGithubPullRequestReviewers } from "~/hooks/api/useGithubPullRequestReviewers.ts";

type Props = {
  repository: Repository;
};

export default function GithubPullRequestFrequencyPage(
  { repository }: Props,
) {
  const { data } = useGithubPullRequestReviewers(repository);
  if (!data) return null;
  return (
    <Movable>
      <AllPullRequests data={data} />
    </Movable>
  );
}
