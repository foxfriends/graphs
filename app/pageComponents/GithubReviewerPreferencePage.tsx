import ReviewerPreference from "~/components/graphs/ReviewerPreference.tsx";
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
  return <ReviewerPreference data={data} />;
}
