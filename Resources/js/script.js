var currentCityEl = document.getElementById("current-city");
var currentTempEl = document.getElementById("current-temp");
var currentWindEl = document.getElementById("current-wind");
var currentHumidEl = document.getElementById("current-humid");
var currentUVEl = document.getElementById("current-uv");

function fetchWeather() {
    var apiKey = "https://api.openweathermap.org/data/2.5/weather?q=London&units=imperial&appid=96c1c6d5967a45d7c06f700d5e294417";
    
    fetch(apiKey)
    .then(function(response) {
        return response.json();
    })
    .then(function(response) {
        console.log(response);
        console.log(response.main.temp);
        

        currentCityEl.textContent = "City: " + response.name;
        currentTempEl.textContent = "Temperature: " + response.main.temp;
        currentWindEl.textContent = "Wind: " + response.wind.speed;
        currentHumidEl.textContent = "Humidity: " + response.main.humidity;


        console.log(response.coord.lat, response.coord.lon);
        //fix dt= after lon?
        var uvKey = "https://api.openweathermap.org/data/2.5/onecall?lat=" + response.coord.lat + "&lon=" + response.coord.lon + "&appid=96c1c6d5967a45d7c06f700d5e294417";
        return fetch(uvKey)
    })
    .then(function(responseUV) {
        return responseUV.json();
    })
    .then(function(responseUV) {
        console.log("humid", responseUV);
        currentUVEl.textContent = "UV Index: " + responseUV.current.uvi;
    })
}

fetchWeather();