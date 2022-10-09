import {
  __,
  always,
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

export default function AllPullRequests({ data }) {
  const colors = {
    author: "#3db843",
    reviewer: "#d5daad",
    requested: "#f5faed",
  };

  const userOrder = Object.fromEntries(
    data.users.map(({ login }) => [
      login,
      Math.min(
        ...data.reviews
          .filter(whereEq({ reviewer: login }))
          .map(prop("pullRequestId")),
        ...data.requestedReviewers
          .filter(whereEq({ reviewer: login }))
          .map(prop("pullRequestId")),
      ),
    ]),
  );
  const buckets = data.users
    .map(
      applySpec({
        id: prop("login"),
        image: prop("avatarUrl"),
      }),
    )
    .sort(ascend(compose(prop(__, userOrder), prop("id"))));
  const sequence = data.pullRequests.sort(ascend(prop("id")));
  const findPullRequest = (id) => data.pullRequests.find(whereEq({ id }));
  const tooltipText = format`#${prop("id")}: ${prop("title")}`;
  const authors = data.pullRequests.map(
    applySpec({
      bucket: prop("author"),
      sequence: prop("id"),
      color: always(colors.author),
      tooltip: tooltipText,
      owningBucket: prop("author"),
    }),
  );
  const reviewers = data.requestedReviewers.map(
    applySpec({
      bucket: prop("reviewer"),
      sequence: prop("pullRequestId"),
      color: always(colors.requested),
      tooltip: pipe(prop("pullRequestId"), findPullRequest, tooltipText),
      owningBucket: pipe(
        prop("pullRequestId"),
        findPullRequest,
        prop("author"),
      ),
    }),
  ).filter(({ bucket, owningBucket }) => bucket !== owningBucket);
  const reviews = data.reviews.map(
    applySpec({
      bucket: prop("reviewer"),
      sequence: prop("pullRequestId"),
      color: always(colors.reviewer),
      tooltip: pipe(prop("pullRequestId"), findPullRequest, tooltipText),
      owningBucket: pipe(
        prop("pullRequestId"),
        findPullRequest,
        prop("author"),
      ),
    }),
  ).filter(({ bucket, owningBucket }) => bucket !== owningBucket);

  const key = (rev) => [rev.bucket, rev.sequence];
  const points = uniqBy(key, [...authors, ...reviewers, ...reviews]);

  return (
    <ScatterSequence buckets={buckets} sequence={sequence} points={points} />
  );
}
