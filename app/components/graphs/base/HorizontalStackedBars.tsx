import { prop } from "ramda";
import React, { Fragment, useRef } from "react";
import * as d3 from "d3";
import { useD3 } from "~/hooks/useD3.ts";

export default function HorizontalStackedBars({ bars, groups, stacks }) {
  const tooltipRef = useRef();

  const ref = useD3(
    (svg) => {
      const rowHeight = 50;
      const margin = { left: rowHeight + 10 };
      const width = 600;
      const height = rowHeight * bars.length;
      svg.attr("viewBox", `0 0 ${width} ${height}`);

      const stack = d3.stack().keys(groups.map(prop("id")));
      const series = stack(stacks);

      const y = d3
        .scaleBand()
        .domain(bars.map(prop("id")))
        .range([0, height])
        .padding(0.1);

      const x = d3
        .scaleLinear()
        .domain([0, d3.max(series, (d) => d3.max(d, (d) => d[1]))])
        .range([margin.left, width]);

      const color = d3
        .scaleOrdinal()
        .domain(series.map((d) => d.key))
        .range(d3.schemeSpectral[Math.min(11, Math.max(3, series.length))])
        .unknown("#ccc");

      const t = svg.transition().duration(500);

      function showTooltip(event, label) {
        const tooltip = d3.select(tooltipRef.current);
        tooltip.transition().duration(100).style("opacity", 1);
        tooltip
          .text(label)
          .style(
            "transform",
            `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -100%) translateY(-4px)`,
          );
      }

      function hideTooltip() {
        const tooltip = d3.select(tooltipRef.current);
        tooltip.transition().duration(100).style("opacity", 0);
      }

      const yAxis = (g) =>
        g
          .attr("transform", `translate(${margin.left}, 0)`)
          .call(d3.axisLeft(y))
          .call((g) => g.selectAll("text").remove())
          .selectAll("image")
          .data(bars, (d) => d.id)
          .join("image")
          .attr("x", -y.bandwidth() - 10)
          .attr("y", (d) => y(d.id))
          .attr("width", y.bandwidth())
          .attr("height", y.bandwidth())
          .attr("xlink:href", (d) => d.image)
          .on("mouseover", (event, d) => showTooltip(event, d.id))
          .on("mouseout", hideTooltip);

      svg
        .select(".stacks")
        .selectAll("g")
        .data(series)
        .join("g")
        .attr("fill", (d) => color(d.key))
        .on("mouseover", (event, d) => showTooltip(event, d.key))
        .on("mouseout", hideTooltip)
        .selectAll("rect")
        .data((d) => d)
        .join("rect")
        .attr("width", (d) => x(d[1]) - x(d[0]))
        .attr("height", y.bandwidth())
        .attr("y", (d) => y(d.data.bar))
        .attr("x", (d) => x(d[0]));

      svg.select(".y-axis").call(yAxis);
    },
    [bars, groups, stacks],
  );

  return (
    <Fragment>
      <style>
        {`
        .horizontal-stacked-bars {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .horizontal-stacked-bars .tooltip {
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

        .horizontal-stacked-bars .graph {
          max-width: 100%;
          max-height: 100%;
        }
      `}
      </style>
      <div className="horizontal-stacked-bars">
        <svg ref={ref} className="graph">
          <g className="y-axis" />
          <g className="stacks" />
        </svg>
        <div className="tooltip" ref={tooltipRef} />
      </div>
    </Fragment>
  );
}
