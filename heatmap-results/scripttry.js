(function() {
  const width = 800;
  const height = 600;
  
  const margin = {
    top: 30,
    bottom: 100,
    left: 90,
    right: 100,
  };
  
  const innerWidth = width - margin.left - margin.right+50;
  const innerHeight = height - margin.top - margin.bottom;
  
  // 数据
  const data = [
    {
            x: "Temperature",
            y: "Temperature",
            value: 1
          },
          {
            x: "Temperature",
            y: "Sea level",
            value: 0.910
          },
          {
            x: "Temperature",
            y: "Ocean warming",
            value: 0.924
          },
          {
            x: "Temperature",
            y: "Drought",
            value: 0.451
          },
          {
            x: "Temperature",
            y: "Extreme Temperature",
            value: 0.493
          },
          {
            x: "Temperature",
            y: "Flood",
            value: 0.753
          },
          {
            x: "Temperature",
            y: "Landslide",
            value: 0.372
          },
          {
            x: "Temperature",
            y: "Storm",
            value: 0.534
          },
          {
            x: "Temperature",
            y: "Wildfire",
            value: 0.232
          },
          {
            x: "Sea level",
            y: "Temperature",
            value: 0.910
          },
          {
            x: "Sea level",
            y: "Sea level",
            value: 1
          },
          {
            x: "Sea level",
            y: "Ocean warming",
            value: 0.944
          },
          {
            x: "Sea level",
            y: "Drought",
            value: 0.458
          },
          {
            x: "Sea level",
            y: "Extreme Temperature",
            value: 0.522
          },
          {
            x: "Sea level",
            y: "Flood",
            value: 0.734
          },
          {
            x: "Sea level",
            y: "Landslide",
            value: 0.460
          },
          {
            x: "Sea level",
            y: "Storm",
            value: 0.597
          },
          {
            x: "Sea level",
            y: "Wildfire",
            value: 0.297
          },
          {
            x: "Ocean warming",
            y: "Temperature",
            value: 0.924
          },
          {
            x: "Ocean warming",
            y: "Sea level",
            value: 0.944
          },
          {
            x: "Ocean warming",
            y: "Ocean warming",
            value: 1
          },
          {
            x: "Ocean warming",
            y: "Drought",
            value: 0.358
          },
          {
            x: "Ocean warming",
            y: "Extreme Temperature",
            value: 0.529
          },
          {
            x: "Ocean warming",
            y: "Flood",
            value: 0.731
          },
          {
            x: "Ocean warming",
            y: "Landslide",
            value: 0.324
          },
          {
            x: "Ocean warming",
            y: "Storm",
            value: 0.509
          },
          {
            x: "Ocean warming",
            y: "Wildfire",
            value: 0.190
          },
          {
            x: "Drought",
            y: "Temperature",
            value: 0.451
          },
          {
            x: "Drought",
            y: "Sea level",
            value: 0.458
          },
          {
            x: "Drought",
            y: "Ocean warming",
            value: 0.358
          },
          {
            x: "Drought",
            y: "Drought",
            value:1
          },
          {
            x: "Drought",
            y: "Extreme Temperature",
            value: 0.454
          },
          {
            x: "Drought",
            y: "Flood",
            value: 0.433
          },
          {
            x: "Drought",
            y: "Landslide",
            value: 0.405
          },
          {
            x: "Drought",
            y: "Storm",
            value: 0.566
          },
          {
            x: "Drought",
            y: "Wildfire",
            value: 0.483
          },
          {
            x: "Extreme Temperature",
            y: "Temperature",
            value: 0.493
          },
          {
            x: "Extreme Temperature",
            y: "Sea level",
            value: 0.522
          },
          {
            x: "Extreme Temperature",
            y: "Ocean warming",
            value: 0.529
          },
          {
            x: "Extreme Temperature",
            y: "Drought",
            value:0.454
          },
          {
            x: "Extreme Temperature",
            y: "Extreme Temperature",
            value: 1
          },
          {
            x: "Extreme Temperature",
            y: "Flood",
            value: 0.619
          },
          {
            x: "Extreme Temperature",
            y: "Landslide",
            value: 0.218
          },
          {
            x: "Extreme Temperature",
            y: "Storm",
            value: 0.423
          },
          {
            x: "Extreme Temperature",
            y: "Wildfire",
            value: 0.290
          },
          {
            x: "Flood",
            y: "Temperature",
            value: 0.753
          },
          {
            x: "Flood",
            y: "Sea level",
            value: 0.734
          },
          {
            x: "Flood",
            y: "Ocean warming",
            value: 0.731
          },
          {
            x: "Flood",
            y: "Drought",
            value:0.433
          },
          {
            x: "Flood",
            y: "Extreme Temperature",
            value:0.619
          },
          {
            x: "Flood",
            y: "Flood",
            value: 1
          },
          {
            x: "Flood",
            y: "Landslide",
            value: 0.460
          },
          {
            x: "Flood",
            y: "Storm",
            value: 0.522
          },
          {
            x: "Flood",
            y: "Wildfire",
            value: 0.421
          },
          {
            x: "Landslide",
            y: "Temperature",
            value: 0.372
          },
          {
            x: "Landslide",
            y: "Sea level",
            value: 0.460
          },
          {
            x: "Landslide",
            y: "Ocean warming",
            value: 0.324
          },
          {
            x: "Landslide",
            y: "Drought",
            value:0.405
          },
          {
            x: "Landslide",
            y: "Extreme Temperature",
            value:0.218
          },
          {
            x: "Landslide",
            y: "Flood",
            value: 0.460
          },
          {
            x: "Landslide",
            y: "Landslide",
            value: 1
          },
          {
            x: "Landslide",
            y: "Storm",
            value: 0.275
          },
          {
            x: "Landslide",
            y: "Wildfire",
            value: 0.273
          },
          {
            x: "Storm",
            y: "Temperature",
            value: 0.534
          },
          {
            x: "Storm",
            y: "Sea level",
            value: 0.597
          },
          {
            x: "Storm",
            y: "Ocean warming",
            value: 0.509
          },
          {
            x: "Storm",
            y: "Drought",
            value:0.566
          },
          {
            x: "Storm",
            y: "Extreme Temperature",
            value:0.423
          },
          {
            x: "Storm",
            y: "Flood",
            value: 0.522
          },
          {
            x: "Storm",
            y: "Landslide",
            value: 0.275
          },
          {
            x: "Storm",
            y: "Storm",
            value: 1
          },
          {
            x: "Storm",
            y: "Wildfire",
            value: 0.325
          },
          {
            x: "Wildfire",
            y: "Temperature",
            value: 0.232
          },
          {
            x: "Wildfire",
            y: "Sea level",
            value: 0.297
          },
          {
            x: "Wildfire",
            y: "Ocean warming",
            value: 0.190
          },
          {
            x: "Wildfire",
            y: "Drought",
            value:0.483
          },
          {
            x: "Wildfire",
            y: "Extreme Temperature",
            value:0.290
          },
          {
            x: "Wildfire",
            y: "Flood",
            value: 0.421
          },
          {
            x: "Wildfire",
            y: "Landslide",
            value: 0.273
          },
          {
            x: "Wildfire",
            y: "Storm",
            value: 0.325
          },
          {
            x: "Wildfire",
            y: "Wildfire",
            value: 1
          }
    ]
    ;
  
  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", width+200)
    .attr("height", height+50);
  
  const xAxis = [...new Set(data.map((d) => d.x))];
  const yAxis = [...new Set(data.map((d) => d.y))];
  const zAxis = [d3.max(data, (x) => x.value), d3.min(data, (x) => x.value)];
  // x轴 => 宽度映射
  const xScale = d3.scaleBand().domain(xAxis).range([0, innerWidth]);
  // y轴 => 高度映射
  const yScale = d3.scaleBand().domain(yAxis).range([0, innerHeight]);
  // 侧轴值 => 色卡宽度映射
  const zScale = d3.scaleLinear().domain(zAxis).range([0, 250]);
  // 值 => 颜色映射
  const colorScale = d3
    .scaleLinear()
    .domain([d3.min(data, (d) => d.value), d3.max(data, (d) => d.value)])
    .range(["#FFD467", "#F44334"]);
  
  const xWidth = xScale.bandwidth();
  const yHeight = yScale.bandwidth();
  
  const group = svg.append("g").attr("transform", "translate(180,50)");
  
  // 添加柱状图
  group
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("width", xWidth)
    .attr("height", yHeight)
    .attr("fill", "none")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1)
    .attr("x", (d) => xScale(d.x))
    .attr("y", (d) => yScale(d.y))
    .attr("fill", (d) => colorScale(d.value))
    // hover效果
    .on("mousemove", function (event, data) {
      const color = d3.select(this).attr("fill");
      d3.select(".tips")
        .attr("class", "tips show")
        .html(`${data.x},&nbsp;${data.y}:&nbsp;${data.value}`)
        .style("left", `${event.offsetX + 20}px`)
        .style("top", `${event.offsetY - 10}px`)
        .style("width","350px")
        .style("background", color);
  
      d3.select(".icon")
        .attr("class", "icon show")
        .style("left", `${event.offsetX + 10}px`)
        .style("top", `${event.offsetY + 2}px`)
        .style("background","#333");
    })
    .on("mouseout", function () {
      d3.select(".tips").attr("class", "tips");
      d3.select(".icon").attr("class", "icon");
    });
    group
    .selectAll(".bar-label")
    .data(data)
    .join("text")
    .attr("class", "bar-label")
    .text((d) => d.value)
    .attr("x", (d) => xScale(d.x) + xWidth / 2)
    .attr("y", (d) => yScale(d.y) + yHeight / 2)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("fill", "#fff");
    svg.append("text")
    .attr("x", width / 2+120)  // 居中放置标题
    .attr("y", 35)         // 调整标题距离顶部的位置
    .text("气温升高与极端天气的相关性分析")
    .attr("font-size", "23px")
    .attr("text-anchor", "middle")  // 文本居中对齐
    .attr("fill", "#333")  // 根据需要设置颜色
    .style("font-weight", "bold"); 
  // x轴坐标轴
  svg
    .append("g")
    .attr("transform","translate(190,540)" )
    .selectAll("text")
    .data(xAxis)
    .join("text")
    .text((d) => d)
    .attr("fill", "#666")  
    .attr("y", -10) 
    .attr("x", (d) => xScale(d)+ xWidth / 2)  
    .attr("transform", "rotate(-45)")
    .attr("transform", (d) => `rotate(-45 ${xScale(d) + xWidth / 2}, 0)`)
    .attr("font-size", "15px")
    .attr("text-anchor", "end") 
    .style("font-weight", "bold")

  ;
  
  // y轴坐标轴
  svg
    .append("g")
    .attr("transform", "translate(130,55)")
    .selectAll("text")
    .data(yAxis)
    .join("text")
    .text((d) => d)
    .attr("fill", "#666")
    .attr("x", 40)
    .attr("y", (d) => yScale(d) + yHeight / 2)
    .attr("font-size", "15px")
    .attr("text-anchor", "middle")
    .attr("text-anchor", "end") // 使y轴标签靠近坐标轴
    .attr("alignment-baseline", "middle")
    .style("font-weight", "bold")
;

    const linearGroup = svg.append("g");
  
  const linearGradient = linearGroup
    .append("defs")
    .append("linearGradient")
    .attr("id", "linear")
    .attr("x1", "100%")
    .attr("y2", "100%");
  
  linearGradient
    .append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#F44334");
  
  linearGradient
    .append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#FFD467");
  
  linearGroup
    .append("rect")
    .attr("width", 20)
    .attr("height", 250)
    .attr("fill", "url(#linear)")
    .attr("x", 880)
    .attr("y", 180);
  
  const zAxisData = d3.axisRight(zScale);
  
  const zData = data.map((item) => zScale(item.value));
  
  svg.append("g").call(zAxisData).attr("transform", "translate(900,180)");
  }());