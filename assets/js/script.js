let APIKey = "4beb2f3c075f29c9148fcd6830d2242d";
let formEl = document.getElementById("search-field");
let inputEl = document.getElementById("search-input");
let searchesEl = document.getElementById("past-searches");
let cityDateEl = document.getElementById("city-date");
let extendedForecastEl = document.getElementById("extended-forecast");
let cityTitleEl = document.querySelector("#city-date h2");
let savedCities = [];

//invokes with form submission - Searches city weather
let showWeather = function (event) {
    if (event.type == "submit") {
        event.preventDefault();
    }
    cityDateEl.innerHTML = "";
    extendedForecastEl.innerHTML = "";

    let searchedCity = inputEl.value.toLowerCase();
    inputEl.value = "";
    if (searchedCity === "") {
       inputEl.setAttribute("placeholder", "Search an actual city!");
       return;
    }

    // store cities that aren't yet saved
    let cityStored = JSON.parse(localStorage.getItem("cities"));
      if ( cityStored == null || !cityStored.includes(searchedCity) || !cityStored.includes(searchedCity)) {
          let btnEl = document.createElement("button");
          btnEl.textContent = searchedCity.charAt(0).toUpperCase() + searchedCity.slice(1); 
          searchesEl.appendChild(btnEl);
          savedCities.push(searchedCity);
          localStorage.setItem("cities",JSON.stringify(savedCities));
    }

    //pass coordinates to access specific weather data from api
    let coordinates = weatherCaster(searchedCity,APIKey);
    coordinates.then(data => {
        let latitude = data[0];
        let longitude = data[1];
        let queryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,alerts&units=imperial&appid=${APIKey}`
         fetch(queryURL)
        .then(response => response.ok? response.json(): console.log("Error: On first response"))
        .then( data => {

            //generates current weather forecast
            let todaysDate = Date();
            let formattedDate = dateFns.format(todaysDate, "MM/DD/YYYY hh:mm a");
            let currentForecastTitle = document.createElement("h2");
            currentForecastTitle.textContent = formattedDate;
            cityDateEl.appendChild(currentForecastTitle);

            let iconCode = data.current.weather[0].icon
            let iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;
            let iconImageEL = document.createElement("img");
            iconImageEL.setAttribute("src",iconUrl);
            cityDateEl.appendChild(iconImageEL);

            document.getElementById("temp").textContent = `Temp: ${data.current.temp}°F`;
            document.getElementById("wind").textContent = `Wind: ${data.current.wind_speed} MPH`;
            document.getElementById("humidity").textContent = `Humidity: ${data.current.humidity} %`;
            let uv = document.getElementById("uv")
            uv.innerHTML = `UV Index: <span>${data.current.uvi}</span>`;
            uv.children[0].style.backgroundColor = uvColor(data.current.uvi);

            //generates five-day weather forecast
            for (let weatherCard = 1; weatherCard < 6; weatherCard++) {
                let weatherDivEl = document.createElement("div");
                weatherDivEl.className = "flex";
                let cardDate = document.createElement("p");
                let cardIcon = document.createElement("img");
                let cardTemp = document.createElement("p");
                let cardWind = document.createElement("p");
                let cardHumidity = document.createElement("p");
                let iconCodeTwo = data.daily[weatherCard].weather[0].icon

                let rawDate = new Date(data.daily[weatherCard].dt * 1000).toLocaleString("en-US");
                let formattedDateTwo = rawDate.split(",")[0];
                formattedDateTwo.length = 8;
                cardDate.textContent = formattedDateTwo;

                cardIcon.setAttribute("src",`http://openweathermap.org/img/wn/${iconCodeTwo}.png`);
                cardTemp.textContent = `Temp: ${data.daily[weatherCard].temp.day}°F`;
                cardWind.textContent = `Wind: ${data.daily[weatherCard].wind_speed} MPH`;
                cardHumidity.textContent = `Humditiy: ${data.daily[weatherCard].humidity} %`;

                weatherDivEl.append(cardDate,cardIcon,cardTemp,cardWind, cardHumidity);
                extendedForecastEl.append(weatherDivEl);
            }
            console.log(data)
        })
    })
}

let weatherCaster = function(searchedCity, apikey) {
    let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${searchedCity}&appid=${apikey}&units=imperial`;

    let data = fetch(queryURL)
    .then(response => response.ok ? response.json() : console.log("Error: On first response"))
    .then(data => {
        console.log(data);
        let latitude = data.coord.lat;
        let longitude = data.coord.lon;
        let latitudeLon = [];
        latitudeLon.push(latitude, longitude);
        return latitudeLon;
    })
    .catch(error => console.log(`${error}: Look further into weatherCaster function`))

    return data;
}

let uvColor = function(uv) {
    switch(uv) {
        case uv < 3: return "green";
        break;
        case uv < 5: return "yellow";
        break;
        case uv < 8: return "orange";
        break;
        case uv < 11: return "red";
        break;
        default: return "light-blue";
    }
}

let previouslySearched = function() {

    let cityStored = JSON.parse(localStorage.getItem("cities"));
    if (cityStored) {
    for (let city = 0; city < cityStored.length; city++) {
        let cityBtn = document.createElement("button");
        cityBtn.textContent = cityStored[city].charAt(0).toUpperCase() + cityStored[city].slice(1);
        searchesEl.appendChild(cityBtn);
    } 
    }
}

 let chosenPreviousCity = function(event) {
    console.log(event.type);
    let targetEl = event.target;
    inputEl.value = targetEl.textContent;
    showWeather(event);
    } 

document.addEventListener("DOMContentLoaded", previouslySearched);
searchesEl.addEventListener("click", chosenPreviousCity);
formEl.addEventListener("submit", showWeather);

