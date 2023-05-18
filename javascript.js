$(document).ready(function () {
    const cityEl = document.getElementById("enter-city");
    const searchEl = document.getElementById("search-button");
    const clearEl = document.getElementById("clear-history");
    const nameEl = document.getElementById("city-name");
    const currentPicEl = document.getElementById("current-pic");
    const currentTempEl = document.getElementById("temperature");
    const currentHumidityEl = document.getElementById("humidity");
    const currentWindEl = document.getElementById("wind-speed");
    const historyEl = document.getElementById("history");
    var fivedayEl = document.getElementById("fiveday-header");
    var currentweatherEl = document.getElementById("today-weather");
    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
    // Assign API to a variable
    const APIKey = "e19790c4b56c6fe20f97afcbae718437";
    // function to get weather forcast for curent day
    function getCityWeather(cityName) {
        // Execute  get request from open weather api
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
        axios.get(queryURL)
            .then(function (response) {
                currentweatherEl.classList.remove("weather-1");
                // display current weather
                const currentDate = new Date(response.data.dt * 1000);
                const day = currentDate.getDate();
                const month = currentDate.getMonth() + 1;
                const year = currentDate.getFullYear();
                nameEl.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ") ";
                let weatherPic = response.data.weather[0].icon;
                currentPicEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
                currentPicEl.setAttribute("alt", response.data.weather[0].description);
                currentTempEl.innerHTML = "Temperature: " + k2f(response.data.main.temp) + " &#176F";
                currentHumidityEl.innerHTML = "Humidity: " + response.data.main.humidity + "%";
                currentWindEl.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";
                // Get 5 day forecast for this city
                let cityID = response.data.id;
                let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
                axios.get(forecastQueryURL)
                    .then(function (response) {
                        fivedayEl.classList.remove("weather-1");
                        //  Parse response to display forecast for next 5 days
                        const forecastEls = document.querySelectorAll(".forecast");
                        for (i = 0; i < forecastEls.length; i++) {
                            forecastEls[i].innerHTML = "";
                            const forecastIndex = i * 8 + 4;
                            const forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
                            const forecastDay = forecastDate.getDate() ;
                            const forecastMonth = forecastDate.getMonth() + 1;
                            const forecastYear = forecastDate.getFullYear();
                            const forecastDateEl = document.createElement("p");
                            forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
                            forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                            forecastEls[i].append(forecastDateEl);
                            // Icons
                            const weatherForcastEl = document.createElement("img");
                            weatherForcastEl.setAttribute("src", "https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png");
                            weatherForcastEl.setAttribute("alt", response.data.list[forecastIndex].weather[0].description);
                            forecastEls[i].append(weatherForcastEl);
                            const forecastTempEl = document.createElement("p");
                            forecastTempEl.innerHTML = "Temp: " + k2f(response.data.list[forecastIndex].main.temp) + " &#176F";
                            forecastEls[i].append(forecastTempEl);
                            const windForecastEl = document.createElement("p");
                            windForecastEl.innerHTML = "Wind : " + response.data.list[forecastIndex].wind.speed + " MPH";
                            forecastEls[i].append(windForecastEl);
                            const humidityForecastEl = document.createElement("p");
                            humidityForecastEl.innerHTML = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
                            forecastEls[i].append(humidityForecastEl);
                        }
                    })
            });
    }
    // render history from local storage
    searchEl.addEventListener("click", function () {
        const searchCity = cityEl.value;
        getCityWeather(searchCity);
        searchHistory.push(searchCity);
        localStorage.setItem("search", JSON.stringify(searchHistory));
        renderSearchHistory();
    })
    // Clears history
    clearEl.addEventListener("click", function () {
        localStorage.clear();
        searchHistory = [];
        renderSearchHistory();
    })
    function k2f(K) {
        return Math.floor((K - 273.15) * 1.8 + 32);
    }
    // rendering search history
    function renderSearchHistory() {
        historyEl.innerHTML = "";
        for (let i = 0; i < searchHistory.length; i++) {
            const historyCity = document.createElement("input");
            historyCity.setAttribute("type", "text");
            historyCity.setAttribute("readonly", true);
            historyCity.setAttribute("class", "form-control d-block bg-white");
            historyCity.setAttribute("value", searchHistory[i]);
            historyCity.addEventListener("click", function () {
                getCityWeather(historyCity.value);
            })
            historyEl.append(historyCity);
        }
    }
    renderSearchHistory();
    if (searchHistory.length > 0) {
        getCityWeather(searchHistory[searchHistory.length - 1]);
    }
}
);