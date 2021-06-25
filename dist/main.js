/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/config.js":
/*!***********************!*\
  !*** ./src/config.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"config\": () => (/* binding */ config)\n/* harmony export */ });\nconst config = {\n  MY_API_TOKEN: \"6338a3cdeb83d79432461f4b42b4df2c\",\n};\n\n\n\n\n//# sourceURL=webpack://project-weather-app/./src/config.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config.js */ \"./src/config.js\");\n\n\n\nconst key = _config_js__WEBPACK_IMPORTED_MODULE_0__.config.MY_API_TOKEN;\n\nconst searchBtn = document.querySelector(\"#search-btn\");\nconst searchInput = document.querySelector(\"#search-input\");\nconst dailyForecastCont = document.querySelector(\".daily-forecast-container\");\nconst hourlyForecastCont = document.querySelector(\".hourly-forecast-container\");\nconst forecastTitle = document.querySelector(\"#forecast-title\");\nconst dailyBtn = document.querySelector(\"#daily-btn\");\nconst hourlyBtn = document.querySelector(\"#hourly-btn\");\n\nconst searchFn = () => {\n  if (searchInput.value === \"\") {\n    //do nothing\n  } else {\n    getCurrentWeather(searchInput.value);\n    dailyForecastCont.innerHTML = \"\";\n    hourlyForecastCont.innerHTML = \"\";\n    getForecast(searchInput.value);\n  }\n};\n\nconst getCurrentWeather = async function (location) {\n  try {\n    const data = await fetch(\n      `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${key}`\n    );\n    const dataObj = await data.json();\n    // Grabbing data for display\n    const { name, dt, main, weather, wind, sys } = dataObj;\n    const { feels_like, humidity, temp, temp_max, temp_min } = main;\n    // Edit Data for display\n    const todayDate = new Date(dt * 1000).toLocaleString();\n    let currentWeather = weather[0].main;\n    const windSpeed = wind.speed;\n    const country = sys.country;\n    const src = getSrc(currentWeather);\n\n    // HTML Elements\n    const locationEl = document.querySelector(\"#location\");\n    const weatherEl = document.querySelector(\"#weather\");\n    const dateEl = document.querySelector(\"#today-date\");\n    const tempEl = document.querySelector(\"#temperature\");\n    const tempLowEl = document.querySelector(\"#temp-low\");\n    const tempHighEl = document.querySelector(\"#temp-high\");\n    const feelLikeEl = document.querySelector(\"#today-feel-like\");\n    const humidityEL = document.querySelector(\"#today-humidity\");\n    const windSpeedEl = document.querySelector(\"#today-wind-speed\");\n    const imgEl = document.querySelector(\"#today-img\");\n\n    // Setting values for HTML Elements\n    locationEl.textContent = `${name}, ${country}`;\n    weatherEl.textContent = currentWeather;\n    dateEl.textContent = todayDate;\n    tempEl.textContent = `${Math.trunc(temp)}°F`;\n    tempLowEl.textContent = `${Math.trunc(temp_min)}°F`;\n    tempHighEl.textContent = `${Math.trunc(temp_max)}°F`;\n    feelLikeEl.textContent = `${Math.trunc(feels_like)}°F`;\n    humidityEL.textContent = `${humidity}%`;\n    windSpeedEl.textContent = `${windSpeed} mph`;\n    imgEl.setAttribute(\"src\", `${src}`);\n  } catch (err) {\n    console.error(\"error:\", err);\n  }\n};\n\n//// forecast (daily-hourly) async function ////\nconst getForecast = async function (location) {\n  const dailyForecastDiv = document.querySelector(\".daily-forecast-container\");\n  const hourlyForecastDiv = document.querySelector(\n    \".hourly-forecast-container\"\n  );\n  try {\n    const data = await fetch(\n      `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${key}`\n    );\n    const dataObj = await data.json();\n    const { lon, lat } = dataObj.coord;\n    const fulldata = await fetch(\n      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=imperial&appid=6338a3cdeb83d79432461f4b42b4df2c`\n    );\n    const fulldataObj = await fulldata.json();\n\n    //// daily forecast ////\n    const dailyForecastData = fulldataObj.daily.slice(1);\n    dailyForecastData.forEach((day) => {\n      const {\n        dt,\n        temp: { min: minTemp, max: maxTemp },\n        weather,\n      } = day;\n\n      let date = new Date(dt * 1000).getDay();\n      date = convertDay(date);\n\n      const dailyWeather = weather[0].main;\n\n      const src = getSrc(dailyWeather);\n\n      dailyForecastDiv.insertAdjacentHTML(\n        \"beforeend\",\n        `<div>\n        <p>${date}</p>\n        <p>H: ${Math.trunc(maxTemp)}°F</p>\n        <p>L: ${Math.trunc(minTemp)}°F</p>\n        <img class='daily-img' style='width: 50px; height: 50px' src='${src}'>\n       </div>`\n      );\n    });\n\n    //// hourly forecast ////\n    const hourlyForecast = fulldataObj.hourly.slice(1, 24);\n\n    hourlyForecast.forEach((arrData) => {\n      const { dt, temp, weather } = arrData;\n\n      let hour = new Date(dt * 1000).getHours();\n      hour = convertHours(hour);\n\n      const hourlyWeather = weather[0].main;\n\n      const hourlyTemp = Math.trunc(temp);\n\n      const src = getSrc(hourlyWeather);\n\n      hourlyForecastDiv.insertAdjacentHTML(\n        \"beforeend\",\n        `<div>\n          <p>${hour}</p>\n          <p>${hourlyTemp}°F</p>\n          <img class='daily-img' style='width: 50px; height: 50px' src='${src}'>\n         </div>`\n      );\n    });\n  } catch (err) {\n    console.error(\"error\", err);\n  }\n};\n\nconst convertDay = function (date) {\n  if (date === 0) {\n    date = \"Sunday\";\n    return date;\n  } else if (date === 1) {\n    date = \"Monday\";\n    return date;\n  } else if (date === 2) {\n    date = \"Tuesday\";\n    return date;\n  } else if (date === 3) {\n    date = \"Wednesday\";\n    return date;\n  } else if (date === 4) {\n    date = \"Thursday\";\n    return date;\n  } else if (date === 5) {\n    date = \"Friday\";\n    return date;\n  } else {\n    date = \"Saturday\";\n    return date;\n  }\n};\n\nconst convertHours = function (hour) {\n  if (hour < 12) {\n    if (hour === 0) {\n      hour = `12 am`;\n      return hour;\n    } else {\n      hour = `${hour} am`;\n      return hour;\n    }\n  } else {\n    if (hour === 12) {\n      hour = `${hour} pm`;\n      return hour;\n    } else {\n      hour = `${hour - 12} pm`;\n      return hour;\n    }\n  }\n};\n\nconst getSrc = function (weather, src) {\n  if (/[cC]loud/.test(weather)) {\n    src = \"img/cloud.png\";\n    return src;\n  } else if (/[rR]ain/.test(weather)) {\n    src = \"img/rain.png\";\n    return src;\n  } else if (/[sS]now/.test(weather)) {\n    src = \"img/snow.png\";\n    return src;\n  } else if (/[sS]unny/.test(weather) || /[cC]lear/.test(weather)) {\n    src = \"img/sunny.png\";\n    return src;\n  }\n};\n\nsearchBtn.addEventListener(\"click\", (e) => {\n  e.preventDefault();\n  searchFn();\n});\n\nsearchInput.addEventListener(\"keydown\", (e) => {\n  if (e.keyCode === 13) {\n    searchFn(searchInput.value);\n  }\n});\n\ndailyBtn.addEventListener(\"click\", () => {\n  dailyForecastCont.classList.remove(\"hidden\");\n  hourlyForecastCont.classList.add(\"hidden\");\n  dailyBtn.style.border = \"2px solid white\";\n  hourlyBtn.style.border = \"none\";\n  forecastTitle.textContent = \"7 Day Forecast\";\n});\n\nhourlyBtn.addEventListener(\"click\", () => {\n  hourlyForecastCont.classList.remove(\"hidden\");\n  dailyForecastCont.classList.add(\"hidden\");\n  hourlyBtn.style.border = \"2px solid white\";\n  dailyBtn.style.border = \"none\";\n  forecastTitle.textContent = \"Hourly Forecast\";\n});\n\ngetCurrentWeather(\"San Jose,US-CA\");\ngetForecast(\"San Jose,US-CA\");\n\n\n//# sourceURL=webpack://project-weather-app/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;