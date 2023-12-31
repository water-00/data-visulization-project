export function sea_level(data) {
    var chartContainer = document.getElementById('climate-chart');
    chartContainer.style.display = 'block';

    // 设置图表的尺寸和边距
    var margin = { top: 20, right: 20, bottom: 40, left: 50 },
        width = 800 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // 设置 X 和 Y 轴的尺度
    var x = d3.scaleTime().range([0, width]),
        y = d3.scaleLinear().range([height, 0]);

    // 定义线条生成器，我们使用的是 year 和 mean
    var line = d3.line()
        .x(function (d) { return x(d.year); })
        .y(function (d) { return y(d.mean); });

    // 定义不确定性区域生成器
    var area = d3.area()
        .x(function (d) { return x(d.year); })
        .y0(function (d) { return y(d.mean - d.unc); }) // 不确定性下限
        .y1(function (d) { return y(d.mean + d.unc); }); // 不确定性上限

    
    // 在 #climate-chart 容器中添加 SVG 元素
    var svg = d3.select("#climate-chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // 格式化数据，将 year 转换为 JavaScript 日期对象
    var parseTime = d3.timeParse("%Y");
    data.forEach(function (d) {
        d.year = parseTime(d.year); // 直接解析字符串日期
        d.mean = +d.mean - 1644.85;
        d.unc = +d.unc * 5;
    });

    // 设置 X 和 Y 轴的域
    x.domain(d3.extent(data, function (d) { return d.year; }));
    y.domain(d3.extent(data, function (d) { return d.mean; }));

    // 添加 X 轴
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // 添加 Y 轴
    svg.append("g")
        .call(d3.axisLeft(y));

    // 添加不确定性区域（阴影）
    svg.append("path")
        .data([data])
        .attr("class", "area") // 可以在 CSS 中定义样式
        .attr("d", area)
        .style("fill", "lightblue") // 选择一个适当的填充颜色
        .style("opacity", 0.5); // 设置透明度以使线条可见
    
    // 添加线条
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", line)
        .style("fill", "none") // 确保没有填充
        .style("opacity", 1)
        .style("stroke", "black") // 设置线条的颜色
        .style("stroke-width", "2px"); // 设置线条的宽度

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
        .text("Million Square km");

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
