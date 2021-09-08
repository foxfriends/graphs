import { prop, whereEq } from "ramda";
import React, { Fragment, useState, useCallback } from "react";
import * as d3 from "d3";
import { useD3 } from "~/lib/useD3.ts";

export default function GithubPullRequestReviewers() {
  const [owner, setOwner] = useState("");
  const [name, setName] = useState("");
  const [data, setData] = useState();

  const load = useCallback(async () => {
    const url = new URL("/api/github_pull_request_reviewers", window.location.origin);
    url.search = new URLSearchParams({ owner, name }).toString();
    const response = await fetch(url);
    if (response.status !== 200) {
      return;
    }
    setData(await response.json());
  }, [owner, name]);

  const ref = useD3((svg) => {
    if (!data) { return; }

    svg.selectAll("*").remove();

    const { height, width } = svg.node().getBoundingClientRect();
    const margin = { left: 100 };

    const userOrder = Object.fromEntries(data
      .users
      .map(({ login }) => [login, Math.min(...data
        .reviewers
        .filter(whereEq({ reviewer: login }))
        .map(prop('pullRequestId')))]));

    const sortedUsers = data
      .users
      .map(prop('login'))
      .sort((a, b) => userOrder[a] - userOrder[b]);

    const y = d3
      .scaleBand()
      .domain(sortedUsers)
      .range([0, height]);

    const x = d3
      .scaleLinear()
      .domain(d3.extent(data.pullRequests, (d) => d.id))
      .range([0, width]);

    const yAxis = (g) => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .call((g) => g.append("image")
        .attr("x", -Math.min(50, y.bandwidth()))
        .attr("y", (d) => y(d))
        .attr("width", Math.min(50, y.bandwidth()))
        .attr("height", Math.min(50, y.bandwidth()))
        .attr("href", (d) => data.users.find(whereEq({ login: d })).avatarUrl)
      .call((g) => g.append("text")
        .attr("x", -margin.left)
        .attr("y", y.bandwidth() / 2)
        .text((d) => d));

    svg.append("g")
      .attr("fill", "green")
      .selectAll("rect")
      .data(data.reviewers)
      .join("rect")
        .attr("width", 1)
        .attr("height", y.bandwidth())
        .attr("x", (d) => margin.left + d.pullRequestId)
        .attr("y", (d) => y(d.reviewer));

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
        }

        .graph {
          width: 100%;
          height: 100%;
        }

        .settings {
          display: flex;
          flex-direction: column;
          gap: 16px;
          flex-basis: 220px;
        }
      `}</style>
      <div className="layout">
        <main className="viewport">
          <svg ref={ref} className="graph" />
        </main>
        <aside className="settings">
          <h1>Repository</h1>
          <input name="Owner" placeholder="Owner" defaultValue={owner} onChange={(event) => setOwner(event.target.value)} />
          <input name="Name" placeholder="Name" defaultValue={name} onChange={(event) => setName(event.target.value)} />
          <button onClick={load}>
            Load
          </button>
        </aside>
      </div>
    </Fragment>
  );
}
