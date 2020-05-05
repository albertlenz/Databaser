let coronaMap
let coronaDataLink = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv"
let circleGroup = L.featureGroup()
let dateSlider
let coronaData
let maxSliderValue
let dateLabel

function setup() {
  createMap()
  loadData()
}

function changeDateLabel(days) {
  dateLabel.html(Object.keys(coronaData[0])[4 + days - 1])
}

function changeDate() {
  coronaMap.removeLayer(circleGroup)
  circleGroup = L.featureGroup()
  fillCircleGroup(maxSliderValue + 1 - dateSlider.value())
  coronaMap.addLayer(circleGroup)
  changeDateLabel(dateSlider.value())
}

function createTimeSlider(length) {
  dateSlider = createSlider(1, length, 0, 1)
  dateSlider.position(10, 620)
  dateSlider.style('width', '200px')
  dateSlider.input(changeDate) // "changdeDate"-funktionen associeres med slideren, så den kaldes hver gang slideren ændres
}

function createDateLabel() {
  // HTML-paragraphen der viser datoen
  dateLabel = createP(Object.keys(coronaData[0])[4 + dateSlider.value() - 1])
  dateLabel.position(10, 630)
}

function createMap() {
  coronaMap = L.map('coronaMap').setView([30, 0], 2) // Lav kortet med brug af leaflet.js bibloteket
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map coronaData &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiaG9qbWF4IiwiYSI6ImNrOGgxOXV3eDAydmkzbW4ycGQ2cWpiY2oifQ.UZm8Uob61yJBaRyKW6ZFsw'
  }).addTo(coronaMap)
}

function fillCircleGroup(index) {
  for (let e of coronaData) { //Loop over alle stykker coronaData
    country = Object.values(e)
    countryDeath = parseInt(country[country.length - index])
    if (countryDeath == 0) { //tegn IKKE cirkel, hvis der ikke er dødsfald
      continue
    }
    size = Math.pow(countryDeath, 0.25) * 15000
    L.circle([e["Lat"], e["Long"]], { //Cirklen sættes ved koordinaterne defineret af coronaDatasættet
      radius: size, //Sætter radius lig den beregnede værdi
      color: 'red', //Rød farve
      weight: 5,
    }).bindTooltip('Antal døde: ' + countryDeath).addTo(circleGroup) //Binder et tooltip og placerer på kortet
  }
}

function loadData() {
  d3.csv(coronaDataLink).then(function(values) {
    coronaData = values
    maxSliderValue = Object.values(coronaData[0]).length - 4
    createTimeSlider(maxSliderValue) //Kalder createfunktionerne her fordi d3's load funktion er asynkron
    createDateLabel()
    fillCircleGroup(maxSliderValue + 1 - dateSlider.value())
    coronaMap.addLayer(circleGroup)
  })
}
