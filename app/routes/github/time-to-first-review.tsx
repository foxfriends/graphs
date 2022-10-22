import GithubRepositoryMultiPicker from "~/components/GithubRepositoryMultiPicker.tsx";
import GithubTimeToFirstReviewPage from "~/pageComponents/GithubTimeToFirstReviewPage.tsx";

export default function GithubTimeUntilFirstReview() {
  return (
    <GithubRepositoryMultiPicker>
      {(repositories) => (
        <GithubTimeToFirstReviewPage repositories={repositories} />
      )}
    </GithubRepositoryMultiPicker>
  );
}
