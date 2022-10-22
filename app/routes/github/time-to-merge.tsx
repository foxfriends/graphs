import GithubRepositoryMultiPicker from "~/components/GithubRepositoryMultiPicker.tsx";
import GithubTimeToMergePage from "~/pageComponents/GithubTimeToMergePage.tsx";

export default function GithubTimeToMerge() {
  return (
    <GithubRepositoryMultiPicker>
      {(repositories) => <GithubTimeToMergePage repositories={repositories} />}
    </GithubRepositoryMultiPicker>
  );
}
