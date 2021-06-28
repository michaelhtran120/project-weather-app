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
    const cTemp = Math.trunc(celsiusConversion(temp));

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
    const celsiusConvBtn = document.querySelector("#fToc-btn");
    const farenheitConvBtn = document.querySelector("#cTof-btn");

    // Setting values for HTML Elements
    locationEl.textContent = `${name}, ${country}`;
    weatherEl.textContent = currentWeather;
    dateEl.textContent = todayDate;
    humidityEL.textContent = `${humidity}%`;
    windSpeedEl.textContent = `${windSpeed} mph`;
    imgEl.setAttribute("src", `${src}`);
    if (celsiusConvBtn.classList.contains("active-temp")) {
      tempEl.textContent = `${Math.trunc(celsiusConversion(temp))}°C`;
      tempLowEl.textContent = `${Math.trunc(celsiusConversion(temp_min))}°C`;
      tempHighEl.textContent = `${Math.trunc(celsiusConversion(temp_max))}°C`;
      feelLikeEl.textContent = `${Math.trunc(celsiusConversion(feels_like))}°C`;
    } else {
      tempEl.textContent = `${Math.trunc(temp)}°F`;
      tempLowEl.textContent = `${Math.trunc(temp_min)}°F`;
      tempHighEl.textContent = `${Math.trunc(temp_max)}°F`;
      feelLikeEl.textContent = `${Math.trunc(feels_like)}°F`;
    }

    // Button event listener
    celsiusConvBtn.addEventListener("click", (e) => {
      tempEl.textContent = `${cTemp}°C`;
      tempLowEl.textContent = `${Math.trunc(celsiusConversion(temp_min))}°C`;
      tempHighEl.textContent = `${Math.trunc(celsiusConversion(temp_max))}°C`;
      feelLikeEl.textContent = `${Math.trunc(celsiusConversion(feels_like))}°C`;
    });

    farenheitConvBtn.addEventListener("click", () => {
      tempEl.textContent = `${Math.trunc(temp)}°F`;
      tempLowEl.textContent = `${Math.trunc(temp_min)}°F`;
      tempHighEl.textContent = `${Math.trunc(temp_max)}°F`;
      feelLikeEl.textContent = `${Math.trunc(feels_like)}°F`;
    });
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
  const celsiusConvBtn = document.querySelector("#fToc-btn");
  const farenheitConvBtn = document.querySelector("#cTof-btn");

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

      // Element creation
      const dailyDiv = document.createElement("div");
      const dateP = document.createElement("p");
      const maxTempP = document.createElement("p");
      const minTempP = document.createElement("p");
      const dailyImg = document.createElement("img");

      //Setting element values and style
      dateP.textContent = `${date}`;
      dailyImg.setAttribute("src", `${src}`);
      dailyImg.style.width = "50px";
      dailyImg.style.height = "50px";
      dailyImg.classList = "daily-img";
      maxTempP.classList = "maxTempP";
      minTempP.classList = "minTempP";

      if (celsiusConvBtn.classList.contains("active-temp")) {
        maxTempP.textContent = `H: ${Math.trunc(celsiusConversion(maxTemp))}°C`;
        minTempP.textContent = `L: ${Math.trunc(celsiusConversion(minTemp))}°C`;
      } else {
        maxTempP.textContent = `H: ${Math.trunc(maxTemp)}°F`;
        minTempP.textContent = `L: ${Math.trunc(minTemp)}°F`;
      }
      // Appending elements
      dailyDiv.appendChild(dateP);
      dailyDiv.appendChild(maxTempP);
      dailyDiv.appendChild(minTempP);
      dailyDiv.appendChild(dailyImg);
      dailyForecastDiv.appendChild(dailyDiv);
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

      // Element creation
      const hourlyDiv = document.createElement("div");
      const timeP = document.createElement("p");
      const hourlyTempP = document.createElement("p");
      const hourlyImg = document.createElement("img");

      // Setting value and style...etc
      timeP.textContent = `${hour}`;
      hourlyTempP.textContent = `${hourlyTemp}°F`;
      hourlyImg.setAttribute("src", `${src}`);
      hourlyImg.style.width = "50px";
      hourlyImg.style.height = "50px";
      hourlyTempP.classList = "hourlyTemp";

      if (celsiusConvBtn.classList.contains("active-temp")) {
        hourlyTempP.textContent = `${Math.trunc(
          celsiusConversion(hourlyTemp)
        )}°C`;
      } else {
        hourlyTempP.textContent = `${hourlyTemp}°F`;
      }

      hourlyDiv.appendChild(timeP);
      hourlyDiv.appendChild(hourlyTempP);
      hourlyDiv.appendChild(hourlyImg);

      hourlyForecastDiv.append(hourlyDiv);
    });

    celsiusConvBtn.addEventListener("click", () => {
      if (celsiusConvBtn.classList.contains("active-temp")) {
        //do nothing
      } else {
        const maxTempPEl = document.querySelectorAll(".maxTempP");
        const minTempPEl = document.querySelectorAll(".minTempP");
        const hourlyTempPEl = document.querySelectorAll(".hourlyTemp");
        maxTempPEl.forEach((el) => {
          const text = el.textContent;
          const tempNumber = Number(text.match(/[0-9]{1,2}/));
          el.textContent = `H: ${Math.trunc(celsiusConversion(tempNumber))}°C`;
        });
        minTempPEl.forEach((el) => {
          const text = el.textContent;
          const tempNumber = Number(text.match(/[0-9]{1,2}/));
          el.textContent = `L: ${Math.trunc(celsiusConversion(tempNumber))}°C`;
        });
        hourlyTempPEl.forEach((el) => {
          const text = el.textContent;
          const tempNumber = Number(text.match(/[0-9]{1,2}/));
          el.textContent = `${Math.trunc(celsiusConversion(tempNumber))}°C`;
        });

        celsiusConvBtn.classList.add("active-temp");
        farenheitConvBtn.classList.remove("active-temp");
      }
    });

    farenheitConvBtn.addEventListener("click", () => {
      if (farenheitConvBtn.classList.contains("active-temp")) {
        //do nothing
      } else {
        const maxTempPEl = document.querySelectorAll(".maxTempP");
        const minTempPEl = document.querySelectorAll(".minTempP");
        const hourlyTempPEl = document.querySelectorAll(".hourlyTemp");

        for (let i = 0; i < dailyForecastData.length; i++) {
          const {
            temp: { min: minTemp, max: maxTemp },
          } = dailyForecastData[i];
          maxTempPEl[i].textContent = `H: ${Math.trunc(maxTemp)}°F`;
          minTempPEl[i].textContent = `L: ${Math.trunc(minTemp)}•F`;
        }

        for (let i = 0; i < hourlyForecast.length; i++) {
          const { temp } = hourlyForecast[i];
          hourlyTempPEl[i].textContent = `${Math.trunc(temp)}°F`;
        }

        celsiusConvBtn.classList.remove("active-temp");
        farenheitConvBtn.classList.add("active-temp");
      }
    });

    //
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

const celsiusConversion = function (temp) {
  return (temp - 32) * (5 / 9);
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
