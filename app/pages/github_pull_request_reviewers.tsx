import { equals, prop, whereEq } from "ramda";
import React, { Fragment, useEffect, useState, useCallback, useRef } from "react";
import * as d3 from "d3";
import { useD3 } from "~/lib/useD3.ts";

const printRepository = (repo) => `${repo.owner}/${repo.name}`;

export default function GithubPullRequestReviewers() {
  const [repositories, setRepositories] = useState([]);
  const [currentRepository, setCurrentRepository] = useState();
  const [data, setData] = useState();
  const tooltipRef = useRef();

  useEffect(async () => {
    const response = await fetch("/api/github_repositories");
    const { repositories } = await response.json();
    setRepositories(repositories);
  }, []);

  const load = async (repository) => {
    const url = new URL("/api/github_pull_request_reviewers", window.location.origin);
    url.search = new URLSearchParams(repository).toString();
    const response = await fetch(url);
    if (response.status !== 200) {
      return;
    }
    setCurrentRepository(repository);
    setData(await response.json());
  };

  const ref = useD3((svg) => {
    if (!data) { return; }

    svg.selectAll("*").remove();

    const { height } = svg.node().getBoundingClientRect();
    const margin = { left: 200 };
    const pointWidth = 2;
    const ids = data.pullRequests.map(prop("id")).sort((a, b) => a - b);
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

    function showAuthorTooltip(event, d) {
      const tooltip = d3.select(tooltipRef.current);
      tooltip.transition().duration(100).style("opacity", 1);
      tooltip
        .text(`#${d.id}: ${d.title}`)
        .style("transform", `translate(${event.pageX}px, ${event.pageY}px) translate(-50%, -100%) translateY(-4px)`);
      d3.selectAll(`[data-pr="${d.id}"]`).classed("highlight", true);
    }

    function showReviewerTooltip(event, d) {
      const pullRequest = data.pullRequests.find(whereEq({ id: d.pullRequestId }));
      showAuthorTooltip(event, pullRequest);
    }

    function hideTooltip() {
      const tooltip = d3.select(tooltipRef.current);
      tooltip.transition().duration(100).style("opacity", 0);
      d3.selectAll(".highlight").classed("highlight", false);
    }

    svg.append("g")
      .attr("fill", "#3db843")
      .selectAll("rect")
      .data(data.reviewers)
      .join("rect")
        .attr("width", pointWidth)
        .attr("height", y.bandwidth())
        .attr("x", (d) => x(d.pullRequestId))
        .attr("y", (d) => y(d.reviewer))
        .attr("class", "reviewer")
        .attr("data-pr", (d) => d.pullRequestId)
        .on("mouseover", showReviewerTooltip)
        .on("mouseout", hideTooltip);

    svg.append("g")
      .attr("fill", "#f5faed")
      .selectAll("rect")
      .data(data.pullRequests)
      .join("rect")
        .attr("width", pointWidth)
        .attr("height", y.bandwidth())
        .attr("x", (d) => x(d.id))
        .attr("y", (d) => y(d.author))
        .attr("data-pr", (d) => d.id)
        .attr("class", "author")
        .on("mouseover", showAuthorTooltip)
        .on("mouseout", hideTooltip);

    svg.append("g").call(yAxis);
  }, [data]);

  return (
    <Fragment>
      <style>{`
        .layout {
          display: flex;
          flex-direction: row;
          height: 100vh;
          width: 100vw;
        }

        .viewport {
          position: relative;
          flex-basis: 0;
          flex-grow: 1;
          overflow-x: auto;
          overflow-y: hidden;
        }

        .tooltip {
          position: fixed;
          top: 0;
          left: 0;
          background: white;
          padding: 4px;
          border-radius: 2px;
          border: 1px solid rgba(0, 0, 0, 0.12);
          opacity: 0;
          box-shadow: 0 0 1px rgba(0, 0, 0, 0.25);
          pointer-events: none;
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

        .highlight.author { fill: #59d5eb; }
        .highlight.reviewer { fill: #234dd9; }
      `}</style>
      <div className="layout">
        <main className="viewport">
          <svg ref={ref} className="graph" />
          <div className="tooltip" ref={tooltipRef}>
          </div>
        </main>
        <aside className="settings">
          <h1>Repository</h1>
          {
            repositories.map((repository) =>
              <button disabled={equals(currentRepository, repository)} onClick={() => load(repository)} key={printRepository(repository)}>
                {printRepository(repository)}
              </button>
            )
          }
        </aside>
      </div>
    </Fragment>
  );
}
