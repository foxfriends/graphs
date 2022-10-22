import GithubRepositoryMultiPicker from "~/components/GithubRepositoryMultiPicker.tsx";
import GithubPullRequestsOverTime from "~/pageComponents/GithubPullRequestsOverTime.tsx";

export default function GithubPullRequestReviewers() {
  return (
    <GithubRepositoryMultiPicker>
      {(repositories) => (
        <GithubPullRequestsOverTime repositories={repositories} />
      )}
    </GithubRepositoryMultiPicker>
  );
}
