import GithubRepositoryPicker from "~/components/GithubRepositoryPicker.tsx";
import GithubTimeToMergePage from "~/pageComponents/GithubTimeToMergePage.tsx";

export default function GithubTimeToMerge() {
  return (
    <GithubRepositoryPicker>
      {(repository) => <GithubTimeToMergePage repository={repository} />}
    </GithubRepositoryPicker>
  );
}
