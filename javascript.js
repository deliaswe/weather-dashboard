
//variables
    var searchCity = $(".input");
    var searchButton = $("#searchButton");
    var currCity = $("#currentCity");
    var currTemp = $("#temperature");
    var currHumidity = $("#humidity")
    var currwindSpeed = $("#windSpeed");
    var currUvIndex = $("#uvIndex");
    var searchHistory = $(".searchHistory");

// function for today's date
    var today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    var date = mm + '/' + dd + '/' + yyyy;
    console.log(date);


//retrieve searched cities from local storage and renders to page
var cityList = localStorage.getItem("city-list");
if (cityList === null) {
    cityList = [];
} else {
    cityList = JSON.parse(cityList);
    renderList();
}

// WHEN I search for a city
searchButton.on("click", function () {
    searchCity.val();
// the searched city saves to local storage
    cityList.push(searchCity.val());
    localStorage.setItem("city-list", JSON.stringify(cityList));

// current weather forecast function
    getWeather();
// 5-Day weather forecast function
    Get5DayForecast();
    });


//render function to display searched cities to the page
function renderList() {
    var cityListTag = document.querySelector("ul");

//creates list for cities searched
    if (cityListTag === null) {
    cityListTag = document.createElement("ul");
    searchHistory.append(cityListTag);
}

    var innerList = "";
    for (var e = 0; e < cityList.length; e++) {
    innerList += `<li> ${cityList[e]} </li>`;
}
    cityListTag.innerHTML = innerList;
}
//render function
renderList();


//function that gets the current weather for the city
function getWeather() {
  //openweathermap API & key
    var apiKey = "754e47c4b7e9f259e78d1586c79f6245";
    var queryUrl = "https://home.openweathermap.org/api_keys" + searchCity.val() + "&appid=" + apiKey;

  //ajax call for current weather
    $.ajax({
    url: queryUrl,
    method: "GET"
    }).then(function (response) {
    console.log(queryUrl);
    console.log(response);

    //creates current weather icon
    var weathericon = response.weather[0].icon;
    var iconurl = "https://openweathermap.org/img/wn/" + weathericon + "@2x.png";

    //displays name, date and weather icon to page
    currCity.html("<h1>" + response.name + " " + date + "<img src=" + iconurl + "></img>" + "</h1>");


    //converts celcius to fahrenheit
    var tempfahrenheit = (response.main.temp - 273.15) * 1.80 + 32;
    // diplays temperature in fehrenheit
    currTemp.text("Temperature: " + tempfahrenheit.toFixed(2) + "°F");
//displays wind speed
    currwindSpeed.text("Wind Speed: " + response.wind.speed + " mph");
    //displays himidity
    currHumidity.text("Humidity: " + response.main.humidity + "%");

//function containt lattitude and longitude
    UVIndex(response.coord.lon, response.coord.lat);

    })
}

//uses latitude and longitude from searched city to grab UV index
function UVIndex(ln, lt) {

    var queryUrl = "https://api.openweathermap.org/data/2.5/uvi?appid=754e47c4b7e9f259e78d1586c79f6245" + "&lat=" + lt + "&lon=" + ln;

    $.ajax({
    url: queryUrl,
    method: "GET",
    }).then(function (response) {
    currUvIndex.html("UV Index:" + " " + response.value);
    });
}


// five day forecast
function Get5DayForecast() {
    var queryUrlForecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchCity.val() + "&appid=754e47c4b7e9f259e78d1586c79f6245";
    $("#card-row").empty();
//ajax call to retrieve 5 day forecast
    $.ajax({
    url: queryUrlForecast,
    method: "GET",

    }).then(function (fiveDayReponse) {
    for (let i = 0; i != fiveDayReponse.list.length; i += 8) {
        let cityObj = {
        date: fiveDayReponse.list[i].dt_txt,
        icon: fiveDayReponse.list[i].weather[0].icon,
        temp: fiveDayReponse.list[i].main.temp,
        humidity: fiveDayReponse.list[i].main.humidity,
    }
        let dateStr = cityObj.date;
        let trimmedDate = dateStr.substring(0, 10);
        let weatherIco = `https:///openweathermap.org/img/w/${cityObj.icon}.png`;
        createForecastCard(trimmedDate, weatherIco, cityObj.temp, cityObj.humidity);
    }
    })
}

//creates 5-Day forecast weather cards to page
function createForecastCard(date, icon, temp, humidity) {
  // HTML elements 
    let fiveDayCardEl = $("<div>").attr("class", "five-day-card");
    let cardDate = $("<h1>").attr("class", "card-text");
    let cardIcon = $("<img>").attr("class", "weatherIcon");
    let cardTemp = $("<p>").attr("class", "card-text");
    let cardHumidity = $("<p>").attr("class", "card-text");

    $("#card-row").append(fiveDayCardEl);
    cardDate.text(date);
    cardIcon.attr("src", icon);
    cardTemp.text(`Temp: ${((temp - 273.15) * 1.80 + 32).toFixed(2)} °F`);
    cardHumidity.text(`Humidity: ${humidity}%`);
    fiveDayCardEl.append(cardDate, cardIcon, cardTemp, cardHumidity);
}