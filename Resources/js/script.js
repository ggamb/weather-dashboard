var currentDateEl = document.getElementById("current-date");
var cityContainEl = document.getElementById("city-contain");
var currentCityEl = document.getElementById("current-city");
var currentTempEl = document.getElementById("current-temp");
var currentWindEl = document.getElementById("current-wind");
var currentHumidEl = document.getElementById("current-humid");
var currentUVEl = document.getElementById("current-uv");
var uvIndexEl = document.getElementById("uv-color");
var searchButtonEl = document.getElementById("search-button");
var dayContainEl = document.getElementById("day-contain");


function fetchWeather() {
    var searchValue = document.getElementById("search-value").value;
    var cityKey = "https://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&units=imperial&appid=96c1c6d5967a45d7c06f700d5e294417";

    fetch(cityKey)
    .then(function(response) {
        return response.json();
    })
    .then(function(response) {
       var currentDate = moment().format("dddd, MMMM Do, YYYY");

        currentDateEl.textContent = currentDate;
        currentCityEl.textContent = "City: " + response.name;
        currentTempEl.textContent = "Temperature: " + Math.round(response.main.temp) + " °F";
        currentWindEl.textContent = "Wind: " + Math.round(response.wind.speed) + " MPH";
        currentHumidEl.textContent = "Humidity: " + response.main.humidity;

        var newDay = document.createElement("div");
        newDay.className = "city-contain";
        newDay.textContent = response.name;
        cityContainEl.appendChild(newDay);
        
        var uvKey = "https://api.openweathermap.org/data/2.5/onecall?lat=" + response.coord.lat + "&lon=" + response.coord.lon + "&units=imperial&appid=96c1c6d5967a45d7c06f700d5e294417";
        return fetch(uvKey)
    })
    .then(function(responseUV) {
        return responseUV.json();
    })
    .then(function(responseUV) {
        console.log("humid", responseUV);
        
        var uvIndex = responseUV.current.uvi;

        uvIndexEl.textContent = uvIndex;
        
        if(uvIndex < 2) {
            uvIndexEl.classList.add("uv-low");
        } else if(uvIndex <= 5){
            uvIndexEl.classList.add("uv-moderate");
        } else if(uvIndex <= 7){
            uvIndexEl.classList.add("uv-high");
        } else if(uvIndex <= 10){
            uvIndexEl.classList.add("uv-very-high");
        } else {
            uvIndexEl.classList.add("uv-extreme");
        }

        currentUVEl.textContent = "UV Index: ";
        currentUVEl.appendChild(uvIndexEl);
        
        
        dayContainEl.innerHTML = "";

        for(var i = 1; i < 6; i++) {

             
            var dayDiv = document.createElement("div");
            var daysAway = moment().add(i, "days").format("Do, ddd");
            dayDiv.className = "col-2 day-style";
            dayDiv.innerHTML = daysAway 
                                + "<br/><img src=https://openweathermap.org/img/wn/" + responseUV.daily[i].weather[0].icon + "@2x.png><br/>"
                                + "Temp: " + Math.round(responseUV.daily[i].temp.day) + " °F<br/>"
                                + "Wind: " + Math.round(responseUV.daily[i].wind_speed) + " MPH<br/>" 
                                + "Humidity: " + responseUV.daily[i].humidity;
            dayContainEl.appendChild(dayDiv);
        }

        
    })



    
}

searchButtonEl.addEventListener("click", fetchWeather);

