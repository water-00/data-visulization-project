/* global d3, _ */
export function linechart(data) {
//  console.log(data);
  //边距方面的定义
  var margin = {top: 50, right: 20, bottom: 100, left: 50},
    margin2  = {top: 230, right: 20, bottom: 20, left: 50},
    width    = 864 - margin.left - margin.right,
    height   = 333 - margin.top - margin.bottom,
    height2  = 313 - margin2.top - margin2.bottom;//第三个图
  //日期的处理和格式化 
  var parseDate = d3.timeParse('%Y-%m-%d'),
        bisectDate = d3.bisector(function(d) { return d.date; }).left,
        legendFormat = d3.timeParse('%b %d, %Y');

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

  console.log(data);


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
.x(function (d) { return x(d.date);})
.y(function (d) {return y(d.price);});
//平均线条的绘制
  // var avgLine = d3.svg.line()
  //   .interpolate('monotone')
  //   .x(function(d) { return x(d.date); })
  //   .y(function(d) { return y(d.average); });
//area2是用于绘制下方上下文图表的区域图的D3面积生成器

  // var area2 = d3.svg.area()
  //   .interpolate('monotone')
  //   .x(function(d) { return x2(d.date); })
  //   .y0(height2)
  //   .y1(function(d) { return y2(d.price); });
  var area2 = d3.area()
  .x(function(d) { return x2(d.date); })
  .y0(height2)
  .y1(function(d) { return y2(d.price); })
  .curve(d3.curveMonotoneX); 

  var svg = d3.select('body').append('svg')
    .attr('class', 'chart')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom + 60);

    //一个用于裁剪的clipPath，这通常用于确保图表元素只在指定区域内显示。
  svg.append('defs').append('clipPath')
    .attr('id', 'clip')
  .append('rect')
    .attr('width', width)
    .attr('height', height);

    //添加y轴辅助线的生成器
  // var make_y_axis = function () {
  //   return d3.svg.axis()
  //     .scale(y)
  //     .orient('left')
  //     .ticks(13);
  // };
  var make_y_axis = function () {
    return d3.axisLeft(y)
      .ticks(13);
};
  var focus = svg.append('g')
    .attr('class', 'focus')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    //条状图
  var barsGroup = svg.append('g')
    .attr('class', 'volume')
    .attr('clip-path', 'url(#clip)')
    .attr('transform', 'translate(' + margin.left + ',' + (margin.top + 60 + 20) + ')');
