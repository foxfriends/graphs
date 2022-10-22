import { useState } from "react";
import { prop, uniqBy } from "ramda";
import PullRequestsOverTime from "~/components/graphs/PullRequestsOverTime.tsx";
import Movable from "~/components/Movable.tsx";
import { type Repository } from "~/types/Repository.ts";
import { useGithubPullRequestReviewers } from "~/hooks/api/useGithubPullRequestReviewers.ts";

type Props = {
  repositories: Repository;
};

export default function GithubPullRequestsOverTime(
  { repositories }: Props,
) {
  const [scale, setScale] = useState("week");
  const alldata = repositories.map((repository) =>
    useGithubPullRequestReviewers(repository)
  );
  const loaded = alldata.every(({ data }) => !!data);
  if (!loaded) return null;

  const pullRequests = alldata.map(prop("data")).reduce(
    (all, { pullRequests }) => [...all, ...pullRequests],
    [],
  );
  const users = uniqBy(
    prop("login"),
    alldata.map(prop("data")).reduce(
      (all, { users }) => [...all, ...users],
      [],
    ),
  );

  return (
    <>
      <Movable>
        <PullRequestsOverTime
          scale={scale}
          pullRequests={pullRequests}
          users={users}
        />
      </Movable>
      <div className="legend l-stack space-s0">
        <label>
          <select
            value={scale}
            onChange={(event) => setScale(event.target.value)}
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
          </select>
        </label>
      </div>
    </>
  );
}
