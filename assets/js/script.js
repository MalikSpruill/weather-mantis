let APIKey = "4beb2f3c075f29c9148fcd6830d2242d";
//let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIKey}&units=imperial`;
let formEl = document.getElementById("search-field");
let inputEl = document.getElementById("search-input");
let searchesEl = document.getElementById("past-searches");
let savedCities = [];

//invokes with form submission - Searches city weather
let showWeather = function (event) {
    event.preventDefault();

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
        .then( data => console.log(data))
    })

}

let weatherCaster = function(searchedCity, apikey) {
    let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${searchedCity}&appid=${apikey}&units=imperial`;

    let data = fetch(queryURL)
    .then(response => response.ok ? response.json() : console.log("Error: On first response"))
    .then(data => {
        let latitude = data.coord.lat;
        let longitude = data.coord.lon;
        let latitudeLon = [];
        latitudeLon.push(latitude, longitude);
        return latitudeLon;
    })
    .catch(error => console.log(`${error}: Look further into weatherCaster function`))

    return data;
}






formEl.addEventListener("submit", showWeather);

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


