/* global d3, _ */

(function() {
  //边距方面的定义
  var margin = {top: 30, right: 20, bottom: 100, left: 50},
    margin2  = {top: 210, right: 20, bottom: 20, left: 50},
    width    = 764 - margin.left - margin.right,
    height   = 283 - margin.top - margin.bottom,
    height2  = 283 - margin2.top - margin2.bottom;
//日期的处理和格式化
  var parseDate = d3.time.format('%Y-%m-%d').parse,
    bisectDate = d3.bisector(function(d) { return d.date; }).left,
    legendFormat = d3.time.format('%b %d, %Y');
//比例尺的定义
  var x = d3.time.scale().range([0, width]),//时间比例尺 主图表
    x2  = d3.time.scale().range([0, width]),
    y   = d3.scale.linear().range([height, 0])
   y1  = d3.scale.linear().range([height, 0]),
    y2  = d3.scale.linear().range([height2, 0]),
    y3  = d3.scale.linear().range([60, 0]);
//坐标轴的定义 xaxis是主图表的x轴 yaxis是主图表的y轴
  var xAxis = d3.svg.axis().scale(x).orient('bottom'),
    xAxis2  = d3.svg.axis().scale(x2).orient('bottom'),
    yAxis   = d3.svg.axis().scale(y).orient('left');
//折线线条绘制
  var priceLine = d3.svg.line()
    .interpolate('monotone')
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.price); });
//平均线条的绘制
  var avgLine = d3.svg.line()
    .interpolate('monotone')
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.average); });
//area2是用于绘制下方上下文图表的区域图的D3面积生成器
  var area2 = d3.svg.area()
    .interpolate('monotone')
    .x(function(d) { return x2(d.date); })
    .y0(height2)
    .y1(function(d) { return y2(d.price); });

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
  var make_y_axis = function () {
    return d3.svg.axis()
      .scale(y)
      .orient('left')
      .ticks(3);
  };

  var focus = svg.append('g')
    .attr('class', 'focus')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    //条状图
  var barsGroup = svg.append('g')
    .attr('class', 'volume')
    .attr('clip-path', 'url(#clip)')
    .attr('transform', 'translate(' + margin.left + ',' + (margin.top + 60 + 20) + ')');
//组织下方上下文图表的元素
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

    //时间范围选择器
  var rangeSelection =  legend
    .append('g')
    .attr('class', 'chart__range-selection')
    .attr('transform', 'translate(150, 0)');
