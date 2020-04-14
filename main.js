var mymap = L.map('mapid').setView([51.505, -0.09], 13);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: 'pk.eyJ1IjoiaG9qbWF4IiwiYSI6ImNrOGgxOXV3eDAydmkzbW4ycGQ2cWpiY2oifQ.UZm8Uob61yJBaRyKW6ZFsw'
}).addTo(mymap);

let coronaDataLink = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv"

function importData() {
  maxDot = 1000000
  minDot = 200
  maxValue = -Infinity
  minValue = Infinity
  sumArray = []
  d3.csv(coronaDataLink).then(function(data) {
    for (let i = 0; i < data.length; i++) {
      sum = 0
      country = Object.values(data[i])
      sum = parseInt(country[country.length - 1])
      sumArray.push(sum)
      if (sum > maxValue) {
        maxValue = sum
      }
      if (sum < minValue) {
        minValue = sum
      }
    }
    for (let i = 0; i < data.length; i++) {
      val = minDot + sumArray[i] / maxValue * (maxDot - minDot)
      L.circle([data[i]["Lat"], data[i]["Long"]], {
        radius: minDot + sumArray[i] / maxValue * (maxDot - minDot),
        color: 'red'
      }).addTo(mymap);
    }
  })
}

importData()

//Fjernet
//
// function plotCountryData(country, data) {
//   let countryIndex = 0
//   for (let i = 0; i < data.length; i++) {
//     if (data[i]["Country/Region"] == country) {
//       countryIndex = i
//     }
//   }
//   let nameData = Object.getOwnPropertyNames(data[countryIndex]).splice(4, )
//   let deathData = Object.values(data[countryIndex]).splice(4, )
//   var data = [{
//     x: nameData,
//     y: deathData,
//     type: 'bar'
//   }];
//   Plotly.newPlot('plotDiv', data);
// }
//

//