//(面积图)
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
    .text('TEMPORATURE IN DECADES')
   .style('font-size', '14px')
   .attr('transform', 'translate(' + -50  + ', 12)')
    //时间范围选择器
  var rangeSelection =  legend
    .append('g')
    .attr('class', 'chart__range-selection')
    .attr('transform', 'translate(160, 0)');//右上角时间段xuanz的位置



    //加载数据文件
 // function aaa(err, data) {
   
 function aaa(data) {
  // 初始化brush对象
  //  var brush = d3.svg.brush()
  //     .x(x2)  
  //     .extent([[0, 0], [width, height2]])
  //     .on('brush', brushed);
  var brush = d3.brush()
  .extent([[0, 0], [width, height2]])
  .on('brush', brushed);
// 将 brush 应用于特定的 x 比例尺（假设为 x2）
brush.extent([[0, 0], [width, height2]]).on('brush', brushed);
// 相应地，调整你的代码来选取 SVG 并应用 brush
d3.select('svg').call(brush);


//  d3.select('svg')
    //  .on('wheel', wheelZoom);
//计算交互的数据x轴的范围
//console.log(data);
if(data){
    var xRange = d3.extent(data.map(function(d) { return d.date; }));

    x.domain(xRange);
    y.domain(d3.extent(data.map(function(d) { return d.price; })));
    y3.domain(d3.extent(data.map(function(d) { return d.price; })));
    x2.domain(x.domain());
    y2.domain(y.domain());

    var min = d3.min(data.map(function(d) { return d.price; }));
    var max = d3.max(data.map(function(d) { return d.price; }));}
    else{ console.error("Data is undefined or not an array.");}
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
        .attr('y', margin.bottom * 0.3) // 根据需要调整文本的垂直位置
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
    .attr('y', -margin.left * 0.3) // 根据需要调整文本的垂直位置
    .style('text-anchor', 'middle')
    .style('font-size', '14px')
    .text('Temperature(℃)');
//绘制柱状图
    // var focusGraph = barsGroup.selectAll('rect')
    //     .data(data)
    //   .enter().append('rect')
    //     .attr('class', 'chart__bars')
    //     .attr('x', function(d, i) { return x(d.date); })
    //     .attr('y', function(d) { return 155 - y3(d.price); })
    //     .attr('width', 1)
    //     .attr('height', function(d) { return y3(d.price); });

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
      .on('mouseover', function() {
        helper.style('display', null);
        priceTooltip.style('display', null);
       // averageTooltip.style('display', null);
      })
      .on('mouseout', mouseout) 
      // {
      //   helper.style('display', 'none');
      //   priceTooltip.style('display', 'none');
      //   averageTooltip.style('display', 'none');
      // })
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

        //鼠标移动触发函数
    // function mousemove() {
    //   var x0 = x.invert(d3.mouse(this)[0]);
    //   var i = bisectDate(data, x0, 1);
    //   var d0 = data[i - 1];
    //   var d1 = data[i];
    //   var d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    //   helperText.text(legendFormat(new Date(d.date)) + ' - Temperature: ' + d.price )
    //   .style('font-size', '14px');
    //   priceTooltip.attr('transform', 'translate(' + x(d.date) + ',' + y(d.price) + ')');
    //   //averageTooltip.attr('transform', 'translate(' + x(d.date) + ',' + y(d.average) + ')');
    // }
    var tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);
  
  // 修改mousemove函数
  function mousemove() {
    var x0 = x.invert(d3.mouse(this)[0]);
    var i = bisectDate(data, x0, 1);
    var d0 = data[i - 1];
    var d1 = data[i];
    var d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    var tooltipContent = legendFormat(new Date(d.date)) + ' - Temperature: ' + d.price;
    priceTooltip.attr('transform', 'translate(' + x(d.date) + ',' + y(d.price) + ')');
    // 更新浮动文本框的位置和内容
    tooltip.transition()
      .duration(200)
      .style('opacity', 0.9);
    
    tooltip.html(tooltipContent)
      .style('left', (d3.event.pageX) + 'px')
      .style('top', (d3.event.pageY - 28) + 'px');
  }
  function mouseout() {
    helper.style('display', 'none');
     priceTooltip.style('display', 'none');
     // averageTooltip.style('display', 'none');
    tooltip.transition()
      .duration(200)
      .style('opacity', 0);
  }
    function wheelZoom() {
      if (!d3.event.sourceEvent) return;  // 避免重复触发
      if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'mousemove') 
      {
      const delta = d3.event.sourceEvent.deltaY;  // 获取鼠标滚轮的滚动距离
      const ext = brush.extent();  // 获取当前 brush 的范围
      // 根据鼠标滚轮的方向调整 brush 的范围
      const factor = delta > 0 ? 1.2 : 0.8;
      const newExtent = ext.map(d => new Date(d.getTime() * factor));
      // 调用 brush.move 更新 brush 的范围
     brush.move(d3.select('.brush').transition().duration(500), newExtent);
    }
    }



    //筛选器的函数
    function brushed() {
      var ext = brush.extent();
 
      if (!brush.empty()) {
        //if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'mousemove') {
        //设置x轴
        x.domain(brush.empty() ? x2.domain() : brush.extent());//设置第一个图中显示的x图像
        //设置y
        y.domain([
          d3.min(data.map(function(d) { return (d.date >= ext[0] && d.date <= ext[1]) ? d.price : max; })),
          d3.max(data.map(function(d) { return (d.date >= ext[0] && d.date <= ext[1]) ? d.price : min; }))
        ]);
       range.text(legendFormat(new Date(ext[0])) + ' - ' + legendFormat(new Date(ext[1])))
       //根据缩放，更新右上角的方位

       //focusGraph.attr('x', function(d, i) { return x(d.date); });//缩放柱状图

        //var days = Math.ceil((ext[1] - ext[0]) / (24 * 3600 * 1000))//设置缩放后柱状图柱形宽度
      // focusGraph.attr('width', (40 > days) ? (40 - days) * 5 / 6 : 5)
      // }
      // else if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'wheel')
      //  {
      //   // 鼠标滚轮放缩的操作
      //   wheelZoom();
      // }
    }
      temperatureChart.attr('d', temperatureLine);//缩放temperatureLine
     // averageChart.attr('d', avgLine);//缩放avgline
      focus.select('.x.axis').call(xAxis);//缩放x轴坐标
      focus.select('.y.axis').call(yAxis);//缩放y轴坐标
    }

    var resetButton =d3.select('body')
  .append('button')
  .attr('id', 'resetButton')
  .text('reset')
  .on('click', resetBrush);

  resetButton.style('position', 'absolute')
  .style('top', '290px')  // 设置按钮距离顶部的位置
  .style('left', (width - 150) + '23')  // 设置按钮距离左侧的位置
  .style('padding', '5px')  // 设置按钮内边距
  .style('font-size', '15px')  // 设置字体大小
  .style('background-color', '#7f8faf')  // 设置背景颜色
  .style('color', '#000000') // 设置文字颜色
  .style('border-radius', '5px'); 
 
  function resetBrush() 
  {
    // 恢复日期范围到初始状态
    var xRange = d3.extent(data.map(function(d) { return d.date; }));
    brush.extent(xRange);
    
    // 调用 brush 更新日期范围
    brushed();
    
    // 清空 brush 的选区
    context.select('g.x.brush').call(brush.clear());
  }
 
    //创建不同范围的按钮列表
    var dateRange = [ '6m', '1y', '5y','10y','50y']
    //使用循环遍历时间范围数组。获取当前循环迭代中的时间范围
    for (var i = 0, l = dateRange.length; i < l; i ++) {
      var v = dateRange[i];
      rangeSelection
        .append('text')
        .attr('class', 'chart__range-selection')
        .text(v)
        .style('font-size', '12px')
        .attr('transform', 'translate(' + (35 * i) + ', 10)')
        .on('click', function(d) { focusOnRange(this.textContent); });
    }

    //对于选取的时间的反应
    function focusOnRange(range) {
      var today = new Date(data[data.length - 1].date)
      var ext = new Date(data[data.length - 1].date)
//console.log("today");
      // if (range === '1m')
      //   ext.setMonth(ext.getMonth() - 1)

      // if (range === '1w')
      //   ext.setDate(ext.getDate() - 7)

      // if (range === '3m')
      //   ext.setMonth(ext.getMonth() - 3)
   
      if (range === '6m')
        ext.setMonth(ext.getMonth() - 6)

      if (range === '1y')
        ext.setFullYear(ext.getFullYear() - 1)

      if (range === '5y')
        ext.setFullYear(ext.getFullYear() - 5)

        if (range === '10y')
        ext.setFullYear(ext.getFullYear() - 10)

        if (range === '50y')
        ext.setFullYear(ext.getFullYear() - 50)

     
      brush.extent([ext, today])
      brushed()
      context.select('g.x.brush').call(brush.extent([ext, today]))
  
    }

   // const brush1 = vl.selectInterval().encodings('x');
// //const x3 = vl.x().fieldT('date');
// //.title(null);
// const base = vl.markArea()
// .encode(xAxis, vl.y().fieldQ('price'))
// .width(700);
// return vl.data(sp500)
// .vconcat(
// base.encode(xAxis.scale({domain: brush1})),
// base.params(brush1).height(60)
// )
// .render();

  }// end Data
aaa(data);
 //此括号是err data的结束 
 return linechart;

}//export default linechart;
