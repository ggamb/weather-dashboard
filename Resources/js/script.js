//Selector variables
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
var cityContainer = $(".searched-city");
var searchedCityArray = [];


function sendToFetchWeather() {
    var searchedCity = document.getElementById("search-value").value;
    fetchWeather(searchedCity);
    clearInput();
}

//Function to get and display weather now and five day forecast on search
function fetchWeather(cityToSearch) {
    //Searches for user's search term on the Open Weather API for current weather  
    var cityKey = "https://api.openweathermap.org/data/2.5/weather?q=" + cityToSearch + "&units=imperial&appid=96c1c6d5967a45d7c06f700d5e294417";

    fetch(cityKey)
    .then(function(response) {
        return response.json();
    })
    .then(function(response) {
        //Writes today's weather based on the response from the API
       var currentDate = moment().format("dddd, MMMM Do, YYYY");

        currentDateEl.textContent = currentDate;
        currentCityEl.textContent = "City: " + response.name;
        currentTempEl.textContent = "Temperature: " + Math.round(response.main.temp) + " °F";
        currentWindEl.textContent = "Wind: " + Math.round(response.wind.speed) + " MPH";
        currentHumidEl.textContent = "Humidity: " + response.main.humidity;

        //Creates divs to show past searches
        var newDay = document.createElement("button");
        newDay.className = "searched-city";
        newDay.textContent = response.name;
        cityContainEl.appendChild(newDay);

        //Saves city name in localStorage
        addIfNew(response.name);
        
        //Calls the five day forecast API using longitude and latitude from current weather search
        var uvKey = "https://api.openweathermap.org/data/2.5/onecall?lat=" + response.coord.lat + "&lon=" + response.coord.lon + "&units=imperial&appid=96c1c6d5967a45d7c06f700d5e294417";
        return fetch(uvKey)
    })
    .then(function(responseUV) {
        return responseUV.json();
    })
    .then(function(responseUV) {
        console.log("humid", responseUV);
        //Creates and applies color scheme for the UV index based on US EPA exposure guidance
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
        
        //Removes previous search five day forecast containers
        dayContainEl.innerHTML = "";

        //Creates five day forecast based on five day forecast API response
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

/*function applyButton() {
        
    
}*/

function clearInput() {
    var searchedCity = document.getElementById("search-value");
    searchedCity.value = "";
}


function searchAgain() {
    var container = document.getElementById("city-contain");

    for (let i = 0, len = container.children.length; i < len; i++) {
        container.children[i].onclick = function(){
            fetchWeather(container.children[i].textContent);
        }
    }
}

$(cityContainEl).on("click", $(".searched-city"), function() {
    searchAgain();
})

function addIfNew(cityName) {
    console.log("before",searchedCityArray);

    if(!searchedCityArray.includes(cityName)) {
        searchedCityArray.push(cityName);
    }    
    
    console.log(searchedCityArray);
    addToLocalStorage(cityName);
}

function addToLocalStorage(cityName) { 
    //Gets localStorage or creates an array
    var savedArray = JSON.parse(localStorage.getItem("cities")) || [];

    if(!savedArray.includes(cityName)) {
        savedArray.push(cityName);
    }    
    

    localStorage.setItem("cities", JSON.stringify(savedArray));
}


function loadLocalStorage() {
    var localArray = JSON.parse(localStorage.getItem("cities")) || []
    //Adds the new search to the saved array if it hasnt been searched before
    /*if(!savedArray.includes(cityName)) {
        savedArray.push(cityName);
    }   */
    
    //Creates buttons for all cities in local storage
    for(var i = 0; i < localArray.length; i++) {
        var newDay = document.createElement("button");
        newDay.className = "searched-city";
        newDay.textContent = localArray[i];
        cityContainEl.appendChild(newDay);
    }
}


searchButtonEl.addEventListener("click", sendToFetchWeather);
loadLocalStorage();