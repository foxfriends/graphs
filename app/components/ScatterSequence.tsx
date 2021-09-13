import { prop, whereEq } from "ramda";
import React, { Fragment, useCallback, useState, useRef } from "react";
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

  const ref = useD3((svg) => {
    const relevantPoints = points
      .filter(({ bucket }) => !bucketsHidden.has(bucket));
    const relevantSequence = sequence
      .filter(({ id }) => relevantPoints.find(whereEq({
        sequence: id,
        owned: true,
      })));

    svg.selectAll("*").remove();

    const margin = { left: 200 };
    const pointWidth = 3;
    const rowHeight = 75;
    const width = relevantSequence.length * (pointWidth + 1) + margin.left;
    const height = rowHeight * buckets.length;
    svg.attr("width", width);
    svg.attr("height", height);

    const y = d3
      .scaleBand()
      .domain(buckets.map(prop('id')))
      .range([0, height]);

    const x = d3
      .scaleBand()
      .domain(relevantSequence.map(prop('id')))
      .range([margin.left, width]);

    const yAxis = (g) => g
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y))
      .call((g) => g.selectAll("text").remove())
      .selectAll("g")
      .data(buckets)
      .join("g")
      .attr("y", (d) => y(d.id))
      .attr("class", "label")
      .call((g) => g
        .append("image")
        .attr("x", -y.bandwidth() - 10)
        .attr("y", -y.bandwidth() / 2)
        .attr("width", y.bandwidth())
        .attr("height", y.bandwidth())
        .attr("xlink:href", (d) => d.image)
        .on("click", toggleBucket)
        .style("opacity", (d) => bucketsHidden.has(d.id) ? 0.5 : 1)
        .style("cursor", "pointer"))
      .call((g) => g
        .append("text")
        .attr("fill", "black")
        .attr("x", -y.bandwidth() - 20)
        .attr("transform", "translate(-100%, 50%)")
        .text((d) => d.id)));

    function showTooltip(event, d) {
      const tooltip = d3.select(tooltipRef.current);
      tooltip.transition().duration(100).style("opacity", 1);
      tooltip
        .text(d.tooltip)
        .style("transform", `translate(${event.pageX}px, ${event.pageY}px) translate(-50%, -100%) translateY(-4px)`);
      d3.selectAll(`[data-sequence="${d.sequence}"]`).classed("highlight", true);
    }

    function hideTooltip() {
      const tooltip = d3.select(tooltipRef.current);
      tooltip.transition().duration(100).style("opacity", 0);
      d3.selectAll(".highlight").classed("highlight", false);
    }

    svg
      .append("g")
      .selectAll("rect")
      .data(relevantPoints)
      .join("rect")
        .attr("fill", (d) => d.color)
        .attr("width", pointWidth)
        .attr("height", y.bandwidth())
        .attr("x", (d) => x(d.sequence))
        .attr("y", (d) => y(d.bucket))
        .attr("data-sequence", (d) => d.sequence)
        .attr("data-bucket", (d) => d.bucket)
        .on("mouseover", showTooltip)
        .on("mouseout", hideTooltip);
    svg.append("g").call(yAxis);
  }, [bucketsHidden, buckets, sequence, points]);

  return (
    <Fragment>
      <style>{`
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

        .highlight { fill: #59d5eb; }
      `}</style>
      <div className="viewport">
        <svg ref={ref} className="graph" />
        <div className="tooltip" ref={tooltipRef} />
      </div>
    </Fragment>
  );
}
