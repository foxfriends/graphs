import { type ClickEventHandler } from "react";
import { useQuery } from "~/hooks/useQuery.tsx";
import { preventDefault } from "~/util/preventDefault.ts";
import { type Repository } from "~/types/Repository.ts";

type Props = {
  selected?: Repository[];
  onSelect?: (repo: Repository) => void;
};

const printRepository = (repo: Repository) => `${repo.owner}/${repo.name}`;

async function getRepositories() {
  const response = await fetch("/api/github_repositories");
  const { repositories } = await response.json();
  return repositories;
}

export default function GithubRepositoryList({ selected, onSelect }: Props) {
  const { data: repositories = [] } = useQuery(getRepositories, []);

  return (
    <ul className="l-stack space-s0 l-center">
      {repositories.map((repository) => (
        <li
          key={printRepository(repository)}
        >
          {selected && (
            <input
              type="checkbox"
              checked={selected.includes(repository)}
              disabled
            />
          )}
          <a href="" onClick={preventDefault(() => onSelect(repository))}>
            {printRepository(repository)}
          </a>
        </li>
      ))}
    </ul>
  );
}
