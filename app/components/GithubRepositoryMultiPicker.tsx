import { type ReactElement, useEffect, useRef, useState } from "react";
import { append, equals, reject } from "ramda";
import { useEvent } from "~/hooks/useEvent.ts";
import GithubRepositoryList from "~/components/GithubRepositoryList.tsx";
import { type Repository } from "~/types/Repository.ts";

type Props = {
  children: (repository: Repository) => ReactElement;
};

export default function GithubRepositoryMultiPicker({ children }: Props) {
  const [repositories, setRepositories] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  console.log(repositories);

  function toggleRepository(repository: Repository) {
    if (repositories.includes(repository)) {
      setRepositories(reject(equals(repository)));
    } else {
      setRepositories(append(repository));
    }
  }

  useEvent(window, "keydown", (event) => {
    if (event.key === "Escape") {
      setSubmitted(false);
    }
  });

  if (submitted) {
    return <>{children(repositories)}</>;
  } else {
    return (
      <div className="l-center">
        <header className="l-box pb-s1">
          <h1>Choose GitHub Repository</h1>
        </header>
        <main className="l-stack space-s1">
          <div>
            <GithubRepositoryList
              selected={repositories}
              onSelect={toggleRepository}
            />
          </div>
          <button onClick={() => setSubmitted(true)}>
            Submit
          </button>
        </main>
      </div>
    );
  }
}
