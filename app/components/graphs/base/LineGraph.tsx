import { useRef, useState } from "react";
import { aperture, max, maxBy, nth, path, prop } from "ramda";
import * as d3 from "d3";
import { useD3 } from "~/hooks/useD3.ts";
import { useBoundingClientRect } from "~/hooks/useBoundingClientRect.ts";

type Line = {
  name: string;
  points: number[];
};

type Props = {
  lines: Line[];
  points: string[];
};

export default function LineGraph({ lines, points }: Props) {
  const tooltipRef = useRef();
  const [container, setContainer] = useState(null);
  const { width = 0, height = 0 } = useBoundingClientRect(container) ?? {};

  const ref = useD3(
    (svg) => {
      const margin = { left: 48, bottom: 32, top: 32, right: 16 };
      svg.attr("viewBox", `0 0 ${width} ${height}`);

      const y = d3
        .scaleLinear()
        .domain([0, lines.flatMap(prop("points")).reduce(max)])
        .range([height - margin.bottom, margin.top]);

      const x = d3
        .scaleLinear()
        .domain([0, points.length])
        .range([margin.left, width - margin.right]);

      const color = d3
        .scaleOrdinal()
        .domain(lines.map((d) => d.name))
        .range(lines.map((_, i) => i / lines.length));

      const yAxis = (g) => g.call(d3.axisLeft(y));
      const xAxis = (g) =>
        g.call(
          d3.axisBottom(x).tickValues(
            points.map((_, i) => i).filter((v) => v % 7 === 0),
          ).tickFormat((i) => points[i]),
        );

      svg
        .select(".lines")
        .selectAll("g")
        .data(lines)
        .join("g")
        .attr("stroke", (d) => d3.interpolateSinebow(color(d.name)))
        .attr("data-key", (d) => d.name)
        .selectAll("line")
        .data((d) => aperture(2, d.points))
        .join("line")
        .attr("data-start", (d) => d[0])
        .attr("data-end", (d) => d[1])
        .attr("opacity", (d) => d[0] === 0 && d[1] === 0 ? 0 : 1)
        .attr("y1", (d) => y(d[0]))
        .attr("y2", (d) => y(d[1]))
        .attr("x1", (d, i) => x(i))
        .attr("x2", (d, i) => x(i + 1));
      svg
        .select(".points")
        .selectAll("g")
        .data(lines)
        .join("g")
        .attr("fill", (d) => d3.interpolateSinebow(color(d.name)))
        .attr("data-key", (d) => d.name)
        .selectAll("circle")
        .data((d) => d.points)
        .join("circle")
        .attr("data-value", (d) => d)
        .attr("r", (d) => d === 0 ? 0 : 3)
        .attr("cy", (d) => y(d))
        .attr("cx", (d, i) => x(i));

      svg.select(".y-axis")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(yAxis);
      svg.select(".x-axis")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(xAxis);

      svg.select(".legend")
        .selectAll("text")
        .data(lines)
        .join("text")
        .text((d) => d.name)
        .attr("fill", (d) => d3.interpolateSinebow(color(d.name)))
        .attr("x", (d) => {
          const [, i] = d.points.map((p, i) => [p, i]).reduce(maxBy(nth(0)));
          return x(i);
        })
        .attr("y", (d) => y(d.points.reduce(max)))
        .attr("text-anchor", "middle")
        .attr("dy", -8);
    },
    [lines, points, width, height],
  );

  return (
    <>
      <div className="chart" ref={setContainer}>
        <svg ref={ref}>
          <g className="legend" />
          <g className="y-axis" />
          <g className="x-axis" />
          <g className="lines" />
          <g className="points" />
        </svg>
      </div>
    </>
  );
}
