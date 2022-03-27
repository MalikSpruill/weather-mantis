let APIKey = "4beb2f3c075f29c9148fcd6830d2242d";
//let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIKey}&units=imperial`;
let formEl = document.getElementById("search-field");
let inputEl = document.getElementById("search-input");
let searchesEl = document.getElementById("past-searches");
let cityDateEl = document.getElementById("city-date");
let extendedForecastEl = document.getElementById("extended-forecast");
let cityTitleEl = document.querySelector("#city-date h2");
let savedCities = [];

//invokes with form submission - Searches city weather
let showWeather = function (event) {
    event.preventDefault();

    document.querySelector("#extended-forecast h2").style.display = "none";

    let searchedCity = inputEl.value;
    inputEl.value = "";
    if (searchedCity === "") {
       inputEl.setAttribute("placeholder", "Search an actual city!");
       return;
    }

    // store cities that aren't yet saved
    let cityStored = JSON.parse(localStorage.getItem("cities"));
      if ( cityStored == null || !cityStored.includes(searchedCity)) {
          let btnEl = document.createElement("button");
          btnEl.textContent = searchedCity;
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
        let officialWeatherData = fetch(queryURL)
        .then(response => response.ok? response.json(): console.log("Error: On first response"))
        .then( data => {

            //generates current weather forecast
            let todaysDate = Date();
            let formattedDate = dateFns.format(todaysDate, "MM/DD/YYYY hh:mm a");
            cityTitleEl.innerHTML = formattedDate;

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

                weatherDivEl.append(cardDate,cardIcon,cardTemp,cardWind);
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

let previouslySearched = function(event) {
    let targetEl = event.target;
    let cityStored = JSON.parse(localStorage.getItem("cities"));
    
    for (let city = 0; city < cityStored.length; city++) {
        if (targetEl.textContent == cityStored[city]) {
            inputEl.textContent = targetEl.textContent;
            showWeather(event);
        }
    }
    }





formEl.addEventListener("submit", showWeather);
searchesEl.addEventListener("click",previouslySearched);

//function that invokes on startup for existing saved cities


//let iconUrl = "http://openweathermap.org/img/wn/" + iconVariable + ".png";
//api for lat,lon   https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${APIKey}&units=imperial
//api for 5 day https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial&appid=${APIKey}



/*
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${APIKey}&units=imperial`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        let lat = data[0].lat;
        let lon = data[0].lon;
        let arr = [];
        arr.push(lat,lon);
        console.log(arr);

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial&appid=${APIKey}`)
        .then(response => response.json())
        .then(data => console.log(data))
     })
*/


