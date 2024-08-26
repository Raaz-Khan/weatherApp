// console.log("js is running");
let outputContainer = document.querySelector(".output");
let currentWeather = document.querySelector(".currentWeather");
let forcastContainer = document.querySelector(".weatherForecast");
let errorContainer = document.querySelector(".errorContainer");
let NoInternetContainer = document.querySelector(".NoInternetContainer");
let city = document.querySelector("#city");
let image = document.querySelector("#image");
let temp = document.querySelector("#temp");
let feel_like = document.querySelector("#feel_like");
let cloud = document.querySelector(".cloud");
let textCondition = document.querySelector("#mainText");
let humidity = document.querySelector(".humidity");
let windSpeed = document.querySelector(".wind");
let form = document.querySelector("#mainForm");
let todayWeather = document.querySelectorAll('.TodayWeatherCard');
let weeklyWeather = document.querySelectorAll('.dailyWeatherCard');

let baseUrl =
    "https://api.weatherapi.com/v1/forecast.json?key=3b9cf1644e1843b1a4951443240208&days=7&q=";

function getDayName(index) {
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        if (index >= 0 && index < 7) {
            return daysOfWeek[index];
        } else {
            return "Invalid index"; // For indexes outside the range of 0-6
        }
}


async function getWeather(newCity) {
    let newUrl = `${baseUrl}${newCity}`;
    let response = await fetch(newUrl);
    if (response.status <= 210) {
        let data = await response.json();
        console.log(data);
        let forecastData = data.forecast.forecastday;
        let i = 0;
        for (const value of forecastData) {
                let datestamp = new Date(value.date);
                let day = getDayName(datestamp.getDay());
                // console.log(value.date);
                weeklyWeather[i].children[0].innerText = day;
                weeklyWeather[i].children[1].src = value.day.condition.icon;
                weeklyWeather[i].children[2].innerText = value.day.condition.text;
                weeklyWeather[i].children[3].innerHTML = `${Math.round(value.day.maxtemp_c)}<sup>°C</sup> / ${Math.round(value.day.mintemp_c)}<sup>°C</sup>`;
                // console.log('\n');
                i++;
        }
        let j = 1;
        for (const element of todayWeather) {
            // console.log(data.forecast.forecastday[0].hour[j]);
            element.children[1].src = data.forecast.forecastday[0].hour[j].condition.icon;
            element.children[2].innerHTML = `${Math.round(data.forecast.forecastday[0].hour[j].temp_c)}<sup>°</sup>`;
            j+=3;
        }
        // console.log(todayWeather);
        
        city.innerText = `${data.location.name}, ${data.location.region}, ${data.location.country}`;
        image.src = data.current.condition.icon;
        temp.innerHTML = `${Math.round(
            data.current.temp_c
        )}<sup class="degSign">°C</sup>`;
        feel_like.innerHTML = `Feels like ${Math.round(
            data.current.feelslike_c
        )}<sup class="">°C</sup>`;
        cloud.innerText = cloudCondition(data.current.cloud);
        textCondition.innerText = data.current.condition.text;
        humidity.innerHTML = `Humidity  <i class="fa-solid fa-droplet"></i>&nbsp;  -  &nbsp;${data.current.humidity}%`;
        windSpeed.innerHTML = `Wind <i class="fa-solid fa-wind"></i>&nbsp; | &nbsp;${winDirection(
            data.current.wind_dir
        )}, &nbsp;${Math.round(data.current.wind_kph)}kph`;
        outputContainer.style.display = "flex";
        forcastContainer.style.display = "flex";
        errorContainer.style.display = "none";
    } else {
        outputContainer.style.display = "none";
        forcastContainer.style.display = "none";
        errorContainer.style.display = "flex";
    }
}

let winDirection = (dir) => {
    if (dir === "N") {
        return "North";
    } else if (dir === "S") {
        return "South";
    } else if (dir === "W") {
        return "West";
    } else if (dir === "E") {
        return "East";
    } else if (dir === "NNE") {
        return "North-northeast";
    } else if (dir === "NE") {
        return "northEast";
    } else if (dir === "ENE") {
        return "East-northeast";
    } else if (dir === "ESE") {
        return "East-southeast";
    } else if (dir === "SE") {
        return "southeast";
    } else if (dir === "SSE") {
        return "South-southeast";
    } else if (dir === "SSW") {
        return "South-southwest";
    } else if (dir === "SW") {
        return "southwest";
    } else if (dir === "WSW") {
        return "West-southwest";
    } else if (dir === "WNW") {
        return "West-northwest";
    } else if (dir === "NW") {
        return "northwest";
    } else if (dir === "NNW") {
        return "North-northwest";
    }
};

let cloudCondition = (cloudPercentage) => {
    if (cloudPercentage <= 10) {
        return "Clear";
    } else if (cloudPercentage <= 30) {
        return "Mostly Clear";
    } else if (cloudPercentage <= 50) {
        return "Partly Cloudy";
    } else if (cloudPercentage <= 70) {
        return "Mostly Cloudy";
    } else {
        return "Cloudy";
    }
};

let fetchWeather = (e) => {
    e.preventDefault();
    if (e.target[0].value !== "") {
        let newCity = e.target[0].value;
        if (window.navigator.onLine) {
            getWeather(newCity);
            NoInternetContainer.style.display = "none";
            if (document.getElementById('empty') != null) {
                document.getElementById('empty').remove();
            }
        } else {
            // console.log("offline");
            if (document.getElementById('empty') != null) {
                document.getElementById('empty').remove();
            }
            outputContainer.style.display = "none";
            forcastContainer.style.display = "none";
            errorContainer.style.display = "none";
            NoInternetContainer.style.display = "flex";
        }
    } else {
        if (document.getElementById('empty') == null) {

            let newEL = document.createElement('p');
            newEL.innerText = "Please Enter a City to Find Weather";
            newEL.classList.add('noInternetErrorText');
            newEL.setAttribute('id', 'empty');
            currentWeather.append(newEL);
            outputContainer.style.display = "none";
            forcastContainer.style.display = "none";
            errorContainer.style.display = "none";
            NoInternetContainer.style.display = "none";
        }
    }
};

form.addEventListener("submit", (e) => {
    fetchWeather(e);
});

