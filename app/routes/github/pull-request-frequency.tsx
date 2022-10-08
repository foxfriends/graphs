import GithubRepositoryPicker from "~/components/GithubRepositoryPicker.tsx";
import GithubPullRequestFrequencyPage from "~/pageComponents/GithubPullRequestFrequencyPage.tsx";

export default function GithubPullRequestReviewers() {
  return (
    <GithubRepositoryPicker>
      {(repository) => (
        <GithubPullRequestFrequencyPage repository={repository} />
      )}
    </GithubRepositoryPicker>
  );
}
