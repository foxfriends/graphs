import { equals, prop, whereEq } from "ramda";
import { useEffect, useRef, useState } from "react";
import GithubPullRequestReviewersDashboard from "./_components/GithubPullRequestReviewersDashboard.tsx";

const printRepository = (repo) => `${repo.owner}/${repo.name}`;

export default function GithubPullRequestReviewers() {
  const [repositories, setRepositories] = useState([]);
  const [currentRepository, setCurrentRepository] = useState();
  const [data, setData] = useState();

  useEffect(() => {
    void (async () => {
      const response = await fetch("/api/github_repositories");
      const { repositories } = await response.json();
      setRepositories(repositories);
    })();
  }, []);

  const load = async (repository) => {
    const url = new URL(
      "/api/github_pull_request_reviewers",
      window.location.origin
    );
    url.search = new URLSearchParams(repository).toString();
    const response = await fetch(url);
    if (response.status !== 200) {
      return;
    }
    setCurrentRepository(repository);
    setData(await response.json());
  };

  if (currentRepository) {
    return <GithubPullRequestReviewersDashboard data={data} />;
  } else {
    return (
      <>
        <style>
          {`
          .choose-repository {
            display: flex;
            flex-direction: column;
            gap: 16px;
            padding: 16px;
            align-items: flex-start;
          }

          .repository {
            padding: 8px;
          }
        `}
        </style>
        <div className="choose-repository">
          {repositories.map((repository) => (
            <button
              className="repository"
              onClick={() => load(repository)}
              key={printRepository(repository)}
            >
              {printRepository(repository)}
            </button>
          ))}
        </div>
      </>
    );
  }
}
