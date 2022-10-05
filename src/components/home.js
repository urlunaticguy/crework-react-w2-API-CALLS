import React, { useState } from "react";
import "./styles/home.css";
import axios from "axios";
import clouds from "../assets/Weather-Background-Clouds.mp4";
import clearSkies from "../assets/BgVideo - Clear.mp4";
import drizzleSkies from "../assets/bgvideo - rain.mp4";
import rainySkies from "../assets/bgvideo - heavy rain.mp4";
import thunderSkies from "../assets/bgVideo - thunderstorm.mp4";
import snowySkies from "../assets/bgVideo - snow.mp4";
import fogSkies from "../assets/video - fog.mp4";
import tornadoSkies from "../assets/bgvideo - tornado.mp4";
import hazeSkies from "../assets/bgVideo - haze.mp4";
import defaultVideo from "../assets/default bg.mp4";

let name = "",
  temp = 0,
  feelsTemp = 0,
  weatherDescription = "",
  weatherDescImg = "",
  cloudCover = 0,
  rain = 0,
  videoTaggerx = "",
  humidity = 0;

//Not a UI function
function convertKelvinToCelsius(x) {
  let answer = (x - 273.15).toFixed(2);
  return answer;
}

function capitalizeEachWord(ss) {
  let arr = ss.split(" ");
  let newString = "";
  for (let i = 0; i < arr.length; i++) {
    newString += arr[i][0].toUpperCase() + arr[i].slice(1) + " ";
  }
  return newString;
}

//UI function
function SelectLocationDiv() {
  return (
    <div className="selectLocationDiv">
      <h1 className="title">Weather App</h1>
      <h3>Enter city / town / village</h3>
      <input id="city" />
      <h3>Enter your State / Country (optional)</h3>
      <input id="country" />
    </div>
  );
}

//UI function
function ShowWeatherDiv() {
  return (
    <div className="showWeatherDiv">
      {/* <div className="row"> */}
      <label className="name-label">{name}</label>
      <label className="temp-label">{temp}º</label>
      {/* </div> */}
      <label className="rows-common">{weatherDescription}</label>
      <label className="rows-common">Feels {feelsTemp}º</label>
      <label className="rows-common">Humidity {humidity}%</label>
      <label className="rows-common">Cloud Cover {cloudCover}%</label>
      <label className="rows-common">{rain}mm rain in the last hour</label>
      <div className="img-holder">
        <img
          className="weather-img"
          src={weatherDescImg}
          alt="Weather Description Image"
        />
      </div>
    </div>
  );
}

//flagship functional component
function Home() {
  let lat = 0.0,
    lon = 0.0;
  const [counter, setCounter] = useState(0);
  const [content, setContent] = useState(<SelectLocationDiv />);
  const [switchButtonText, setSwitchButtonText] = useState("Get Weather");
  const [videoo, setVideo] = useState(defaultVideo);

  //method to call api to fetch weather
  const callOpenWeather = (latt, long) => {
    const apiKey = `fee562c65e1b808062ddacd66e2ddb2a`;
    let urll = `https://api.openweathermap.org/data/2.5/weather?lat=${latt}&lon=${long}&appid=${apiKey}`;
    axios.get(urll).then((res) => {
      console.log(res.data);
      temp = convertKelvinToCelsius(res.data.main.temp);
      feelsTemp = convertKelvinToCelsius(res.data.main.feels_like);
      weatherDescription = capitalizeEachWord(res.data.weather[0].description);
      weatherDescImg = `https://openweathermap.org/img/wn/${res.data.weather[0].icon}@4x.png`;
      cloudCover = res.data.clouds.all;
      videoTaggerx = res.data.weather[0].main;
      humidity = res.data.main.humidity;
      if (videoTaggerx === "Clouds") {
        setVideo(clouds);
      } else if (videoTaggerx === "Clear") {
        setVideo(clearSkies);
      } else if (videoTaggerx === "Rain") {
        setVideo(rainySkies);
      } else if (videoTaggerx === "Drizzle") {
        setVideo(drizzleSkies);
      } else if (videoTaggerx === "Thunderstorm") {
        setVideo(thunderSkies);
      } else if (videoTaggerx === "Snow") {
        setVideo(snowySkies);
      } else if (videoTaggerx === "Haze") {
        setVideo(hazeSkies);
      } else if (videoTaggerx === "Tornado") {
        setVideo(tornadoSkies);
      } else if (videoTaggerx === "Fog") {
        setVideo(fogSkies);
      } else if (videoTaggerx === "") {
        setVideo();
      }
      if (humidity === null) {
        humidity = 0;
      }
      if (cloudCover === null) {
        cloudCover = 0;
      }
      if (res.data.rain !== undefined) {
        rain = res.data.rain["1h"];
      }
    });
  };

  const switchButtonHandler = () => {
    if (counter === 0) {
      let xx =
        document.querySelector("#city").value +
        " " +
        document.querySelector("#country").value;
      let geocodeURL = `https://api.positionstack.com/v1/forward?access_key=566726bdc3507f40e66f1bd129d77a8b&query=${xx}`;
      axios
        //calling api to fetch latitude and longitude from user input
        .get(geocodeURL)
        .then((res) => {
          lat = res.data.data[0].latitude;
          lon = res.data.data[0].longitude;
          if (res.data.data[0].region !== null) {
            callOpenWeather(lat, lon);
            name = res.data.data[0].name;
            setTimeout(() => {
              //give 3 seconds delay for the api to load
              setContent(<ShowWeatherDiv />);
              setSwitchButtonText("Checkout another place");
              document.querySelector(".background-video").load();
            }, 3000);
          } else {
          }
        })
        .catch((error) => {
          console.error(error);
        });
      setCounter(1);
    } else {
      setContent(<SelectLocationDiv />);
      setCounter(0);
      setVideo(defaultVideo);
      document.querySelector(".background-video").load();
      setSwitchButtonText("Get Weather");
    }
  };

  return (
    <div className="home">
      <video loop autoPlay muted className="background-video">
        <source src={videoo} type="video/mp4" />
      </video>
      <div className="homeChild">
        <div className="dynamicDiv">{content}</div>
        <button className="handler-btn" onClick={switchButtonHandler}>
          {switchButtonText}
        </button>
      </div>
    </div>
  );
}

export default Home;
