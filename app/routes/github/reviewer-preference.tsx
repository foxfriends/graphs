import GithubRepositoryPicker from "~/components/GithubRepositoryPicker.tsx";
import GithubReviewerPreferencePage from "~/pageComponents/GithubReviewerPreferencePage.tsx";

export default function GithubPullRequestReviewers() {
  return (
    <GithubRepositoryPicker>
      {(repository) => <GithubReviewerPreferencePage repository={repository} />}
    </GithubRepositoryPicker>
  );
}
