
import { linechart } from "../line/scripttry.js";
$(document).ready(function () {
    
    $('.side-button').click(function () {
        var buttonName = $(this).text().replace(/\s+/g, '-'); // Remove spaces and replace with hyphens
        var csvFilePath = `data/nasa-climate/${buttonName}.csv`; // Construct the file path
        loadCSVData(csvFilePath, function (data) {
            // TODO: 使用data绘制交互折线图。如果不同data需要不同函数执行，不能放在一个块的话可以用switch case(buttonName)
            // console.log(data);
            linechart(data);
        });
    });
});

function loadCSVData(filePath, callback) {
    d3.csv(filePath).then(function (data) {
        callback(data);
    }).catch(function (error) {
        console.error('Error loading CSV data:', error);
    });
}
