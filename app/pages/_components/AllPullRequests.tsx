import { __, always, whereEq, pipe, ascend, compose, applySpec, prop, find } from "ramda";
import React, { Fragment, useState } from "react";
import ScatterSequence from "~/components/ScatterSequence.tsx";
import { format } from "~/lib/format.ts";

export default function AllPullRequests({ data }) {
  const [focus, setFocus] = useState('authors');
  const colors = {
    fg: '#3db843',
    bg: '#f5faed',
  };

  const userOrder = Object.fromEntries(data
    .users
    .map(({ login }) => [login, Math.min(...data
      .reviewers
      .filter(whereEq({ reviewer: login }))
      .map(prop("pullRequestId")))]));
  const buckets = data.users
    .map(applySpec({
      id: prop('login'),
      image: prop('avatarUrl'),
    }))
    .sort(ascend(compose(prop(__, userOrder), prop('id'))));
  const sequence = data
    .pullRequests
    .sort(ascend(prop('id')));
  const findPullRequest = (id) => data.pullRequests.find(whereEq({ id }));
  const tooltipText = format`#${prop('id')}: ${prop('title')}`;
  const authors = data.pullRequests.map(applySpec({
    bucket: prop('author'),
    sequence: prop('id'),
    color: always(focus === 'authors' ? colors.fg : colors.bg),
    tooltip: tooltipText,
    owningBucket: prop('author'),
  }));
  const reviewers = data.reviewers.map(applySpec({
    bucket: prop('reviewer'),
    sequence: prop('pullRequestId'),
    color: always(focus === 'reviewers' ? colors.fg : colors.bg),
    tooltip: pipe(prop('pullRequestId'), findPullRequest, tooltipText),
    owningBucket: pipe(prop('pullRequestId'), findPullRequest, prop('author')),
  }));

  const points = [
    ...authors,
    ...reviewers,
  ];

  return (
    <ScatterSequence
      buckets={buckets}
      sequence={sequence}
      points={points}
      />
  );
}
