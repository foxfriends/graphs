import { useState } from "react";
import { append, equals, prop, reject, uniq } from "ramda";
import PullRequestTimeToMerge from "~/components/graphs/PullRequestTimeToMerge.tsx";
import Movable from "~/components/Movable.tsx";
import { type Repository } from "~/types/Repository.ts";
import { useGithubPullRequestReviewers } from "~/hooks/api/useGithubPullRequestReviewers.ts";

type Props = {
  repository: Repository;
};

export default function GithubTimeToMergePage(
  { repository }: Props,
) {
  const [excludedAuthors, setExcludedAuthors] = useState([]);
  const { data } = useGithubPullRequestReviewers(repository);
  if (!data) return null;

  const allAuthors = uniq(data.pullRequests.map(prop("author")));
  const toggleAuthor = (author) => {
    if (excludedAuthors.includes(author)) {
      setExcludedAuthors(reject(equals(author)));
    } else {
      setExcludedAuthors(append(author));
    }
  };

  const pullRequests = data.pullRequests.filter(({ author }) =>
    !excludedAuthors.includes(author)
  );

  return (
    <>
      <Movable>
        <PullRequestTimeToMerge pullRequests={pullRequests} />
      </Movable>
      <div className="legend l-stack space-s0">
        {allAuthors.map((author) => (
          <label>
            <input
              type="checkbox"
              checked={!excludedAuthors.includes(author)}
              onChange={() => toggleAuthor(author)}
            />
            {author}
          </label>
        ))}
      </div>
    </>
  );
}
