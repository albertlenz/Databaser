let coronaMap;
let coronaDataLink = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv"


function setDate(days) {
  dateLabel.html(Object.keys(data[0])[4 + slider.value()-1])
}

function changeDate() {
  coronaMap.removeLayer(circleGroup)
  circleGroup = L.featureGroup();
  addCoronaData(maxSliderValue + 1 - slider.value())
  setDate(slider.value())
}

function createTimeSlider(length) {
  slider = createSlider(1, length, 0, 1);
  slider.position(10, 620);
  slider.style('width', '200px');
  slider.input(changeDate);
}

let circleGroup = L.featureGroup();
let slider;
let data = undefined
let maxSliderValue
let dateLabel

function createDateLabel() {
  dateLabel = createP(Object.keys(data[0])[4 + slider.value()-1]);
  dateLabel.position(10, 630)
}

function setup() {
  createMap()
  loadData()
}


function createMap() {
  coronaMap = L.map('coronaMap').setView([30, 0], 2); // Lav kortet med brug af leaflet.js bibloteket
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiaG9qbWF4IiwiYSI6ImNrOGgxOXV3eDAydmkzbW4ycGQ2cWpiY2oifQ.UZm8Uob61yJBaRyKW6ZFsw'
  }).addTo(coronaMap);
}


function addCoronaData(daysago) {
  if (data) {
    for (let e of data) { //Loop over alle stykker data igen:
      country = Object.values(e)
      countryDeath = parseInt(country[country.length - daysago])
      if (countryDeath == 0) { //tegn IKKE cirkel, hvis der ikke er dødsfald
        continue;
      }
      // let size = minDot + countryDeath / maxValue * (maxDot - minDot) //Linær transformation. Her vælges størrelsen af cirklerne på baggrund af antal døde.
      size = Math.pow(countryDeath, 0.25) * 15000
      L.circle([e["Lat"], e["Long"]], { //Cirklen sættes ved koordinaterne defineret af datasættet
        radius: size, //Sætter radius lig den beregnede værdi
        color: 'red', //Rød farve
        weight: 5,
      }).bindTooltip('Antal døde: ' + countryDeath).addTo(circleGroup) //Binder et tooltip og placerer på kortet
    }
    coronaMap.addLayer(circleGroup);
  }
}

function loadData() {
  d3.csv(coronaDataLink).then(function(values) {
    data = values
    console.log(data)
    console.log(Object.values(data[0]))
    console.log(Object.keys(data[0]).slice(20,101))
    maxSliderValue = Object.values(data[0]).length - 4
    createTimeSlider(maxSliderValue)
    addCoronaData(maxSliderValue + 1 - slider.value())
    createDateLabel()
  })


}
