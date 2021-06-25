"use strict";
import { config } from "./config.js";

const key = config.MY_API_TOKEN;

const searchBtn = document.querySelector("#search-btn");
const searchInput = document.querySelector("#search-input");
const dailyForecastCont = document.querySelector(".daily-forecast-container");
const hourlyForecastCont = document.querySelector(".hourly-forecast-container");
const forecastTitle = document.querySelector("#forecast-title");
const dailyBtn = document.querySelector("#daily-btn");
const hourlyBtn = document.querySelector("#hourly-btn");

const searchFn = () => {
  if (searchInput.value === "") {
    //do nothing
  } else {
    getCurrentWeather(searchInput.value);
    dailyForecastCont.innerHTML = "";
    hourlyForecastCont.innerHTML = "";
    getForecast(searchInput.value);
  }
};

const getCurrentWeather = async function (location) {
  try {
    const data = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${key}`
    );
    const dataObj = await data.json();
    // Grabbing data for display
    const { name, dt, main, weather, wind, sys } = dataObj;
    const { feels_like, humidity, temp, temp_max, temp_min } = main;
    // Edit Data for display
    const todayDate = new Date(dt * 1000).toLocaleString();
    let currentWeather = weather[0].main;
    const windSpeed = wind.speed;
    const country = sys.country;
    const src = getSrc(currentWeather);

    // HTML Elements
    const locationEl = document.querySelector("#location");
    const weatherEl = document.querySelector("#weather");
    const dateEl = document.querySelector("#today-date");
    const tempEl = document.querySelector("#temperature");
    const tempLowEl = document.querySelector("#temp-low");
    const tempHighEl = document.querySelector("#temp-high");
    const feelLikeEl = document.querySelector("#today-feel-like");
    const humidityEL = document.querySelector("#today-humidity");
    const windSpeedEl = document.querySelector("#today-wind-speed");
    const imgEl = document.querySelector("#today-img");

    // Setting values for HTML Elements
    locationEl.textContent = `${name}, ${country}`;
    weatherEl.textContent = currentWeather;
    dateEl.textContent = todayDate;
    tempEl.textContent = `${Math.trunc(temp)}°F`;
    tempLowEl.textContent = `${Math.trunc(temp_min)}°F`;
    tempHighEl.textContent = `${Math.trunc(temp_max)}°F`;
    feelLikeEl.textContent = `${Math.trunc(feels_like)}°F`;
    humidityEL.textContent = `${humidity}%`;
    windSpeedEl.textContent = `${windSpeed} mph`;
    imgEl.setAttribute("src", `${src}`);
  } catch (err) {
    console.error("error:", err);
  }
};

//// forecast (daily-hourly) async function ////
const getForecast = async function (location) {
  const dailyForecastDiv = document.querySelector(".daily-forecast-container");
  const hourlyForecastDiv = document.querySelector(
    ".hourly-forecast-container"
  );
  try {
    const data = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${key}`
    );
    const dataObj = await data.json();
    const { lon, lat } = dataObj.coord;
    const fulldata = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=imperial&appid=6338a3cdeb83d79432461f4b42b4df2c`
    );
    const fulldataObj = await fulldata.json();

    //// daily forecast ////
    const dailyForecastData = fulldataObj.daily.slice(1);
    dailyForecastData.forEach((day) => {
      const {
        dt,
        temp: { min: minTemp, max: maxTemp },
        weather,
      } = day;

      let date = new Date(dt * 1000).getDay();
      date = convertDay(date);

      const dailyWeather = weather[0].main;

      const src = getSrc(dailyWeather);

      dailyForecastDiv.insertAdjacentHTML(
        "beforeend",
        `<div>
        <p>${date}</p>
        <p>H: ${Math.trunc(maxTemp)}°F</p>
        <p>L: ${Math.trunc(minTemp)}°F</p>
        <img class='daily-img' style='width: 50px; height: 50px' src='${src}'>
       </div>`
      );
    });

    //// hourly forecast ////
    const hourlyForecast = fulldataObj.hourly.slice(1, 24);

    hourlyForecast.forEach((arrData) => {
      const { dt, temp, weather } = arrData;

      let hour = new Date(dt * 1000).getHours();
      hour = convertHours(hour);

      const hourlyWeather = weather[0].main;

      const hourlyTemp = Math.trunc(temp);

      const src = getSrc(hourlyWeather);

      hourlyForecastDiv.insertAdjacentHTML(
        "beforeend",
        `<div>
          <p>${hour}</p>
          <p>${hourlyTemp}°F</p>
          <img class='daily-img' style='width: 50px; height: 50px' src='${src}'>
         </div>`
      );
    });
  } catch (err) {
    console.error("error", err);
  }
};

const convertDay = function (date) {
  if (date === 0) {
    date = "Sunday";
    return date;
  } else if (date === 1) {
    date = "Monday";
    return date;
  } else if (date === 2) {
    date = "Tuesday";
    return date;
  } else if (date === 3) {
    date = "Wednesday";
    return date;
  } else if (date === 4) {
    date = "Thursday";
    return date;
  } else if (date === 5) {
    date = "Friday";
    return date;
  } else {
    date = "Saturday";
    return date;
  }
};

const convertHours = function (hour) {
  if (hour < 12) {
    if (hour === 0) {
      hour = `12 am`;
      return hour;
    } else {
      hour = `${hour} am`;
      return hour;
    }
  } else {
    if (hour === 12) {
      hour = `${hour} pm`;
      return hour;
    } else {
      hour = `${hour - 12} pm`;
      return hour;
    }
  }
};

const getSrc = function (weather, src) {
  if (/[cC]loud/.test(weather)) {
    src = "img/cloud.png";
    return src;
  } else if (/[rR]ain/.test(weather)) {
    src = "img/rain.png";
    return src;
  } else if (/[sS]now/.test(weather)) {
    src = "img/snow.png";
    return src;
  } else if (/[sS]unny/.test(weather) || /[cC]lear/.test(weather)) {
    src = "img/sunny.png";
    return src;
  }
};

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  searchFn();
});

searchInput.addEventListener("keydown", (e) => {
  if (e.keyCode === 13) {
    searchFn(searchInput.value);
  }
});

dailyBtn.addEventListener("click", () => {
  dailyForecastCont.classList.remove("hidden");
  hourlyForecastCont.classList.add("hidden");
  dailyBtn.style.border = "2px solid white";
  hourlyBtn.style.border = "none";
  forecastTitle.textContent = "7 Day Forecast";
});

hourlyBtn.addEventListener("click", () => {
  hourlyForecastCont.classList.remove("hidden");
  dailyForecastCont.classList.add("hidden");
  hourlyBtn.style.border = "2px solid white";
  dailyBtn.style.border = "none";
  forecastTitle.textContent = "Hourly Forecast";
});

getCurrentWeather("San Jose,US-CA");
getForecast("San Jose,US-CA");
