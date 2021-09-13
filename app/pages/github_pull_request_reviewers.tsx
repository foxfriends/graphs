import { equals, prop, whereEq } from "ramda";
import React, { Fragment, useEffect, useState, useRef } from "react";
import { useD3 } from "~/lib/useD3.ts";
import ScatterSequence from "~/components/ScatterSequence.tsx";

const printRepository = (repo) => `${repo.owner}/${repo.name}`;

export default function GithubPullRequestReviewers() {
  const [repositories, setRepositories] = useState([]);
  const [currentRepository, setCurrentRepository] = useState();
  const [data, setData] = useState();

  useEffect(async () => {
    const response = await fetch("/api/github_repositories");
    const { repositories } = await response.json();
    setRepositories(repositories);
  }, []);

  const load = async (repository) => {
    const url = new URL("/api/github_pull_request_reviewers", window.location.origin);
    url.search = new URLSearchParams(repository).toString();
    const response = await fetch(url);
    if (response.status !== 200) {
      return;
    }
    setCurrentRepository(repository);
    setData(await response.json());
  };

  return (
    <Fragment>
      <style>{`
        .layout {
          display: flex;
          flex-direction: row;
          height: 100vh;
          width: 100vw;
        }

        .settings {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 0 16px;
          text-align: center;
          border-left: 1px solid black;
        }
      `}</style>
      <div className="layout">
        { data ? <ScatterSequence data={data} /> : null }
        <div className="settings">
          <h1>Repository</h1>
          {
            repositories.map((repository) =>
              <button disabled={equals(currentRepository, repository)} onClick={() => load(repository)} key={printRepository(repository)}>
                {printRepository(repository)}
              </button>
            )
          }
        </div>
      </div>
    </Fragment>
  );
}
