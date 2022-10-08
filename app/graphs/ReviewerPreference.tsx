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
import HorizontalStackedBars from "~/components/HorizontalStackedBars.tsx";

export default function ReviewerPreference({ data }) {
  const bars = data.users.map(
    applySpec({
      id: prop("login"),
      image: prop("avatarUrl"),
    }),
  );

  const groups = data.users.map(
    applySpec({
      id: prop("login"),
      name: prop("login"),
    }),
  );

  const zero = Object.fromEntries(groups.map(({ id }) => [id, 0]));
  const stackForBar = (bar) =>
    data.pullRequests
      .filter(whereEq({ author: bar.id }))
      .flatMap(({ id }) =>
        data.reviewers.filter(whereEq({ pullRequestId: id }))
      )
      .map(prop("reviewer"))
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
