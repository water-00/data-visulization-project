let svg = d3.select('svg');
const width = +svg.attr('width');
const height = +svg.attr('height');
const margin = { top: 0, right: 0, bottom: 0, left: -800 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;
svg.attr('transform', `translate(${margin.left}, ${margin.top})`);
const g = svg.append('g').attr('id', 'maingroup')

const projection = d3.geoMercator(); // 墨卡托投影。
const pathGenerator = d3.geoPath().projection(projection);

let tempMap = {}; // 存储国家和平均温度的映射
let colorScale; // 用于根据温度设定颜色的比例尺

// setting up the tip tool; 
const tip = d3.tip()
    .attr('class', 'd3-tip')
    .html(function (event, d) {
        const countryName = d.properties.name;
        const avgTemp = tempMap[countryName];
        const tempDisplay = avgTemp ? (parseFloat(avgTemp).toFixed(1) + '°C') : 'No data';
        return `Country: ${countryName}<br>Temperature: ${tempDisplay}`;
    });
svg.call(tip);

let worldmeta;
// 读取国家温度数据
d3.csv('data/kaggle/processed/countries-avg-temperature.csv').then(function (tempData) {
    // 先获取温度数据的范围
    const temperatureExtent = d3.extent(tempData, d => +d.AverageTemperature);
    // 创建一个颜色比例尺
    colorScale = d3.scaleSequential(d3.interpolateRdYlBu).domain(temperatureExtent.reverse());

    // 用颜色比例尺为国家上色
    tempData.forEach(function (d) {
        tempMap[d.Country] = +d.AverageTemperature;
    });

    drawMap().then(drawLegend); // 确保先绘制地图，然后绘制图例
});

function drawMap() {
    // 读取国家边界数据
    return d3.json('data/countries-110m.json').then(function (geoData) {})
}


d3.json('data/countries-110m.json').then(function (geoData) {
    // convert topo-json to geo-json; 
    worldmeta = topojson.feature(geoData, geoData.objects.countries);

    // this code is really important if you want to fit your geoPaths (map) in your SVG element; 
    projection.fitSize([innerWidth, innerHeight], worldmeta);

    // perform data-join; 
    const paths = g.selectAll('path')
        .data(worldmeta.features, d => d.properties.name)
        .enter().append('path')
        .attr('d', pathGenerator)
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .attr('fill', d => {
            const avgTemp = tempMap[d.properties.name];
            return avgTemp ? colorScale(avgTemp) : '#ccc'; // 如果没有数据则使用灰色
        })
        .on('mouseover', function (event, d) {
            d3.select(this)
                .attr("opacity", 0.5)
                .attr("stroke", "white")
                .attr("stroke-width", 6);
            tip.show(event, d);
        })
        .on('mouseout', function (event, d) {
            d3.select(this)
                .attr("opacity", 1)
                .attr("stroke", "black")
                .attr("stroke-width", 1);
            tip.hide(event, d)
        })
        .on('contextmenu', function (event, d) {
            // 按下右键逻辑
            // event.preventDefault(); // 防止浏览器执行右键的默认行为
        })
        .on('click', function (event, d) {
            // 处理左键点击的逻辑
            console.log('Left click on', d.properties.name);
        });

});

function drawLegend() {
    const legendWidth = 300;
    const legendHeight = 20;
    const legendMargin = { top: 10, right: 60, bottom: 30, left: 60 };

    const legendSvg = d3.select('body').append('svg')
        .attr('width', legendWidth + legendMargin.left + legendMargin.right)
        .attr('height', legendHeight + legendMargin.top + legendMargin.bottom)
        .attr('style', 'position: absolute; bottom: 0; left: 0;')
        .append('g')
        .attr('transform', 'translate(' + legendMargin.left + ',' + legendMargin.top + ')');

    const legendScale = d3.scaleLinear()
        .domain(d3.extent(colorScale.domain()))
        .range([0, legendWidth]);

    legendSvg.append("defs")
        .append("linearGradient")
        .attr("id", "gradient")
        .selectAll("stop")
        .data(colorScale.ticks().map((t, i, n) => ({ offset: `${100 * i / n.length}%`, color: colorScale(t) })))
        .enter().append("stop")
        .attr("offset", d => d.offset)
        .attr("stop-color", d => d.color);

    legendSvg.append('rect')
        .attr('width', legendWidth)
        .attr('height', legendHeight)
        .style("fill", "url(#gradient)");

    const legendAxis = d3.axisBottom(legendScale)
        .ticks(5)
        .tickFormat(d => d3.format(".1f")(d) + '°C');

    legendSvg.append('g')
        .attr('transform', 'translate(0,' + legendHeight + ')')
        .call(legendAxis);
}



d3.csv('data/kaggle/processed/major-cities-info.csv').then(function (data) {
    const paths = g.selectAll('.city-point')
        .data(data)
        .enter().append('circle')
        .attr('class', 'city-point')
        .attr('cx', function (d) { return projection([d.Longitude, d.Latitude])[0]; })
        .attr('cy', function (d) { return projection([d.Longitude, d.Latitude])[1]; })
        .attr('r', 2) // 你可以调整圆圈的大小
        .attr('fill', 'red')
        .attr('stroke', 'black')
        .attr('stroke-width', 0.6)
        .attr('display', 'none')
        .on('mouseover', function (event, d) {
            // 处理鼠标悬停时的逻辑，例如显示城市站信息
            console.log('Mouseover on city:', d.City);
        })
        .on('mouseout', function () {
            // 处理鼠标移出时的逻辑，例如隐藏城市站信息
        });
});


let dragStartCoords = [0, 0];
let currentCoords = [margin.left, margin.top]; // 现在相对于程序刚开始时的偏移
let offset = [0, 0];

// 添加zoom
svg.call(d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", zoomed));

function zoomed(event) {
    const currentScale = event.transform.k;

    g.selectAll('.city-point')
        .attr('display', currentScale > 2 ? 'block' : 'none')

    g.attr("transform", event.transform);
}

// 添加drag-drop
svg.call(d3.drag()
    .on('start', dragStart)
    .on('drag', dragging)
    .on('end', dragEnd));

function dragStart(event) {
    dragStartCoords = [event.x, event.y];
}

function dragging(event) {
    offset = [event.x - dragStartCoords[0], event.y - dragStartCoords[1]];
    svg.attr('transform', `translate(${currentCoords[0] + offset[0]}, ${currentCoords[1] + offset[1]})`);
}

function dragEnd() {
    currentCoords = [currentCoords[0] + offset[0], currentCoords[1] + offset[1]]
}