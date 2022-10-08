import { type ReactElement, useEffect, useRef, useState } from "react";
import { useEvent } from "~/hooks/useEvent.ts";
import GithubRepositoryList from "~/components/GithubRepositoryList.tsx";
import { type Repository } from "~/types/Repository.ts";

type Props = {
  children: (repository: Repository) => ReactElement;
};

export default function GithubRepositoryPicker({ children }: Props) {
  const [currentRepository, setCurrentRepository] = useState();

  useEvent(window, "keydown", (event) => {
    if (event.key === "Escape") {
      setCurrentRepository(null);
    }
  });

  if (currentRepository) {
    return <>{children(currentRepository)}</>;
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
