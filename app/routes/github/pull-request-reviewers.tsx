import { equals, prop, whereEq } from "ramda";
import { useEffect, useRef, useState } from "react";
import { useEvent } from "~/hooks/useEvent.ts";
import { useQuery } from "~/hooks/useQuery.tsx";
import GithubRepositoryList from "~/components/GithubRepositoryList.tsx";
import GithubPullRequestReviewersPage from "~/pageComponents/GithubPullRequestReviewersPage/mod.ts";

async function getGithubPullRequestReviewers(repository) {
  if (!repository) return;
  const url = new URL(
    "/api/github_pull_request_reviewers",
    window.location.origin,
  );
  url.search = new URLSearchParams(repository).toString();
  const response = await fetch(url);
  if (response.status !== 200) {
    throw new Error("Error");
  }
  return response.json();
}

export default function GithubPullRequestReviewers() {
  const [currentRepository, setCurrentRepository] = useState();
  const { data } = useQuery(getGithubPullRequestReviewers, [currentRepository]);

  useEvent(window, "keydown", (event) => {
    if (event.key === "Escape") {
      setCurrentRepository(null);
    }
  });

  if (currentRepository) {
    return <GithubPullRequestReviewersPage data={data} />;
  } else {
    return (
      <div className="l-center">
        <header className="l-box pb-s1">
          <h1>Choose GitHub Repository</h1>
        </header>
        <main>
          <GithubRepositoryList onSelect={setCurrentRepository} />
        </main>
      </div>
    );
  }
}
