import { useRef, useState } from "react";
import { prop, uniq } from "ramda";
import * as d3 from "d3";
import { useD3 } from "~/hooks/useD3.ts";
import { useBoundingClientRect } from "~/hooks/useBoundingClientRect.ts";

type Point = {
  group: string;
  value: number;
};

type Props = {
  points: Point[];
};

export default function BoxPlot({ points }: Props) {
  const tooltipRef = useRef();
  const [container, setContainer] = useState(null);
  const { width = 0, height = 0 } = useBoundingClientRect(container) ?? {};

  const ref = useD3(
    (svg) => {
      svg.attr("viewBox", `0 0 ${width} ${height}`);
      const margin = { left: 40, bottom: 40 };

      const sumstat = d3
        .rollup(points, (d) => {
          const q1 = d3.quantile(
            d.map((d) => d.value).sort(d3.ascending),
            0.25,
          );
          const median = d3.quantile(
            d.map((d) => d.value).sort(d3.ascending),
            0.5,
          );
          const q3 = d3.quantile(
            d.map((d) => d.value).sort(d3.ascending),
            0.75,
          );
          const interQuantileRange = q3 - q1;
          const min = Math.max(0, q1 - 1.5 * interQuantileRange);
          const max = q3 + 1.5 * interQuantileRange;
          return {
            q1,
            median,
            q3,
            interQuantileRange,
            min,
            max,
          };
        }, (d) => d.group);

      // Show the X scale
      const groups = uniq(points.map(prop("group")));
      const x = d3.scaleBand()
        .range([0, width - margin.left])
        .domain(groups)
        .paddingInner(1)
        .paddingOuter(.5);
      svg.select(".x-axis")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(x));

      // Show the Y scale
      const [min, max] = [...sumstat.values()]
        .flatMap(({ min, max }) => [min, max])
        .reduce(
          (
            [min, max],
            value,
          ) => [Math.min(min, value), Math.max(max, value)],
          [Infinity, 0],
        );
      const y = d3.scaleLinear()
        .domain([min, max * 1.1])
        .range([height - margin.bottom, 0]);
      svg.select(".y-axis").call(d3.axisLeft(y));

      svg.select(".data").attr(
        "transform",
        `translate(${margin.left}, 0)`,
      );

      // Show the main vertical line
      svg
        .select(".verts")
        .selectAll("line")
        .data(sumstat)
        .join("line")
        .attr("x1", (d) => x(d[0]))
        .attr("x2", (d) => x(d[0]))
        .attr("y1", (d) => y(d[1].min))
        .attr("y2", (d) => y(d[1].max))
        .attr("stroke", "black")
        .style("width", 40);

      // rectangle for the main box
      const boxWidth = ((width - margin.left) / groups.length) * 0.8;

      svg
        .select(".boxes")
        .selectAll("rect")
        .data(sumstat)
        .join("rect")
        .attr("x", (d) => x(d[0]) - boxWidth / 2)
        .attr("y", (d) => y(d[1].q3))
        .attr("height", (d) => y(d[1].q1) - y(d[1].q3))
        .attr("width", boxWidth)
        .attr("stroke", "black")
        .style("fill", "#69b3a2");

      // Show the median
      svg
        .select(".medians")
        .selectAll("line")
        .data(sumstat)
        .join("line")
        .attr("x1", (d) => (x(d[0]) - boxWidth / 2))
        .attr("x2", (d) => (x(d[0]) + boxWidth / 2))
        .attr("y1", (d) => (y(d[1].median)))
        .attr("y2", (d) => y(d[1].median))
        .attr("stroke", "black")
        .style("width", 80);

      // Add individual points with jitter
      const jitterWidth = boxWidth * 0.75;
      svg
        .select(".points")
        .selectAll("circle")
        .data(points)
        .attr("opacity", 0.2)
        .join("circle")
        .attr(
          "cx",
          (d) => x(d.group) - jitterWidth / 2 + Math.random() * jitterWidth,
        )
        .attr("cy", (d) => y(d.value))
        .attr("r", 2)
        .style("fill", "black");
    },
    [points, width, height],
  );

  return (
    <>
      <div className="chart" ref={setContainer}>
        <svg ref={ref}>
          <g className="data">
            <g className="y-axis" />
            <g className="x-axis" />
            <g className="verts" />
            <g className="boxes" />
            <g className="medians" />
            <g className="points" />
          </g>
        </svg>
        <div className="tooltip" ref={tooltipRef} />
      </div>
    </>
  );
}