//加载数据文件
  d3.csv('./data/try.csv', type, function(err, data) {
   
  
  // 初始化brush对象
   var brush = d3.svg.brush()
      .x(x2)  
      .extent([[0, 0], [width, height2]])
      .on('brush', brushed);
     // .on('wheel', wheelZoom);
 
    //  var wheel = d3.svg.wheel()
    //   .x(x2)  
    //   .extent([[0, 0], [width, height2]])
    //   .on('wheel', wheelZoom);

     d3.select('svg')
     .on('wheel', wheelZoom);
 //svg.on('wheel', wheelZoom)
//计算交互的数据x轴的范围
// const brush = d3.brushX() 
// .extent([[0, 0], [width, height2]])
//   .on('brush', brushed);
  //.on('wheel', wheelZoom);  



    var xRange = d3.extent(data.map(function(d) { return d.date; }));

    x.domain(xRange);
    y.domain(d3.extent(data.map(function(d) { return d.price; })));
    y3.domain(d3.extent(data.map(function(d) { return d.price; })));
    x2.domain(x.domain());
    y2.domain(y.domain());

    var min = d3.min(data.map(function(d) { return d.price; }));
    var max = d3.max(data.map(function(d) { return d.price; }));
//时间范围文本
    var range = legend.append('text')
      .text(legendFormat(new Date(xRange[0])) + ' - ' + legendFormat(new Date(xRange[1])))
      .style('text-anchor', 'end')
      .attr('transform', 'translate(' + width + ', 0)');

      //在主图表 (focus) 中附加一个<g>元素，用于容纳y轴的网格线。
    focus.append('g')
        .attr('class', 'y chart__grid')
        .call(make_y_axis()
        .tickSize(-width, 0, 0)
        .tickFormat(''));

        //平均线图的路径元素
    var averageChart = focus.append('path')
        .datum(data)
        .attr('class', 'chart__line chart__average--focus line')
        .attr('d', avgLine);

        //为价格线创建一个路径元素
    var priceChart = focus.append('path')
        .datum(data)
        .attr('class', 'chart__line chart__price--focus line')
        .attr('d', priceLine);

        //确定x、y轴位置，并绘制
    focus.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0 ,' + height + ')')
        .call(xAxis);

    focus.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(12, 0)')
        .call(yAxis);
//绘制柱状图
    var focusGraph = barsGroup.selectAll('rect')
        .data(data)
      .enter().append('rect')
        .attr('class', 'chart__bars')
        .attr('x', function(d, i) { return x(d.date); })
        .attr('y', function(d) { return 155 - y3(d.price); })
        .attr('width', 1)
        .attr('height', function(d) { return y3(d.price); });

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
        averageTooltip.style('display', null);
      })
      .on('mouseout', function() {
        helper.style('display', 'none');
        priceTooltip.style('display', 'none');
        averageTooltip.style('display', 'none');
      })
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
    function mousemove() {
      var x0 = x.invert(d3.mouse(this)[0]);
      var i = bisectDate(data, x0, 1);
      var d0 = data[i - 1];
      var d1 = data[i];
      var d = x0 - d0.date > d1.date - x0 ? d1 : d0;
      helperText.text(legendFormat(new Date(d.date)) + ' - price: ' + d.price + ' Avg: ' + d.average);
      priceTooltip.attr('transform', 'translate(' + x(d.date) + ',' + y(d.price) + ')');
      averageTooltip.attr('transform', 'translate(' + x(d.date) + ',' + y(d.average) + ')');
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



  //   function wheelZoom() {
  //     var event = d3.event;
      
  //     // 阻止浏览器默认的滚轮事件
  //     event.preventDefault();
  
  //     // 获取当前的放缩比例
  //     var scale = event.deltaY > 0 ? 1.2 : 0.8;
  
  //     // 获取当前的x轴范围
  //     var xDomain = x.domain();
  
  //     // 计算新的x轴范围
  //     var newDomain = xDomain.map(function(d) {
  //         return new Date(d.getTime() * scale);
  //     });
  
  //     // 更新x轴的域（范围）
  //     x.domain(newDomain);
  
  //     // 更新主图表中的价格折线和柱状图的位置和宽度
  //     priceChart.attr('d', priceLine);
  //     focusGraph.attr('x', function(d, i) { return x(d.date); });
  
  //     // 更新x轴
  //     focus.select('.x.axis').call(xAxis);
  // }

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
       range.text(legendFormat(new Date(ext[0])) + ' - ' + legendFormat(new Date(ext[1])))//根据缩放，更新右上角的方位

       focusGraph.attr('x', function(d, i) { return x(d.date); });//缩放柱状图

        var days = Math.ceil((ext[1] - ext[0]) / (24 * 3600 * 1000))//设置缩放后柱状图柱形宽度
       focusGraph.attr('width', (40 > days) ? (40 - days) * 5 / 6 : 5)
      // }
      // else if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'wheel')
      //  {
      //   // 鼠标滚轮放缩的操作
      //   wheelZoom();
      // }
    }
      priceChart.attr('d', priceLine);//缩放priceline
      averageChart.attr('d', avgLine);//缩放avgline
      focus.select('.x.axis').call(xAxis);//缩放x轴坐标
      focus.select('.y.axis').call(yAxis);//缩放y轴坐标
    }
    //svg.on('wheel', zoomed);
 
    

 
 
  //   function wheelZoom() {
  //     var event = d3.event;
  //     // 阻止浏览器默认的滚轮事件
  //     event.preventDefault();
  //      const ext1 = brush.extent();  // 获取当前 brush 的范围
  //     // 获取当前的放缩比例
  //     var scale = event.deltaY > 0 ? 1.2 : 0.8;
  //     // 获取当前的x轴范围
  //     var xDomain = x.domain(brush.empty() ? x2.domain() : brush.extent());

  //     brush.move(d3.select('.brush').transition().duration(500), newExtent);

      
  //     const newExtent = ext1.map(d => new Date(d.getTime() * scale));
  //     // 计算新的x轴范围
  //     // var newDomain = xDomain.map(function(d) 
  //     // {
  //     //     return new Date(d.getTime() * scale);
  //     // });
  //     // // 更新x轴的域（范围）
  //     // x.domain(newDomain);
  //     // 更新主图表中的价格折线和柱状图的位置和宽度
  //     priceChart.attr('d', priceLine);//折线图
  //     focusGraph.attr('x', function(d, i) { return x(d.date); });//柱形图
  
  //     // 更新x轴
  //     focus.select('.x.axis').call(xAxis);
  // }
 

  // var resetButton = legend.append('text')
  // .attr('class', 'chart__reset-button')
  // .text('Reset')
  // .style('text-anchor', 'end')
 d3.select('body')
  .append('button')
  .attr('id', 'resetButton')
  .text('重置')
   .attr('transform', 'translate(' + (width - 150) + ', 0)')
  .on('click', resetBrush);
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
        .attr('transform', 'translate(' + (25 * i) + ', 0)')
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

  })// end Data
//数据处理部分
  function type(d) {
    return {
      date    : parseDate(d.Date),
      price   : +d.Average,
      average : +d.Average,
      volume : +d.Volume,
    }
  }
}());