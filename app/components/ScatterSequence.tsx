import { prop, whereEq } from "ramda";
import React, { Fragment, useCallback, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { useD3 } from "~/lib/useD3.ts";
import { Set } from "immutable";

export default function ScatterSequence({
  buckets,
  sequence,
  points,
}) {
  const tooltipRef = useRef();

  const [bucketsHidden, setBucketsHidden] = useState(new Set());

  const toggleBucket = useCallback((event, bucket) => {
    if (bucketsHidden.has(bucket.id)) {
      setBucketsHidden(bucketsHidden.delete(bucket.id));
    } else {
      setBucketsHidden(bucketsHidden.add(bucket.id));
    }
  }, [bucketsHidden]);

  const relevantPoints = useMemo(
    () => points.filter(({ owningBucket }) => !bucketsHidden.has(owningBucket)),
    [points, bucketsHidden],
  );
  const relevantSequence = useMemo(
    () =>
      sequence.filter(({ id }) =>
        relevantPoints.find(whereEq({ sequence: id }))
      ),
    [relevantPoints],
  );

  const ref = useD3((svg) => {
    const pointWidth = 3;
    const rowHeight = 75;
    const margin = { left: rowHeight + 10 };
    const width = relevantSequence.length * (pointWidth + 1) + margin.left;
    const height = rowHeight * buckets.length;
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const y = d3
      .scaleBand()
      .domain(buckets.map(prop("id")))
      .range([0, height]);

    const x = d3
      .scaleBand()
      .domain(relevantSequence.map(prop("id")))
      .range([margin.left + 1, width]);

    const t = svg.transition().duration(500);

    const yAxis = (g) =>
      g
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y))
        .call((g) => g.selectAll("text").remove())
        .selectAll("image")
        .data(buckets, (d) => d.id)
        .join(
          (enter) =>
            enter
              .append("image")
              .attr("x", -y.bandwidth() - 10)
              .attr("y", (d) => y(d.id))
              .attr("width", y.bandwidth())
              .attr("height", y.bandwidth())
              .attr("xlink:href", (d) => d.image)
              .style("opacity", (d) => bucketsHidden.has(d.id) ? 0.5 : 1)
              .style("cursor", "pointer")
              .on("click", toggleBucket),
          (update) =>
            update
              .style("opacity", (d) => bucketsHidden.has(d.id) ? 0.5 : 1)
              .on("click", toggleBucket)
              .call((update) => update.transition(t).attr("y", (d) => y(d.id))),
          (remove) => remove.remove(),
        );

    function showTooltip(event, d) {
      const tooltip = d3.select(tooltipRef.current);
      tooltip.transition().duration(100).style("opacity", 1);
      tooltip
        .text(d.tooltip)
        .style(
          "transform",
          `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -100%) translateY(-4px)`,
        );
      d3.selectAll(`[data-sequence="${d.sequence}"]`).classed(
        "highlight",
        true,
      );
    }

    function hideTooltip() {
      const tooltip = d3.select(tooltipRef.current);
      tooltip.transition().duration(100).style("opacity", 0);
      d3.selectAll(".highlight").classed("highlight", false);
    }

    svg
      .select(".points")
      .selectAll("rect")
      .data(relevantPoints, (d) => `${d.bucket}/${d.sequence}`)
      .join(
        (enter) =>
          enter
            .append("rect")
            .attr("fill", (d) => d.color)
            .attr("width", pointWidth)
            .attr("height", y.bandwidth())
            .attr("x", (d) => x(d.sequence))
            .attr("y", (d) => y(d.bucket))
            .attr("data-sequence", (d) => d.sequence)
            .attr("data-bucket", (d) => d.bucket)
            .on("mouseover", showTooltip)
            .on("mouseout", hideTooltip),
        (update) =>
          update
            .attr("fill", (d) => d.color)
            .on("mouseover", showTooltip)
            .on("mouseout", hideTooltip)
            .call((update) =>
              update
                .transition(t)
                .attr("x", (d) => x(d.sequence))
                .attr("y", (d) => y(d.bucket))
            ),
        (remove) => remove.remove(),
      );

    svg
      .select(".y-axis")
      .call(yAxis);
  }, [bucketsHidden, buckets, relevantPoints, relevantSequence]);

  return (
    <Fragment>
      <style>
        {`
        .scatter-sequence {
          position: relative;
          overflow-x: auto;
          overflow-y: hidden;
          max-width: 100%;
          height: 100%;
        }

        .scatter-sequence .tooltip {
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

        .scatter-sequence .graph {
          max-width: 100%;
          max-height: 100%;
        }

        .scatter-sequence .highlight { fill: #59d5eb; }
      `}
      </style>
      <div className="scatter-sequence">
        <svg ref={ref} className="graph">
          <g className="y-axis" />
          <g className="points" />
        </svg>
        <div className="tooltip" ref={tooltipRef} />
      </div>
    </Fragment>
  );
}
