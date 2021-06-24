"use strict";
import { config } from "./config.js";

const key = config.MY_API_TOKEN;

const searchBtn = document.querySelector("#search-btn");
const searchInput = document.querySelector("#search-input");
const forecastDiv = document.querySelector("#forecast-area");

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  searchFn();
});

searchInput.addEventListener("keydown", (e) => {
  if (e.keyCode === 13) {
    searchFn(searchInput.value);
  }
});

const searchFn = () => {
  if (searchInput.value === "") {
    //do nothing
  } else {
    getCurrentWeather(searchInput.value);
    forecastDiv.innerHTML = "";
    getForecast(searchInput.value);
  }
};

const getCurrentWeather = async function (location) {
  try {
    const data = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${key}`,
      { mode: "cors" }
    );
    const dataObj = await data.json();
    // Grabbing data for display
    const { name, dt, main, weather, wind, sys } = dataObj;
    const { feels_like, humidity, temp, temp_max, temp_min } = main;
    // Edit Data for display
    const todayDate = new Date(dt * 1000).toLocaleString();
    const currentWeather = weather[0].description;
    const windSpeed = wind.speed;
    const country = sys.country;

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

    // Setting values for HTML Elements
    locationEl.textContent = `${name}, ${country}`;
    weatherEl.textContent = currentWeather;
    dateEl.textContent = todayDate;
    tempEl.textContent = `${Math.trunc(temp)}°F`;
    tempLowEl.textContent = `${Math.trunc(temp_min)}F°`;
    tempHighEl.textContent = `${Math.trunc(temp_max)}°F`;
    feelLikeEl.textContent = `${Math.trunc(feels_like)}°F`;
    humidityEL.textContent = `${humidity}%`;
    windSpeedEl.textContent = `${windSpeed} mph`;
  } catch (err) {
    console.error("error:", err);
  }
};

const getForecast = async function (location) {
  const forecastDiv = document.querySelector("#forecast-area");
  try {
    const data = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${key}`,
      { mode: "cors" }
    );
    const dataObj = await data.json();
    const { lon, lat } = dataObj.coord;
    const fulldata = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=imperial&appid=6338a3cdeb83d79432461f4b42b4df2c`
    );
    const fulldataObj = await fulldata.json();
    const dailyForecast = fulldataObj.daily.slice(1);
    dailyForecast.forEach((day) => {
      const {
        dt,
        temp: { min: minTemp, max: maxTemp },
        weather,
      } = day;
      const date2 = new Date(dt * 1000).toLocaleString();
      let date = new Date(dt * 1000).getDay();

      date = convertDay(date);

      const dailyWeather = weather[0].main;

      forecastDiv.insertAdjacentHTML(
        "beforeend",
        `<div>
        <p>${date}</p>
        <p>H: ${maxTemp}</p>
        <p>L: ${minTemp}</p>
        <p> ${dailyWeather}</p>
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

getCurrentWeather("San Jose,US-CA");
getForecast("San Jose,US-CA");
