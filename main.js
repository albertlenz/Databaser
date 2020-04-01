let coronaDataLink = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv"

function plotCountryData(country, data) {
  let countryIndex = 0
  for (let i = 0; i < data.length; i++) {
    if (data[i]["Country/Region"] == country) {
      countryIndex = i
    }
  }
  let nameData = Object.getOwnPropertyNames(data[countryIndex]).splice(4, )
  let deathData = Object.values(data[countryIndex]).splice(4, )
  var data = [{
    x: nameData,
    y: deathData,
    type: 'bar'
  }];
  Plotly.newPlot('plotDiv', data);
}

function importData() {
  d3.csv(coronaDataLink).then(function(data) {
    plotCountryData("Spain", data)
    console.log(data)
  })
}

importData()
