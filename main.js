let coronaMap;
let coronaDataLink = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv"

createMap()
addCoronaData()


function createMap() {
  coronaMap = L.map('coronaMap').setView([30, 0], 2);                           // Lav kortet med brug af leaflet.js bibloteket
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiaG9qbWF4IiwiYSI6ImNrOGgxOXV3eDAydmkzbW4ycGQ2cWpiY2oifQ.UZm8Uob61yJBaRyKW6ZFsw'
  }).addTo(coronaMap);
}


function addCoronaData() {
  let maxDot = 400000;                                                          //Maximum størrelse på cirkler
  let minDot = 100;                                                             //Minimum størrelse på cirkler
  let maxValue = -Infinity;                                                     //Maximum mængde døde
  let minValue = Infinity;                                                      //Minimum mængde døde
  d3.csv(coronaDataLink).then(function(data) {                                  //Importer dataen med d3 bibloteket
    for (let e of data) {                                                       //loop over alle lande, hvor et land betegnes "e"
      country = Object.values(e)
      countryDeath = parseInt(country[country.length - 1])                      //Den sidste værdi i listen er landets antal døde
      if (countryDeath == 0) {                                                  //Hvis landet ikke har nogen døde, ses der bort fra landet
        continue;
      }
      if (countryDeath > maxValue) {                                            //Checker om landet har flest dødsfald i verden
        maxValue = countryDeath
      }
      if (countryDeath < minValue) {                                            //Checker om landet har færrest dødsfald i verden
        minValue = countryDeath
      }
    }
    for (let e of data) {                                                       //Loop over alle stykker data igen:
      country = Object.values(e)
      countryDeath = parseInt(country[country.length - 1])
      if (countryDeath == 0) {                                                  //tegn IKKE cirkel, hvis der ikke er dødsfald
        continue;
      }
      let size = minDot + countryDeath / maxValue * (maxDot - minDot)           //Linær transformation. Her vælges størrelsen af cirklerne på baggrund af antal døde.
      L.circle([e["Lat"], e["Long"]], {                                         //Cirklen sættes ved koordinaterne defineret af datasættet
        radius: size,                                                           //Sætter radius lig den beregnede værdi
        color: 'red'                                                            //Rød farve
      }).bindTooltip('Antal døde: ' + countryDeath).addTo(coronaMap)            //Binder et tooltip og placerer på kortet
    }
  })
}
