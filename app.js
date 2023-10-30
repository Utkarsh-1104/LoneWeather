const express  = require("express");
const bodyParser = require("body-parser");
require('dotenv').config()

const API_KEY = process.env.API_KEY;
const app = express();
app.use(bodyParser.urlencoded({extended: true}));

let location
let lat, lon;

app.get("/", async (req, res) => {
  res.sendFile(__dirname + "/index.html")  
});

app.post("/", (req, res) => {
  
  location = req.body.city
  //------------------Geocoding API------------------
  const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?appid=${API_KEY}&q=${location}`;
  async function geoCode() {
    const response = await fetch(geoUrl)
    const geoData = await response.json()
    lat = await geoData[0].lat
    lon = await geoData[0].lon

    //------------------Weather API------------------
    async function weather() {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
      const response = await fetch(weatherUrl)  
      const weatherData = await response.json()
      const temp = weatherData.main.temp
      const feels_like = weatherData.main.feels_like
      const main = weatherData.weather[0].main
      const description = weatherData.weather[0].description
      const icon = weatherData.weather[0].icon
      console.log(temp, feels_like, main, description, icon)
      const img = `http://openweathermap.org/img/w/${icon}.png`

      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Weather App</title>
            <style>
              body {
                background-image: url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e');
                background-image: url('https://images.unsplash.com/photo-1694458116028-57018f185893?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
                background-size: cover;
                font-family: Arial, sans-serif;
                color: #fff;
                text-align: center;
                width: 100%;
                height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                overflow: hidden;
              }
              h1 {
                font-family: Arial, sans-serif;
                font-size: 4rem;
                color: #fff;
                text-align: center;
                text-shadow: 2.5px 2.5px #FEAB86;
                // font-size: 3rem;
                margin-top: 2rem;
              }
              h2 {
                font-size: 2rem;
                margin-top: 1rem;
                text-transform: capitalize;
              }
              img {
                display: block;
                margin: 0 auto;
                margin-top: 2rem;
              }
            </style>
          </head>
          <body>
          <div>
            <h1>Lone Weather App</h1>
            <h2>Location: ${location}</h2>
            <h2>Temperature: ${temp}°C</h2>
            <h2>Feels Like: ${feels_like}°C</h2>
            <h2>Weather: ${main}</h2>
            <h2>Description: ${description}</h2>
            <img src=${img} alt="weather-icon">
          </div>
          </body>
        </html>
      `)
    }
    weather()
  }
  geoCode()
})

app.listen(4000, () => {
    console.log("Server running on http://localhost:4000")  
})