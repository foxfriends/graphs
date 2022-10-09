import GithubRepositoryMultiPicker from "~/components/GithubRepositoryMultiPicker.tsx";
import GithubPullRequestFrequencyPage from "~/pageComponents/GithubPullRequestFrequencyPage.tsx";

export default function GithubPullRequestReviewers() {
  return (
    <GithubRepositoryMultiPicker>
      {(repositories) => (
        <GithubPullRequestFrequencyPage repositories={repositories} />
      )}
    </GithubRepositoryMultiPicker>
  );
}
