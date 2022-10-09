import {
  applySpec,
  ascend,
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

export default function PullRequestTimeToMerge({ pullRequests, reviews }) {
  const points = pullRequests
    .flatMap(({ id, author, createdAt }) => {
      const [firstReview] = reviews.filter(propEq("pullRequestId", id)).sort(
        ascend(prop("submittedAt")),
      );
      if (!firstReview) return [];
      return [{
        group: author,
        value: (new Date(firstReview.submittedAt) - new Date(createdAt)) /
          MILLISECONDS_PER_DAY,
      }];
    });

  return <BoxPlot points={points} />;
}
