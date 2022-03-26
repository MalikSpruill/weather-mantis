let APIKey = "4beb2f3c075f29c9148fcd6830d2242d";
let cityName = "austin";
let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIKey}&units=imperial`;
let pictureHolder = document.getElementById("weather-info");
let iconHolder;


//"https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
//https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
//let iconUrl = "http://openweathermap.org/img/wn/" + iconHolder + ".png";
// Works for 5 day weather let queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + city + "&lon=" + city + "&exclude=minutely,hourly,alerts&units=imperial&appid=" + APIKey;
//WORKS   let queryURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + APIKey;
//fetch(`api.openweathermap.org/data/2.5/forecast?lat=-97.7431&lon=30.2672&appid=${APIKey}`)


    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=raleigh&appid=${APIKey}`)
    .then(response => response.json())
    .then(data => {
        let lat = data[0].lat;
        let lon = data[0].lat;
        let arr = [];
        arr.push(lat,lon);
        console.log(arr);

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial&appid=${APIKey}`)
        .then(response => response.json())
        .then(data => console.log(data))
     })


fetch(queryURL)
.then(response => response.json())
.then(data => {
    console.log(data);
    /*
    let lon = data.coord.lon;
    let lat = data.coord.lat;
    console.log(lon + "  " + lat);
    iconHolder = data.weather[0].icon;
    let iconUrl = "http://openweathermap.org/img/wn/" + iconHolder + ".png";
    let image = document.createElement("img");
    console.log(pictureHolder)

    image.setAttribute("src", iconUrl);
    pictureHolder.appendChild(image);
    console.log(pictureHolder);
    */
})



