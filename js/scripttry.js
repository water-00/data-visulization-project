export function linechart(data) {
  //边距方面的定义
  var margin = { top: 50, right: 20, bottom: 185, left: 50 },
    margin2 = { top: 250, right: 20, bottom: 0, left: 50 },
    width = 864 - margin.left - margin.right,
    height = 433 - margin.top - margin.bottom,
    height2 = 413 - margin2.top - margin2.bottom;//第三个图
  //日期的处理和格式化 
  var parseDate = d3.timeParse('%Y-%m-%d'), // 字符串->日期
    bisectDate = d3.bisector(function (d) { return d.date; }).left,
    legendFormat = d3.timeFormat('%b %d, %Y'); // 日期->字符串

  data = data.map(function (d) {
    var temperature = +d.AverageTemperature;
    if (isNaN(temperature)) {
      // 如果 AverageTemperature 无法转换为数字，则设置默认值
      temperature = 0;
    }

    return {
      date: parseDate(d.dt),  // 假设日期字段为 "dt"
      price: temperature,      // 这里使用上面计算的 temperature
      average: temperature    // 假设平均值字段也使用 temperature
    };
  });

  var selection;

  //比例尺的定义
  var x = d3.scaleTime().range([0, width]), // 时间比例尺 主图表
    x2 = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    y1 = d3.scaleLinear().range([height, 0]),
    y2 = d3.scaleLinear().range([height2, 0]),
    y3 = d3.scaleLinear().range([60, 0]); // 柱形图的高度
  //坐标轴的定义 xaxis是主图表的x轴 yaxis是主图表的y轴
  var xAxis = d3.axisBottom().scale(x),
    xAxis2 = d3.axisBottom().scale(x2),
    yAxis = d3.axisLeft().scale(y);
  //折线线条绘制
  var temperatureLine = d3
    .line()
    .curve(d3.curveMonotoneX)
    .x(function (d) { return x(d.date); })
    .y(function (d) { return y(d.price); });
  //平均线条的绘制
  // var avgLine = d3.svg.line()
  //   .interpolate('monotone')
  //   .x(function(d) { return x(d.date); })
  //   .y(function(d) { return y(d.average); });
  //area2是用于绘制下方上下文图表的区域图的D3面积生成器


  var area2 = d3.area()
    .x(function (d) { return x2(d.date); })
    .y0(height2)
    .y1(function (d) { return y2(d.price); })
    .curve(d3.curveMonotoneX);

  var svg = d3.select('#line-chart-container').append('svg')
    .attr('class', 'chart')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

  //一个用于裁剪的clipPath，这通常用于确保图表元素只在指定区域内显示。
  svg.append('defs').append('clipPath')
    .attr('id', 'clip')
    .append('rect')
    .attr('width', width)
    .attr('height', height);

  //添加y轴辅助线的生成器
  var make_y_axis = function () {
    return d3.axisLeft(y)
      .ticks(13);
  };
  var focus = svg.append('g')
    .attr('class', 'focus')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  //面积图
  var context = svg.append('g')
    .attr('class', 'context')
    .attr('transform', 'translate(' + margin2.left + ',' + (margin2.top + 60) + ')');

  //用于组织图例的元素
  var legend = svg.append('g')
    .attr('class', 'chart__legend')
    .attr('width', width)
    .attr('height', 30)
    .attr('transform', 'translate(' + margin2.left + ', 10)');
  //向图例中添加文本
  legend.append('text')
    .attr('class', 'chart__symbol')
    .text('Temperature in Decades')
    .style('font-size', '14px')
    .attr('transform', 'translate(' + -50 + ', 12)')
  //时间范围选择器
  var rangeSelection = legend
    .append('g')
    .attr('class', 'chart__range-selection')
    .attr('transform', 'translate(160, 0)');//右上角时间段选择的位置



  //加载数据文件
  function interact(data) {
    var brush = d3.brush()
      .extent([[0, 0], [width, height2]])
      .on('brush', brushed);
    // 将 brush 应用于特定的 x 比例尺（假设为 x2）
    d3.select('svg').call(brush);

    //计算交互的数据x轴的范围
    if (data) {
      var xRange = d3.extent(data.map(function (d) { return d.date; }));

      x.domain(xRange);
      y.domain(d3.extent(data.map(function (d) { return d.price; })));
      y3.domain(d3.extent(data.map(function (d) { return d.price; })));
      x2.domain(x.domain());
      y2.domain(y.domain());

      var min = d3.min(data.map(function (d) { return d.price; }));
      var max = d3.max(data.map(function (d) { return d.price; }));
    }
    else { console.error("Data is undefined or not an array."); }
    //时间范围文本
    var range = legend.append('text')
      .text(legendFormat(new Date(xRange[0])) + ' - ' + legendFormat(new Date(xRange[1])))
      .style('text-anchor', 'end')
      .attr('transform', 'translate(' + width + ', 12)')
      .style('font-size', '14px');
    //在主图表 (focus) 中附加一个<g>元素，用于容纳y轴的网格线。
    focus.append('g')
      .attr('class', 'y chart__grid')
      .call(make_y_axis()
        .tickSize(-width, 0, 0)
        .tickFormat(''));

    //平均线图的路径元素
    // var averageChart = focus.append('path')
    //     .datum(data)
    //     .attr('class', 'chart__line chart__average--focus line')
    //     .attr('d', avgLine);

    //为价格线创建一个路径元素
    var temperatureChart = focus.append('path')
      .datum(data)
      .attr('class', 'chart__line chart__price--focus line')
      .attr('d', temperatureLine);

    //确定x、y轴位置，并绘制
    focus.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0 ,' + height + ')')
      .call(xAxis)
      .append('text')
      .attr('class', 'x axis-label')
      .attr('x', width / 2) // 将文本放置在x轴中间位置
      .attr('y', margin.bottom * 0.2) // 根据需要调整文本的垂直位置
      .style('text-anchor', 'middle')
      .text('year')
      .style('font-size', '14px')
      ;

    focus.append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(1, 0)')//y轴刻度线位置
      .call(yAxis)
      .append('text')
      .attr('class', 'y axis-label')
      .attr('transform', 'rotate(-90)') // 旋转文本以适应y轴
      .attr('x', -height / 2) // 将文本放置在y轴中间位置
      .attr('y', -margin.left * 0.42) // 根据需要调整文本的垂直位置
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('Temperature(℃)');

    // 创建一个辅助组，用于容纳一些文本元素，可能用于显示与图表交互相关的信息。
    var helper = focus.append('g')
      .attr('class', 'chart__helper')
      .style('text-anchor', 'end')
      .attr('transform', 'translate(' + width + ', 0)');

    var helperText = helper.append('text')

    //在折线图中添加圆圈元素
    var priceTooltip = focus.append('g')
      .attr('class', 'chart__tooltip--price')
      .append('circle')
      .style('display', 'none')
      .attr('r', 2.5);

    var averageTooltip = focus.append('g')
      .attr('class', 'chart__tooltip--average')
      .append('circle')
      .style('display', 'none')
      .attr('r', 2.5);

    //当鼠标移动时触发的事件处理
    var mouseArea = svg.append('g')
      .attr('class', 'chart__mouse')
      .append('rect')
      .attr('class', 'chart__overlay')
      .attr('width', width)
      .attr('height', height)
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .on('mouseover', function () {
        helper.style('display', null);
        priceTooltip.style('display', null);
        // averageTooltip.style('display', null);
      })
      .on('mouseout', mouseout)
      .on('mousemove', mousemove);

    //为上下文图表（context chart）添加元素和设置属性
    context.append('path')
      .datum(data)
      .attr('class', 'chart__area area')
      .attr('d', area2);

    context.append('g')
      .attr('class', 'x axis chart__axis--context')
      .attr('y', 0)
      .attr('transform', 'translate(0,' + (height2 - 22) + ')')
      .call(xAxis2);

    context.append('g')
      .attr('class', 'x brush')
      .call(brush)
      .selectAll('rect')
      .attr('y', -6)
      .attr('height', height2 + 7);

    var tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    // 修改mousemove函数
    function mousemove(event) {
      var x0 = x.invert(d3.pointer(event, this)[0]);
      var i = bisectDate(data, x0, 1);
      var d0 = data[i - 1];
      var d1 = data[i];
      var d = x0 - d0.date > d1.date - x0 ? d1 : d0;
      var tooltipContent = legendFormat(new Date(d.date)) + ' - Temperature: ' + d.price.toFixed(3) + "℃";
      priceTooltip.attr('transform', 'translate(' + x(d.date) + ',' + y(d.price) + ')');
      // 更新浮动文本框的位置和内容
      tooltip.transition()
        .duration(200)
        .style('opacity', 0.9);

      tooltip.html(tooltipContent)
        .style('left', (event.pageX) + 'px')
        .style('top', (event.pageY - 28) + 'px');
    }

    function mouseout() {
      helper.style('display', 'none');
      priceTooltip.style('display', 'none');
      // averageTooltip.style('display', 'none');
      tooltip.transition()
        .duration(200)
        .style('opacity', 0);
    }

    function brushed(event) {
      // 使用 d3.brushSelection 获取当前的刷选范围
      if (!selection || selection[1][0] != 794) {
        selection = d3.brushSelection(this) || null;
      }
      if (selection && !selection[0].includes(NaN)) {

        // 提取水平方向的像素值范围
        var pixelRange = selection.map(s => s[0]);
        x.domain(pixelRange.map(x2.invert, x2)); // 使用 invert 函数将像素位置转换回数据值
        y.domain([
          d3.min(data, function (d) { return (d.date >= x.domain()[0] && d.date <= x.domain()[1]) ? d.price : max; }),
          d3.max(data, function (d) { return (d.date >= x.domain()[0] && d.date <= x.domain()[1]) ? d.price : min; })
        ]);

        range.text(legendFormat(x.domain()[0]) + ' - ' + legendFormat(x.domain()[1]));

        // 更新图表
        temperatureChart.attr('d', temperatureLine);
        focus.select('.x.axis').call(xAxis);
        focus.select('.y.axis').call(yAxis);
      }
      else {
        // 说明是reset，恢复日期范围到初始状态
        x.domain(d3.extent(data, function (d) { return d.date; }));
        y.domain([d3.min(data, function (d) { return d.price; }), d3.max(data, function (d) { return d.price; })]);
        range.text(legendFormat(x.domain()[0]) + ' - ' + legendFormat(x.domain()[1]));
      }
    }

    var resetButton = d3.select('body')
      .append('button')
      .attr('id', 'resetButton')
      .text('reset')
      .on('click', resetBrush);

    resetButton.style('position', 'absolute')
      .style('top', '530px')  // 设置按钮距离顶部的位置
      .style('left','925px')  // 设置按钮距离左侧的位置
      .style('padding', '5px')  // 设置按钮内边距
      .style('font-size', '15px')  // 设置字体大小
      .style('background-color', '#7f8faf')  // 设置背景颜色
      .style('color', '#000000') // 设置文字颜色
      .style('border-radius', '5px');

    var closeButton = d3.select('body')
      .append('button')
      .attr('id', 'closeButton')
      .text('close')
      .on('click', closeChart);

    closeButton.style('position', 'absolute')
      .style('top', '530px')  // 设置按钮距离顶部的位置
      .style('left', '980px')  // 设置按钮距离左侧的位置
      .style('padding', '5px')  // 设置按钮内边距
      .style('font-size', '15px')  // 设置字体大小
      .style('background-color', '#7f8faf')  // 设置背景颜色
      .style('color', '#000000') // 设置文字颜色
      .style('border-radius', '5px');

    function resetBrush() {
      // 恢复日期范围到初始状态
      x.domain(d3.extent(data, function (d) { return d.date; }));
      y.domain([d3.min(data, function (d) { return d.price; }), d3.max(data, function (d) { return d.price; })]);

      // 更新图表
      temperatureChart.attr('d', temperatureLine);
      focus.select('.x.axis').call(xAxis);
      focus.select('.y.axis').call(yAxis);

      // 清空 brush 的选区
      context.select('.brush').call(brush.move, null);
    }

    function closeChart() {
      d3.selectAll('#resetButton').remove();
      d3.selectAll('#closeButton').remove();
      d3.selectAll('#line-chart-container').selectAll('*').remove();
      // d3.selectAll('#line-chart-container').html('');
      // d3.selectAll('#line-chart-container').style('border', 'none');
      // d3.selectAll('#line-chart-container').style('height', '0px').style('padding', '0px');
      
      var chartContainer = document.getElementById('line-chart-container');
      chartContainer.style.display = 'none';
    }

    //创建不同范围的按钮列表
    var dateRange = ['6m', '1y', '5y', '10y', '50y']
    //使用循环遍历时间范围数组。获取当前循环迭代中的时间范围
    for (var i = 0, l = dateRange.length; i < l; i++) {
      var v = dateRange[i];
      rangeSelection
        .append('text')
        .attr('class', 'chart__range-selection')
        .text(v)
        .style('font-size', '12px')
        .attr('transform', 'translate(' + (35 * i) + ', 10)')
        .on('click', function (d) { focusOnRange(this.textContent); });
    }

    //对于选取的时间的反应
    function focusOnRange(range) {
      var today = new Date(data[data.length - 1].date);
      var ext = new Date(data[data.length - 1].date);

      // 根据所选的范围计算新的刷选区域的开始日期
      switch (range) {
        case '6m':
          ext.setMonth(ext.getMonth() - 6);
          break;
        case '1y':
          ext.setFullYear(ext.getFullYear() - 1);
          break;
        case '5y':
          ext.setFullYear(ext.getFullYear() - 5);
          break;
        case '10y':
          ext.setFullYear(ext.getFullYear() - 10);
          break;
        case '50y':
          ext.setFullYear(ext.getFullYear() - 50);
          break;
        default:
          break;
      }

      var brushExtent = [x2(ext), x2(today)];
      selection = [[x2(ext), 0], [x2(today), 140]]
      
      // 使用 brush.move 来更新刷选区域
      context.select('.brush').call(brush.move, brushExtent);
      selection = [[0, 0], [0, 0]]
    }
  }

  interact(data);
  return linechart;

}//export default linechart;
