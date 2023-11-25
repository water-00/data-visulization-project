let svg = d3.select('svg');
const width = +svg.attr('width');
const height = +svg.attr('height');
const margin = { top: 0, right: 0, bottom: 0, left: 0 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;
const g = svg.append('g').attr('id', 'maingroup')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

// convert dataPath to svgPath; 
// go to https://github.com/d3/d3-geo for more different projections; 
// const projection = d3.geoAzimuthalEquidistant(); // 方位角等距离投影。
// const projection = d3.geoEqualEarth(); // Bojan Šavrič et al., 2018.
// const projection = d3.geoOrthographic(); // 方位角正交投影。
// const projection = d3.geoAzimuthalEqualArea(); // Lambert等面积方位角投影。
// const projection = d3.geoStereographic(); // 球极平面投影。

// const projection = d3.geoConicEqualArea(); // 亚尔勃斯等面积投影
// const projection = d3.geoConicEquidistant(); // 圆锥等距投影
// const projection =  d3.geoConicConformal().parallels([35, 65]).rotate([0, 0])
// .scale(width / 13.5).center([0, 0]).translate([width / 2, height / 2]).precision(0.2); //Lambert圆锥等角投影
// const projection = d3.geoHill(); // 伪圆锥等面积投影。

// const projection = d3.geoCylindricalEqualArea(); // Lambert等面积圆柱投影。
// const projection = d3.geoCraster(); // 正弦曲线等面积伪圆柱投影。
const projection = d3.geoMercator(); // 墨卡托投影。
// const projection = d3.geoNaturalEarth1(); // Natural Earth Projection
// const projection = d3.geoEquirectangular(); // Plate Carrée投影（等距）
const pathGenerator = d3.geoPath().projection(projection);

// setting up the tip tool; 
const tip = d3.tip()
    .attr('class', 'd3-tip').html(function (event, d) { return d.properties.name });
svg.call(tip);

let worldmeta;
let lastid = undefined;

d3.json('data/countries-110m.json').then(function (data) {
    // convert topo-json to geo-json; 
    worldmeta = topojson.feature(data, data.objects.countries);
    console.log(worldmeta)

    // this code is really important if you want to fit your geoPaths (map) in your SVG element; 
    projection.fitSize([innerWidth, innerHeight], worldmeta);

    // perform data-join; 
    const paths = g.selectAll('path')
        .data(worldmeta.features, d => d.properties.name)
        .enter().append('path')
        .attr('d', pathGenerator)
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .on('mouseover', function (event, d) {
            d3.select(this)
                .attr("opacity", 0.5)
                .attr("stroke", "white")
                .attr("stroke-width", 6);
            tip.show(event, d);
            lastid = d.properties.name;
        })
        .on('mouseout', function (event, d) {
            d3.select(this)
                .attr("opacity", 1)
                .attr("stroke", "black")
                .attr("stroke-width", 1);
            tip.hide(event, d)
            lastid = -lastid
        })
        .on('contextmenu', function (event, d) {
            // 按下右键逻辑
            // event.preventDefault(); // 防止浏览器执行右键的默认行为
            // if (lastid !== d.properties.name) {
            //     tip.show(event, d)
            //     lastid = d.properties.name;
            // } else {
            //     tip.hide(event, d)
            //     lastid = -lastid
            // }
        })
        .on('click', function (event, d) {
            // 处理左键点击的逻辑
            console.log('Left click on', d.properties.name);
        });

});

d3.csv('data/kaggle/cities-info.csv').then(function (data) {
    const paths = g.selectAll('.city-point')
        .data(data)
        .enter().append('circle')
        .attr('class', 'city-point')
        .attr('cx', function (d) { return projection([d.Longitude, d.Latitude])[0]; })
        .attr('cy', function (d) { return projection([d.Longitude, d.Latitude])[1]; })
        .attr('r', 2) // 你可以调整圆圈的大小
        .attr('fill', 'red')
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .on('mouseover', function (event, d) {
            // 处理鼠标悬停时的逻辑，例如显示城市站信息
            console.log('Mouseover on city:', d.City);
        })
        .on('mouseout', function () {
            // 处理鼠标移出时的逻辑，例如隐藏城市站信息
        });
});

