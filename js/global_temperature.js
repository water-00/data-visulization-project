export function global_temperature(data) {
    var chartContainer = document.getElementById('climate-chart');
    chartContainer.style.display = 'block';

    // 设置图表的尺寸和边距
    var margin = { top: 20, right: 20, bottom: 40, left: 50 },
        width = 800 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // 设置 X 和 Y 轴的尺度
    var x = d3.scaleTime().range([0, width]),
        y = d3.scaleLinear().range([height, 0]);

    var line = d3.line()
        .x(function (d) { return x(d.Year); })
        .y(function (d) { return y(d.Lowess); });

    // 在 #climate-chart 容器中添加 SVG 元素
    var svg = d3.select("#climate-chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // 格式化数据，将 Year 转换为 JavaScript 日期对象
    var parseTime = d3.timeParse("%Y");
    data.forEach(function (d) {
        d.Year = parseTime(d.Year); // 直接解析字符串日期
        d.Lowess = +d.Lowess;
        d.No_Smoothing = +d.No_Smoothing;

    });

    // 设置 X 和 Y 轴的域
    x.domain(d3.extent(data, function (d) { return d.Year; }));
    y.domain([
        d3.min(data, function (d) { return Math.min(d.Lowess, d.No_Smoothing); }),
        d3.max(data, function (d) { return Math.max(d.Lowess, d.No_Smoothing); })
    ]);
    // 添加 X 轴
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // 添加 Y 轴
    svg.append("g")
        .call(d3.axisLeft(y));

    // 添加线条
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", line)
        .style("fill", "none") // 确保没有填充
        .style("opacity", 1)
        .style("stroke", "black") // 设置线条的颜色
        .style("stroke-width", "2px"); // 设置线条的宽度
    
    // 定义 No_Smoothing 折线
    var noSmoothingLine = d3.line()
        .x(function (d) { return x(d.Year); })
        .y(function (d) { return y(d.No_Smoothing); });

    // 添加 No_Smoothing 折线
    svg.append("path")
        .data([data])
        .attr("class", "line no-smoothing-line") // 使用不同的类以便样式定制
        .attr("d", noSmoothingLine)
        .style("fill", "none")
        .style("stroke", "grey") // 设置 No_Smoothing 折线的颜色
        .style("stroke-width", "2px");
    
    // 添加 No_Smoothing 散点图
    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle") // 创建新的圆形元素
        .attr("class", "dot") // 可以用来定义样式的类
        .attr("cx", function (d) { return x(d.Year); })
        .attr("cy", function (d) { return y(d.No_Smoothing); })
        .attr("r", 3) // 圆点的半径
        // .style("fill", "white") // 填充颜色
        // .style("stroke", "black"); // 边框颜色
    
    // 添加 X 轴标签
    svg.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text("Year");

    // 添加 Y 轴标签
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Temperature Anomaly (°C)");

    
    // 添加图例
    var legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(" + (10) + "," + 20 + ")");

    // 添加 Lowess Smoothing 图例项
    legend.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 20)
        .attr("y2", 0)
        .style("stroke", "black") // 应该与 Lowess 折线的颜色相匹配
        .style("stroke-width", "2px")
        .style("opacity", 0.5);

    legend.append("text")
        .attr("x", 30)
        .attr("y", 5)
        .text("Lowess smoothing")
        .style("font-size", "12px")
        .attr("alignment-baseline", "middle");

    // 添加 Annual Mean 图例项
    legend.append("circle")
        .attr("cx", 10)
        .attr("cy", 20)
        .attr("r", 3.5)
        .attr("class", "dot") // 可以用来定义样式的类

    legend.append("text")
        .attr("x", 30)
        .attr("y", 25)
        .text("Annual mean")
        .style("font-size", "12px")
        .attr("alignment-baseline", "middle");
    
    // 定义网格线生成器
    function make_x_gridlines() {
        return d3.axisBottom(x)
            .ticks(10);
    }

    function make_y_gridlines() {
        return d3.axisLeft(y)
            .ticks(10);
    }

    // 添加网格线到 X 轴
    svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(make_x_gridlines()
            .tickSize(-height)
            .tickFormat("")
        )

    // 添加网格线到 Y 轴
    svg.append("g")
        .attr("class", "grid")
        .call(make_y_gridlines()
            .tickSize(-width)
            .tickFormat("")
        )

}
