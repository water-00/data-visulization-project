import { carbon_dioxide } from "./carbon_dioxide.js";
import { global_temperature } from "./global_temperature.js"
import { mathane } from "./mathane.js"


$(document).ready(function () {
    var flag1 = false, flag2 = false, flag3 = false, flag4 = false, flag5 = false, flag6 = false;
    $('.side-button, .close-button').click(function () {
        var buttonName = $(this).text().replace(/\s+/g, '-'); // Remove spaces and replace with hyphens
        var csvFilePath = `data/nasa-climate/${buttonName}.csv`; // Construct the file path
        console.log(buttonName)
        
        var chartContainer = document.getElementById('climate-chart');
        if (chartContainer.style.display === 'block' || buttonName == "CLOSE") {
            d3.selectAll('#climate-chart').selectAll('*').remove();
            chartContainer.style.display = 'none'
        } else {
            loadCSVData(csvFilePath, function (data) {
                console.log(data);
                // TODO: 使用data绘制折线图。如果不同data需要不同函数执行，不能放在一个块的话可以用switch case(buttonName)
                switch (buttonName) {
                    case "Carbon-Dioxide":
                        carbon_dioxide(data);
                        break;
                    case "Global-Temperature":
                        global_temperature(data);
                        break;
                    case "Methane":
                        mathane(data);
                        break;
                    case "Ocean-Warming":
                        ocean_warming(data);
                        break;
                    case "Sea-Level":
                        sea_level(data);
                        break;
                    case "Ice-Minimum-Extent":
                        ice_minimum_extent(data);
                        break;

                    default:
                        break;
                }
            }
            );
        }
    });
});

function loadCSVData(filePath, callback) {
    d3.csv(filePath).then(function (data) {
        callback(data);
    }).catch(function (error) {
        console.error('Error loading CSV data:', error);
    });
}


function ocean_warming(data) {

}

function sea_level(data) {

}

function ice_minimum_extent(data) {

}
