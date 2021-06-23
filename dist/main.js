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

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ (() => {

eval("\n\nasync function getWeather() {\n  try {\n    const data = await fetch(\n      \"http://api.openweathermap.org/data/2.5/weather?q=San Jose&appid=6338a3cdeb83d79432461f4b42b4df2c\",\n      { mode: \"cors\" }\n    );\n    const dataObj = await data.json();\n    const { lon, lat } = await dataObj.coord;\n    console.log(`lon:${lon}`, `lat:${lat}`);\n    const fulldata = await fetch(\n      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=6338a3cdeb83d79432461f4b42b4df2c`\n    );\n    const fulldataObj = await fulldata.json();\n    console.log(fulldataObj);\n  } catch (err) {\n    alert(\"error:\", err);\n  }\n}\n\ngetWeather();\n\n\n//# sourceURL=webpack://project-weather-app/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.js"]();
/******/ 	
/******/ })()
;