import {
  __,
  always,
  aperture,
  applySpec,
  ascend,
  compose,
  find,
  pipe,
  prop,
  uniqBy,
  whereEq,
} from "ramda";
import { useState } from "react";
import ScatterSequence from "./base/ScatterSequence.tsx";
import { format } from "~/lib/format.ts";
import { getPath, setPath } from "~/util/cache.ts";

export default function AllPullRequests(
  { pullRequests, reviews, requestedReviewers, users },
) {
  const colors = {
    author: "#3db843",
    reviewer: "#d5daad",
    requested: "#f5faed",
  };

  const userOrder = Object.fromEntries(
    users.map(({ login }) => [
      login,
      Math.min(
        ...reviews
          .filter(whereEq({ reviewer: login }))
          .map(prop("pullRequestId")),
        ...requestedReviewers
          .filter(whereEq({ reviewer: login }))
          .map(prop("pullRequestId")),
      ),
    ]),
  );
  const buckets = users
    .map(
      applySpec({
        id: prop("login"),
        image: prop("avatarUrl"),
      }),
    )
    .sort(ascend(compose(prop(__, userOrder), prop("id"))));
  const sequence = pullRequests.sort(ascend(prop("createdAt"))).map(
    prop("createdAt"),
  );

  // deno-fmt-ignore
  const prKey = format`${prop("repositoryOwner")}/${prop("repositoryName")}#${prop("id")}`;
  const pullRequestIndex = new Map(
    pullRequests.map((pr) => [prKey(pr), pr]),
  );
  const findPullRequest = (
    { pullRequestId: id, repositoryName, repositoryOwner },
  ) => pullRequestIndex.get(prKey({ id, repositoryName, repositoryOwner }));
  // deno-fmt-ignore
  const tooltipText = format`${prKey}: ${prop("title")}`;
  const authorPoints = pullRequests.map(
    applySpec({
      bucket: prop("author"),
      sequence: prop("createdAt"),
      color: always(colors.author),
      tooltip: tooltipText,
      owningBucket: prop("author"),
    }),
  );
  const reviewerPoints = requestedReviewers.map(
    applySpec({
      bucket: prop("reviewer"),
      sequence: pipe(findPullRequest, prop("createdAt")),
      color: always(colors.requested),
      tooltip: pipe(findPullRequest, tooltipText),
      owningBucket: pipe(
        findPullRequest,
        prop("author"),
      ),
    }),
  ).filter(({ bucket, owningBucket }) => bucket !== owningBucket);
  const reviewPoints = reviews.map(
    applySpec({
      bucket: prop("reviewer"),
      sequence: pipe(findPullRequest, prop("createdAt")),
      color: always(colors.reviewer),
      tooltip: pipe(findPullRequest, tooltipText),
      owningBucket: pipe(
        findPullRequest,
        prop("author"),
      ),
    }),
  ).filter(({ bucket, owningBucket }) => bucket !== owningBucket);

  const key = (rev) => [rev.bucket, rev.sequence];
  const points = uniqBy(key, [
    ...authorPoints,
    ...reviewerPoints,
    ...reviewPoints,
  ]);
  const segments = aperture(2, sequence).filter((
    [a, b],
  ) => new Date(a).getDate() != new Date(b).getDate());

  return (
    <ScatterSequence
      buckets={buckets}
      sequence={sequence}
      points={points}
      segments={segments}
    />
  );
}
