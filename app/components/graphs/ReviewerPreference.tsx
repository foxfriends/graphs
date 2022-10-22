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
  uniq,
  values,
  whereEq,
} from "ramda";
import HorizontalStackedBars from "./base/HorizontalStackedBars.tsx";

const prkey = (pr) => `${pr.repositoryOwner}/${pr.repositoryName}#${pr.id}`;
const revprkey = (rev) =>
  `${rev.repositoryOwner}/${rev.repositoryName}#${rev.pullRequestId}`;

export default function ReviewerPreference(
  { users, pullRequests, requestedReviewers, reviews },
) {
  const bars = users.map(
    applySpec({
      id: prop("login"),
      image: prop("avatarUrl"),
    }),
  );

  const groups = users.map(
    applySpec({
      id: prop("login"),
      name: prop("login"),
    }),
  );

  const zero = Object.fromEntries(groups.map(({ id }) => [id, 0]));
  const stackForBar = (bar) =>
    pullRequests
      .filter(whereEq({ author: bar.id }))
      .flatMap((pr) =>
        uniq(
          [...requestedReviewers, ...reviews].filter((rev) =>
            revprkey(rev) === prkey(pr)
          )
            .map(prop("reviewer")),
        )
      )
      .filter(complement(equals(bar.id)))
      .reduce((count, name) => over(lensProp(name), inc, count), zero);
  const stacks = bars.map((bar) => ({ bar: bar.id, ...stackForBar(bar) }));

  bars.sort(
    descend(
      compose(
        sum,
        values,
        omit(["bar"]),
        (id) => find(propEq("bar", id), stacks),
        prop("id"),
      ),
    ),
  );

  return <HorizontalStackedBars bars={bars} groups={groups} stacks={stacks} />;
}
