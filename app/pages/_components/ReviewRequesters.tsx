import React, { Fragment } from "react";
import {
  applySpec,
  complement,
  equals,
  inc,
  prop,
  whereEq,
  over,
  lensProp,
} from "ramda";
import HorizontalStackedBars from "~/components/HorizontalStackedBars.tsx";

export default function ReviewRequesters({ data }) {
  const bars = data.users.map(applySpec({
    id: prop('login'),
    image: prop('avatarUrl'),
  }));

  const groups = data.users.map(applySpec({
    id: prop('login'),
    name: prop('login'),
  }));

  const zero = Object.fromEntries(groups.map(({ id }) => [id, 0]))

  const stackForBar = (bar) => data
    .reviewers
    .filter(whereEq({ reviewer: bar.id }))
    .map(({ pullRequestId }) => data.pullRequests.find(whereEq({ id: pullRequestId })))
    .map(prop('author'))
    .filter(complement(equals(bar.id)))
    .reduce((count, name) => over(lensProp(name), inc, count), zero);

  const stacks = bars.map((bar) => ({ bar: bar.id, ...stackForBar(bar) }));

  return (
    <HorizontalStackedBars
      bars={bars}
      groups={groups}
      stacks={stacks}
      />
  );
}
