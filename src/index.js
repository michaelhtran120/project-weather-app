"use strict";

async function getWeather() {
  try {
    const data = await fetch(
      "http://api.openweathermap.org/data/2.5/weather?q=San Jose&appid=6338a3cdeb83d79432461f4b42b4df2c",
      { mode: "cors" }
    );
    const dataObj = await data.json();
    const { lon, lat } = await dataObj.coord;
    console.log(`lon:${lon}`, `lat:${lat}`);
    const fulldata = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=6338a3cdeb83d79432461f4b42b4df2c`
    );
    const fulldataObj = await fulldata.json();
    console.log(fulldataObj);
  } catch (err) {
    console.error("error:", err);
  }
}

getWeather();
