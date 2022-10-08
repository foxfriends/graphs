import ReviewRequesters from "~/components/graphs/ReviewRequesters.tsx";
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
  return <ReviewRequesters data={data} />;
}
