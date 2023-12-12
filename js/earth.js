import { linechart } from "./scripttry.js";
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

let countryTemperatureDataDiff = {};
let colorScale; // 用于根据温度设定颜色的比例尺

// setting up the tip tool; 
const tip = d3.tip()
    .attr('class', 'd3-tip')
    .html(function (event, d) {
        const countryName = d.properties.name;
        const tempChange = countryTemperatureDataDiff[countryName];
        const tempDisplay = tempChange ? (parseFloat(tempChange).toFixed(2) + '°C') : 'No data';
        return `Country: ${countryName}<br>Temperature: ${tempDisplay}`;
    });
svg.call(tip);

let worldmeta;
let countryTemperatureData = {};

function loadGeoData() {
    return d3.json('data/countries-110m.json').then(function (geoData) {
        worldmeta = topojson.feature(geoData, geoData.objects.countries);
        projection.fitSize([innerWidth, innerHeight], worldmeta);
    });
}

function loadTemperatureData() {
    d3.csv('data/kaggle/processed/countries-avg-temperature-by-month-1900-2012.csv').then(data => {
        data.forEach(d => {
            if (!countryTemperatureData[d.Country]) {
                countryTemperatureData[d.Country] = [];
            }
            countryTemperatureData[d.Country].push(d);
        });
    }).catch(error => {
        console.error("Error loading temperature data:", error);
    });
}

function updateMapColors() {
    g.selectAll('path')
        .data(worldmeta.features, d => d.properties.name)
        .attr('fill', d => {
            const tempChange = countryTemperatureDataDiff[d.properties.name];
            return tempChange ? colorScale(tempChange) : '#ccc';
        });
}


function loadDataForDiff(year) {
    d3.csv('data/kaggle/processed/New_Environment_Temperature_change_E_All_Data_NOFLAG.csv').then(tempData => {
        const temperatureDiffExtent = d3.extent(tempData, d => +d.TemperatureDifference);
        colorScale = d3.scaleSequential(d3.interpolateOrRd).domain([0, 1.6]);
        tempData = tempData.filter(d => +d.dt === year);
        tempData.forEach(function (d) {
            countryTemperatureDataDiff[d.Country] = +d.TemperatureDifference;
        });

        // 使用该年份的数据更新地图颜色
        updateMapColors();
    }).catch(error => {
        console.error("Error loading temperature difference data:", error);
    });
}

function drawMap() {
    if (!worldmeta) {
        console.error("Global map data is not loaded yet.");
        return;
    }

    const paths = g.selectAll('path')
        .data(worldmeta.features, d => d.properties.name);

    paths.enter().append('path')
        .attr('d', pathGenerator)
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .on('mouseover', function (event, d) {
            // 处理鼠标悬停逻辑
            d3.select(this)
                .attr("opacity", 0.5)
                .attr("stroke", "white")
                .attr("stroke-width", 6);
            tip.show(event, d);
        })
        .on('mouseout', function (event, d) {
            // 处理鼠标移出逻辑
            d3.select(this)
                .attr("opacity", 1)
                .attr("stroke", "black")
                .attr("stroke-width", 1);
            tip.hide(event, d);
        })
        .on('click', function (event, d) {
            const countryName = d.properties.name;
            const temperatureData = countryTemperatureData[countryName];

            // console.log(temperatureData); // TODO: 绘制国家的气温折线图
            var chartContainer = document.getElementById('line-chart-container');
            
            if (chartContainer.style.display === 'block') {
                // 请先关闭当前窗口
            }
            else {
                chartContainer.style.display = 'block';
                linechart(temperatureData);
            }
        });

    // 更新已存在的路径元素
    paths.attr('fill', d => {
        // 根据需要更新颜色
        const tempChange = countryTemperatureDataDiff[d.properties.name];
        return tempChange ? colorScale(tempChange) : '#ccc';
    });

    // 删除多余的路径元素
    paths.exit().remove();
    return d3.json('data/countries-110m.json').then(function (geoData) {})
}

function drawLegend() {
    const legendWidth = 300;
    const legendHeight = 20;
    const legendMargin = { top: 10, right: 60, bottom: 25, left: 48 };

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
        .ticks(6)
        .tickFormat(d => d3.format(".1f")(d) + '°C');

    legendSvg.append('g')
        .attr('transform', 'translate(0,' + legendHeight + ')')
        .call(legendAxis);
}


let dragStartCoords = [0, 0];
let currentCoords = [margin.left, margin.top]; // 现在相对于程序刚开始时的偏移
let offset = [0, 0];

// 添加zoom
svg.call(d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", zoomed));

function zoomed(event) {
    const currentScale = event.transform.k;
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

(function () {
    'use strict';
    // state variables
    var state = {
        selectedYear: 1961,
        animationRunning: false,
        animationInterval: {}
        // Add more state variables as needed
    };

    function init() {
        loadTemperatureData();
        loadGeoData().then(() => {
            drawMap().then(drawLegend); // 确保先绘制地图，然后绘制图例
        });
        createYearSlider();
        attachAnimateButtonEvent();
        updateMapForDiff(1961)
    }

    function createYearSlider() {
        var min = 1961, max = 2019;

        $("#year-slider").slider({
            min: min,
            max: max,
            value: state.selectedYear,
            slide: function (event, ui) {
                state.selectedYear = ui.value;
                updateMapForDiff(ui.value); // 更新地图的函数
            },
            create: function () {
                var scale = $('#year-slider').append('<div class="slider-scale" />').find('.slider-scale');
                for (var i = min; i <= max; i=i+4) {
                    scale.append('<span class="tick" style="left:' + (i - min) / (max - min) * 100 + '%">' + i + '</span>');
                }
            }
        });
    }




    // Attach event to the animate button
    function attachAnimateButtonEvent() {
        $("#animate-button").click(function () {
            if (!state.animationRunning) {
                startAnimation();
            } else {
                stopAnimation();
            }
        });
    }

    function updateMapForDiff(year) {
        console.log("Update map for year: " + year);

        // 根据选中的年份更新地图颜色
        loadDataForDiff(year);
    }


    // Start map animation
    function startAnimation() {
        if (!state.animationRunning) {
            state.animationRunning = true;
            console.log("Start animation");
            // 开始动画，每隔5秒更新地图
            state.animationInterval = setInterval(function () {
                state.selectedYear++;
                if (state.selectedYear > 2019) {
                    // state.selectedYear = 1961; // 如果超过2019年，则重新开始
                    stopAnimation();
                }
                updateMapForDiff(state.selectedYear);
                $("#year-slider").slider('value', state.selectedYear);
            }, 500);
        }
    }
    // Stop map animation
    function stopAnimation() {
        if (state.animationRunning) {
            clearInterval(state.animationInterval); // 停止定时器
            state.animationRunning = false;
            console.log("Stop animation");
        }
    }
    // Document ready event
    $(document).ready(function () {
        init();
    });

})();
