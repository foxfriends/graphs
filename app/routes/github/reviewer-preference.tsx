import GithubRepositoryMultiPicker from "~/components/GithubRepositoryMultiPicker.tsx";
import GithubReviewerPreferencePage from "~/pageComponents/GithubReviewerPreferencePage.tsx";

export default function GithubPullRequestReviewers() {
  return (
    <GithubRepositoryMultiPicker>
      {(repositories) => (
        <GithubReviewerPreferencePage repositories={repositories} />
      )}
    </GithubRepositoryMultiPicker>
  );
}
