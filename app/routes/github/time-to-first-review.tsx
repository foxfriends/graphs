import GithubRepositoryPicker from "~/components/GithubRepositoryPicker.tsx";
import GithubTimeToFirstReviewPage from "~/pageComponents/GithubTimeToFirstReviewPage.tsx";

export default function GithubTimeUntilFirstReview() {
  return (
    <GithubRepositoryPicker>
      {(repository) => <GithubTimeToFirstReviewPage repository={repository} />}
    </GithubRepositoryPicker>
  );
}
