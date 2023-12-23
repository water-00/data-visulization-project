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
      y: "CH4",
      value: 0.783
    },
    {
      x: "Temperature",
      y: "CO2",
      value: 0.841
    },
    {
      x: "Temperature",
      y: "N2O",
      value: 0.872
    },
    {
      x: "Temperature",
      y: "PFCs",
      value: -0.830
    },
    {
      x: "Temperature",
      y: "HFCs",
      value: 0.778
    },
    {
      x: "Temperature",
      y: "SF6",
      value: -0.747
    },
    {
      x: "Temperature",
      y: "nf3",
      value: 0.774
    },
   
    {
      x: "CH4",
      y: "Temperature",
      value: 0.783
    },
    {
      x: "CH4",
      y: "CH4",
      value: 1
    },
    {
      x: "CH4",
      y: "CO2",
      value: 0.966
    },
    {
      x: "CH4",
      y: "N2O",
      value: 0.858
    },
    {
      x: "CH4",
      y: "PFCs",
      value: -0.946
    },
    {
      x: "CH4",
      y: "HFCs",
      value: 0.868
    },
    {
      x: "CH4",
      y: "SF6",
      value: -0.812
    },
    {
      x: "CH4",
      y: "nf3",
      value: 0.739
    },
  
    {
      x: "CO2",
      y: "Temperature",
      value: 0.841
    },
    {
      x: "CO2",
      y: "CH4",
      value: 0.966
    },
    {
      x: "CO2",
      y: "CO2",
      value: 1
    },
    {
      x: "CO2",
      y: "N2O",
      value: 0.899
    },
    {
      x: "CO2",
      y: "PFCs",
      value: -0.971
    },
    {
      x: "CO2",
      y: "HFCs",
      value: 0.929
    },
    {
      x: "CO2",
      y: "SF6",
      value: -0.866
    },
    {
      x: "CO2",
      y: "nf3",
      value: 0.842
    },
  
    {
      x: "N2O",
      y: "Temperature",
      value: 0.872
    },
    {
      x: "N2O",
      y: "CH4",
      value: 0.858
    },
    {
      x: "N2O",
      y: "CO2",
      value: 0.899
    },
    {
      x: "N2O",
      y: "N2O",
      value:1
    },
    {
      x: "N2O",
      y: "PFCs",
      value: -0.857
    },
    {
      x: "N2O",
      y: "HFCs",
      value: 0.858
    },
    {
      x: "N2O",
      y: "SF6",
      value: -0.764
    },
    {
      x: "N2O",
      y: "nf3",
      value: 0.807
    },
  
    {
      x: "PFCs",
      y: "Temperature",
      value: -0.830
    },
    {
      x: "PFCs",
      y: "CH4",
      value: -0.946
    },
    {
      x: "PFCs",
      y: "CO2",
      value: -0.971
    },
    {
      x: "PFCs",
      y: "N2O",
      value:-0.857
    },
    {
      x: "PFCs",
      y: "PFCs",
      value: 1
    },
    {
      x: "PFCs",
      y: "HFCs",
      value: -0.830
    },
    {
      x: "PFCs",
      y: "SF6",
      value: 0.890
    },
    {
      x: "PFCs",
      y: "nf3",
      value: -0.879
    },
   
    {
      x: "HFCs",
      y: "Temperature",
      value: 0.778
    },
    {
      x: "HFCs",
      y: "CH4",
      value: 0.868
    },
    {
      x: "HFCs",
      y: "CO2",
      value: 0.929
    },
    {
      x: "HFCs",
      y: "N2O",
      value:0.858
    },
    {
      x: "HFCs",
      y: "PFCs",
      value:-0.830
    },
    {
      x: "HFCs",
      y: "HFCs",
      value: 1
    },
    {
      x: "HFCs",
      y: "SF6",
      value: -0.781
    },
    {
      x: "HFCs",
      y: "nf3",
      value: 0.707
    },
    
    {
      x: "SF6",
      y: "Temperature",
      value: -0.747
    },
    {
      x: "SF6",
      y: "CH4",
      value: -0.812
    },
    {
      x: "SF6",
      y: "CO2",
      value: -0.866
    },
    {
      x: "SF6",
      y: "N2O",
      value:-0.764
    },
    {
      x: "SF6",
      y: "PFCs",
      value:0.890
    },
    {
      x: "SF6",
      y: "HFCs",
      value: -0.781
    },
    {
      x: "SF6",
      y: "SF6",
      value: 1
    },
    {
      x: "SF6",
      y: "nf3",
      value: -0.844
    },
   
    {
      x: "nf3",
      y: "Temperature",
      value: 0.774
    },
    {
      x: "nf3",
      y: "CH4",
      value: 0.739
    },
    {
      x: "nf3",
      y: "CO2",
      value: 0.842
    },
    {
      x: "nf3",
      y: "N2O",
      value:0.807
    },
    {
      x: "nf3",
      y: "PFCs",
      value:-0.879
    },
    {
      x: "nf3",
      y: "HFCs",
      value: 0.707
    },
    {
      x: "nf3",
      y: "SF6",
      value: -0.844
    },
    {
      x: "nf3",
      y: "nf3",
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
const zScale = d3.scaleLinear().domain(zAxis).range([0, 300]);
// 值 => 颜色映射
// const colorScale = d3
//   .scaleLinear()
//   .domain([d3.min(data, (d) => d.value), d3.max(data, (d) => d.value)])
//   .range(["#0000FF", "#FF0000"]);
const colorScale = d3
  .scaleLinear()
  .domain([-1,-0.7,0.70, 1])
     .range(["#b751d3f2","#ec7f98","#FFD467", "#F44334"]);

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
   // const textWidth = d3.select(".tips").node().getComputedTextLength();
    d3.select(".tips")
      .attr("class", "tips show")
      .html(`${data.x},&nbsp;${data.y}:&nbsp;${data.value}`)
      .style("left", `${event.offsetX + 20}px`)
      .style("top", `${event.offsetY - 10}px`)
      .style("width","200px")
      .style("background", color);

    d3.select(".icon")
      .attr("class", "icon show")
      .style("left", `${event.offsetX + 10}px`)
      .style("top", `${event.offsetY + 2}px`)
      .style("background", "#333");
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
  .attr("x", width / 2+100)  // 居中放置标题
  .attr("y", 35)         // 调整标题距离顶部的位置
  .text("温室气体排放与气温升高的相关性分析")
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
  .attr("x", 30)
  .attr("y", (d) => yScale(d) + yHeight / 2)
  .attr("font-size", "15px")
  .attr("text-anchor", "middle")
  .attr("text-anchor", "end") // 使y轴标签靠近坐标轴
  .attr("alignment-baseline", "middle")
  .style("font-weight", "bold"); 

//   const insertLineBreaks = function (d) {//定义了一个函数 insertLineBreaks，该函数接受一个字符串参数 d
//     const el = d3.select(this);
//     const words = d.split(' ');
//     el.text('');
//     for (let i = 0; i < words.length; i++) {
//       const tspan = el.append('tspan')
//         .text(words[i] + ' ');
// //y轴元素名字太长则换行（3个以上则要换行）
//       if (i === 1) {
//         tspan
//           .attr('x', -8)
//           .attr('dy', '16');
//       }
//     }
//   };
//   svg.selectAll('g.yAxis .tick text').each(insertLineBreaks);

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
  .attr("offset", "15%")
  .attr("stop-color", "#FFD467");
  linearGradient
  .append("stop")
  .attr("offset", "75%")
  .attr("stop-color", "#ec7f98");
linearGradient
  .append("stop")
  .attr("offset", "100%")
  .attr("stop-color", "#b751d3f2");//最低

linearGroup
  .append("rect")
  .attr("width", 20)
  .attr("height", 300)
  .attr("fill", "url(#linear)")
  .attr("x", 880)
  .attr("y", 150);

const zAxisData = d3.axisRight(zScale);

const zData = data.map((item) => zScale(item.value));

svg.append("g").call(zAxisData).attr("transform", "translate(900,150)");
}());