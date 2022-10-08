import { useRef, useState } from "react";
import { prop } from "ramda";
import * as d3 from "d3";
import { useD3 } from "~/hooks/useD3.ts";
import { useBoundingClientRect } from "~/hooks/useBoundingClientRect.ts";

export default function HorizontalStackedBars({ bars, groups, stacks }) {
  const tooltipRef = useRef();
  const [container, setContainer] = useState(null);
  const { width = 0, height = 0 } = useBoundingClientRect(container) ?? {};

  const ref = useD3(
    (svg) => {
      const rowHeight = height / bars.length;
      const margin = { left: rowHeight + 10 };
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

      function showAxisTooltip(event, d) {
        const tooltip = d3.select(tooltipRef.current);
        tooltip.transition().duration(100).style("opacity", 1);
        tooltip
          .text(d.id)
          .style(
            "transform",
            `translate(${y.bandwidth() / 2 + 10}px, ${
              y(d.id)
            }px) translate(-50%, -100%) translateY(-4px)`,
          );
      }

      function showDataTooltip(event, d) {
        const tooltip = d3.select(tooltipRef.current);
        tooltip.transition().duration(100).style("opacity", 1);
        tooltip
          .text(event.target.parentElement.getAttribute("data-key"))
          .style(
            "transform",
            `translate(${(x(d[0]) + x(d[1])) / 2}px, ${
              y(d.data.bar)
            }px) translate(-50%, -100%) translateY(-4px)`,
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
          .on("mouseover", showAxisTooltip)
          .on("mouseout", hideTooltip);

      svg
        .select(".stacks")
        .selectAll("g")
        .data(series)
        .join("g")
        .attr("fill", (d) => color(d.key))
        .attr("data-key", (d) => d.key)
        .selectAll("rect")
        .data((d) => d)
        .join("rect")
        .attr("width", (d) => x(d[1]) - x(d[0]))
        .attr("height", y.bandwidth())
        .attr("y", (d) => y(d.data.bar))
        .attr("x", (d) => x(d[0]))
        .on("mouseover", showDataTooltip)
        .on("mouseout", hideTooltip);

      svg.select(".y-axis").call(yAxis);
    },
    [bars, groups, stacks, width, height],
  );

  return (
    <>
      <div className="chart" ref={setContainer}>
        <svg ref={ref}>
          <g className="y-axis" />
          <g className="stacks" />
        </svg>
        <div className="tooltip" ref={tooltipRef} />
      </div>
    </>
  );
}
