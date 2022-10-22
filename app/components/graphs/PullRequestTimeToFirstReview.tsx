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

const prkey = (pr) => `${pr.repositoryOwner}/${pr.repositoryName}#${pr.id}`;
const revprkey = (rev) =>
  `${rev.repositoryOwner}/${rev.repositoryName}#${rev.pullRequestId}`;

export default function PullRequestTimeToFirstReview(
  { pullRequests, reviews },
) {
  const points = pullRequests
    .flatMap(({ author, createdAt, ...pr }) => {
      const [firstReview] = reviews.filter((rev) => revprkey(rev) === prkey(pr))
        .sort(
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
