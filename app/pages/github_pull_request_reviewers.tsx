import { prop, whereEq } from "ramda";
import React, { Fragment, useEffect, useState, useCallback } from "react";
import * as d3 from "d3";
import { useD3 } from "~/lib/useD3.ts";

export default function GithubPullRequestReviewers() {
  const [repositories, setRepositories] = useState([]);
  const [data, setData] = useState();

  useEffect(async () => {
    const response = await fetch("/api/github_repositories");
    const { repositories } = await response.json();
    setRepositories(repositories);
  }, []);

  const load = useCallback(async (repository) => {
    const url = new URL("/api/github_pull_request_reviewers", window.location.origin);
    url.search = new URLSearchParams(repository).toString();
    const response = await fetch(url);
    if (response.status !== 200) {
      return;
    }
    setData(await response.json());
  }, []);

  const ref = useD3((svg) => {
    if (!data) { return; }

    svg.selectAll("*").remove();

    const { height } = svg.node().getBoundingClientRect();
    const margin = { left: 200 };
    const pointWidth = 2;
    const ids = data.pullRequests.map(prop("id")).sort();
    const width = ids.length * (pointWidth + 1) + margin.left;

    svg.attr("width", width);

    const userOrder = Object.fromEntries(data
      .users
      .map(({ login }) => [login, Math.min(...data
        .reviewers
        .filter(whereEq({ reviewer: login }))
        .map(prop("pullRequestId")))]));

    const sortedUsers = data
      .users
      .map(prop("login"))
      .sort((a, b) => userOrder[a] - userOrder[b]);

    const y = d3
      .scaleBand()
      .domain(sortedUsers)
      .range([0, height]);
    const x = d3
      .scaleBand()
      .domain(ids)
      .range([margin.left, width]);

    const avatarSize = Math.min(75, y.bandwidth());

    const yAxis = (g) => g
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y))
      .call((g) => g.selectAll("text").remove())
      .call((g) => g
        .selectAll(".tick")
        .data(sortedUsers)
        .append("g")
        .call((g) => g
          .append("image")
          .attr("x", -avatarSize - 10)
          .attr("y", -avatarSize / 2)
          .attr("width", avatarSize)
          .attr("height", avatarSize)
          .attr("xlink:href", (d) => data.users.find(whereEq({ login: d }))?.avatarUrl))
        .call((g) => g
          .append("text")
          .attr("fill", "black")
          .attr("x", -avatarSize - 20)
          .attr("transform", "translate(-100%, 50%)")
          .text((d) => d)));

    svg.append("g")
      .attr("fill", "#3db843")
      .selectAll("rect")
      .data(data.reviewers)
      .join("rect")
        .attr("width", pointWidth)
        .attr("height", y.bandwidth())
        .attr("x", (d) => x(d.pullRequestId))
        .attr("y", (d) => y(d.reviewer));

    svg.append("g")
      .attr("fill", "#f5faed")
      .selectAll("rect")
      .data(data.pullRequests)
      .join("rect")
        .attr("width", pointWidth)
        .attr("height", y.bandwidth())
        .attr("x", (d) => x(d.id))
        .attr("y", (d) => y(d.author));

    svg.append("g").call(yAxis);
  }, [data]);

  return (
    <Fragment>
      <style>{`
        .layout {
          display: flex;
          flex-direction: row;
          height: 100vh;
          widht: 100vw;
        }

        .viewport {
          flex-basis: 0;
          flex-grow: 1;
          overflow-x: auto;
          overflow-y: hidden;
        }

        .graph {
          height: 100%;
        }

        .settings {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 0 16px;
          text-align: center;
          border-left: 1px solid black;
        }
      `}</style>
      <div className="layout">
        <main className="viewport">
          <svg ref={ref} className="graph" />
        </main>
        <aside className="settings">
          <h1>Repository</h1>
          {
            repositories.map((repository) =>
              <button onClick={() => load(repository)} key={`${repository.owner}/${repository.name}`}>
                {repository.owner}/{repository.name}
              </button>
            )
          }
        </aside>
      </div>
    </Fragment>
  );
}
