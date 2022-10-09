import { useCallback, useMemo, useRef, useState } from "react";
import { prop, whereEq } from "ramda";
import * as d3 from "d3";
import { Set } from "immutable";
import { useD3 } from "~/hooks/useD3.ts";
import { useBoundingClientRect } from "~/hooks/useBoundingClientRect.ts";

type Bucket = {
  id: string;
};

type Sequence = {
  id: string;
};

type Point = {
  owningBucket: string;
  sequence: id;
};

type Props = {
  buckets: Bucket[];
  sequence: Sequence[];
  points: Point[];
  segments?: [string, string][];
};

export default function ScatterSequence(
  { buckets, sequence, points, segments = [] }: Props,
) {
  const tooltipRef = useRef();
  const [container, setContainer] = useState(null);
  const { width = 0, height = 0, left = 0, top = 0 } =
    useBoundingClientRect(container) ?? {};

  const [bucketsHidden, setBucketsHidden] = useState(new Set());

  const toggleBucket = useCallback(
    (event, bucket) => {
      if (bucketsHidden.has(bucket.id)) {
        setBucketsHidden(bucketsHidden.delete(bucket.id));
      } else {
        setBucketsHidden(bucketsHidden.add(bucket.id));
      }
    },
    [bucketsHidden],
  );

  const relevantPoints = useMemo(
    () => points.filter(({ owningBucket }) => !bucketsHidden.has(owningBucket)),
    [points, bucketsHidden],
  );
  const relevantSequence = useMemo(
    () =>
      sequence.filter((sequence) => relevantPoints.find(whereEq({ sequence }))),
    [relevantPoints],
  );

  const ref = useD3(
    (svg) => {
      const rowHeight = height / buckets.length;
      const margin = { left: rowHeight + 10 };
      svg.attr("viewBox", `0 0 ${width} ${height}`);

      const y = d3
        .scaleBand()
        .domain(buckets.map(prop("id")))
        .range([0, height]);

      const x = d3
        .scaleBand()
        .domain(relevantSequence)
        .range([margin.left + 1, width]);

      const yAxis = (g) =>
        g
          .attr("transform", `translate(${margin.left}, 0)`)
          .call(d3.axisLeft(y))
          .call((g) => g.selectAll("text").remove())
          .selectAll("image")
          .data(buckets, (d) => d.id)
          .join("image")
          .attr("x", -y.bandwidth() - 10)
          .attr("y", (d) => y(d.id))
          .attr("width", y.bandwidth())
          .attr("height", y.bandwidth())
          .attr("href", (d) => d.image)
          .style("opacity", (d) => (bucketsHidden.has(d.id) ? 0.5 : 1))
          .style("cursor", "pointer")
          .on("click", toggleBucket);

      function showTooltip(event, d) {
        const tooltip = d3.select(tooltipRef.current);
        tooltip.transition().duration(100).style("opacity", 1);
        tooltip
          .text(d.tooltip)
          .style(
            "transform",
            `translate(${x(d.sequence)}px, ${
              y(d.bucket)
            }px) translate(-50%, -100%) translateY(-4px)`,
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
        .join("rect")
        .attr("fill", (d) => d.color)
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .attr("x", (d) => x(d.sequence))
        .attr("y", (d) => y(d.bucket))
        .attr("data-sequence", (d) => d.sequence)
        .attr("data-bucket", (d) => d.bucket)
        .on("mouseover", showTooltip)
        .on("mouseout", hideTooltip);

      svg.select(".segments")
        .selectAll("line")
        .data(segments)
        .join("line")
        .attr("x1", (d) => x(d[1]) - 1)
        .attr("x2", (d) => x(d[1]) - 1)
        .attr("y1", 0)
        .attr("y2", height)
        .attr("stroke", "#000000")
        .attr("opacity", 0.02);

      svg.select(".y-axis").call(yAxis);
    },
    [
      bucketsHidden,
      buckets,
      segments,
      relevantPoints,
      relevantSequence,
      width,
      height,
      left,
      top,
    ],
  );

  return (
    <>
      <style>
        {`
        .scatter-sequence .highlight { fill: #59d5eb; }
        `}
      </style>
      <div className="chart scatter-sequence" ref={setContainer}>
        <svg ref={ref} className="graph" xmlns="http://www.w3.org/2000/svg">
          <g className="y-axis" />
          <g className="points" />
          <g className="segments" />
        </svg>
        <div className="tooltip" ref={tooltipRef} />
      </div>
    </>
  );
}
