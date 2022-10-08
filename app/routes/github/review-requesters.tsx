import GithubRepositoryPicker from "~/components/GithubRepositoryPicker.tsx";
import GithubReviewRequestersPage from "~/pageComponents/GithubReviewRequestersPage.tsx";

export default function GithubPullRequestReviewers() {
  return (
    <GithubRepositoryPicker>
      {(repository) => <GithubReviewRequestersPage repository={repository} />}
    </GithubRepositoryPicker>
  );
}
