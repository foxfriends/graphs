import {
  ascend,
  groupBy,
  groupWith,
  last,
  nth,
  pipe,
  prop,
  whereEq,
} from "ramda";
import { useState } from "react";
import addDays from "date-fns/addDays/index.ts";
import addWeeks from "date-fns/addWeeks/index.ts";
import format from "date-fns/format/index.js";
import isSameDay from "date-fns/isSameDay/index.ts";
import isBefore from "date-fns/isBefore/index.ts";
import isSameWeek from "date-fns/isSameWeek/index.ts";
import startOfDay from "date-fns/startOfDay/index.ts";
import startOfWeek from "date-fns/startOfWeek/index.ts";
import LineGraph from "./base/LineGraph.tsx";
import { getPath, setPath } from "~/util/cache.ts";

type Scale = "day" | "week";

const labelFormat = (date) => format(date, "yyyy/MM/dd");
const toDate = (d) => new Date(d);
const bucket = { day: isSameDay, week: isSameWeek };
const step = { day: (d) => addDays(d, 1), week: (d) => addWeeks(d, 1) };
const label = { day: labelFormat, week: pipe(startOfWeek, labelFormat) };
const start = { day: startOfDay, week: startOfWeek };

const daterange = (start, end, step = (d) => addDays(d, 1)) => {
  const dates = [];
  while (!isBefore(end, start)) {
    dates.push(start);
    start = step(start);
  }
  return dates;
};

export default function PullRequestsOverTime(
  { pullRequests, scale = "week", users },
) {
  const pullRequestsOrdered = pullRequests.sort(
    ascend(pipe(prop("createdAt"), toDate)),
  );

  const fromDate = start[scale](new Date(pullRequestsOrdered[0].createdAt));
  const endDate = start[scale](new Date(last(pullRequestsOrdered).createdAt));
  const points = daterange(fromDate, endDate, step[scale]).map(label[scale]);

  const pullRequestsByAuthor = groupBy(prop("author"), pullRequestsOrdered);

  const lines = users.map(({ login }) => [
    login,
    pullRequestsOrdered.find(whereEq({ author: login }))?.createdAt,
  ]).filter(nth(1)).sort(ascend(pipe(nth(1), toDate))).map(nth(0)).map(
    (login) => {
      const pullRequestsByDay = groupBy(
        pipe(prop("createdAt"), toDate, start[scale], label[scale]),
        pullRequestsByAuthor[login],
      );
      return {
        name: login,
        points: points.map((date) => pullRequestsByDay[date]?.length ?? 0),
      };
    },
  );

  return <LineGraph lines={lines} points={points} />;
}
