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

export default function PullRequestTimeToMerge({ pullRequests }) {
  const points = pullRequests
    .filter(({ merged_at }) => !!merged_at)
    .map(({ author, created_at, merged_at }) => ({
      group: author,
      value: (new Date(merged_at) - new Date(created_at)) / 1000 / 60 / 60 / 24,
    }));

  return <BoxPlot points={points} />;
}
