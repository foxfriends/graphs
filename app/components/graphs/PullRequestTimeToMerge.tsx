import {
  applySpec,
  complement,
  compose,
  descend,
  equals,
  find,
  inc,
  lensProp,
  omit,
  over,
  prop,
  propEq,
  sum,
  values,
  whereEq,
} from "ramda";
import BoxPlot from "./base/BoxPlot.tsx";

const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

export default function PullRequestTimeToMerge({ pullRequests }) {
  const points = pullRequests
    .filter(({ mergedAt }) => !!mergedAt)
    .map(({ author, createdAt, mergedAt }) => ({
      group: author,
      value: (new Date(mergedAt) - new Date(createdAt)) /
        MILLISECONDS_PER_DAY,
    }));

  return <BoxPlot points={points} />;
}
