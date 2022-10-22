import GithubRepositoryMultiPicker from "~/components/GithubRepositoryMultiPicker.tsx";
import GithubReviewRequestersPage from "~/pageComponents/GithubReviewRequestersPage.tsx";

export default function GithubPullRequestReviewers() {
  return (
    <GithubRepositoryMultiPicker>
      {(repositories) => (
        <GithubReviewRequestersPage repositories={repositories} />
      )}
    </GithubRepositoryMultiPicker>
  );
}
