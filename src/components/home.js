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
import ErrorComponent from "./ErrorComp/ErrorComponent.jsx";
import LoaderComponent from "./LoaderComp/LoaderComponent.jsx";
import SelectLocationComponent from "./SelectLocationComp/SelectLocationComponent.jsx";
import ShowWeatherComponent from "./ShowWeatherComp/ShowWeatherComponent.jsx";

let name = "",
  temp = 0,
  feelsTemp = 0,
  weatherDescription = "",
  weatherDescImg = "",
  cloudCover = 0,
  rain = 0,
  videoTaggerx = "",
  humidity = 0;

let weatherTypes = [
  "Clouds",
  clouds,
  "Clear",
  clearSkies,
  "Rain",
  rainySkies,
  "Drizzle",
  drizzleSkies,
  "Thunderstorm",
  thunderSkies,
  "Snow",
  snowySkies,
  "Haze",
  hazeSkies,
  "Tornado",
  tornadoSkies,
  "Fog",
  fogSkies,
];

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

function Home() {
  let lat = 0.0,
    lon = 0.0;
  const [counter, setCounter] = useState(0);
  const [content, setContent] = useState(<SelectLocationComponent />);
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
      let index = weatherTypes.indexOf(videoTaggerx);
      setVideo(weatherTypes[index + 1]);
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
      let accessToken = "pk.bd3d13c6284c894ed61f03bc383eb75d";
      let xx =
        document.querySelector("#city").value +
        " " +
        document.querySelector("#country").value;
      let geooo = `https://eu1.locationiq.com/v1/search?key=${accessToken}&q=${xx}&format=json`;
      axios
        //calling api to fetch latitude and longitude from user input
        .get(geooo)
        .then((res) => {
          console.log(res.data);
          lat = res.data[0].lat;
          lon = res.data[0].lon;
          callOpenWeather(lat, lon);
          let nameString = res.data[0].display_name;
          let nameArray = nameString.split(",");
          name = nameArray[0];
          setContent(<LoaderComponent />);
          setTimeout(() => {
            //give 3 seconds delay for the api to load
            setContent(
              <ShowWeatherComponent
                namee={name}
                tempp={temp}
                weatherDesc={weatherDescription}
                feels={feelsTemp}
                humid={humidity}
                cloud={cloudCover}
                rains={rain}
                img={weatherDescImg}
              />
            );
            setSwitchButtonText("Checkout another place");
            document.querySelector(".background-video").load();
          }, 3000);
        })
        .catch((error) => {
          console.error(error);
          setContent(<ErrorComponent />);
          setSwitchButtonText("Try Again");
        });
      setCounter(1);
    } else {
      setContent(<SelectLocationComponent />);
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
        <label>
          Powered by{" "}
          <a href="https://locationiq.com/geocoding" target="_blank">
            LocationIQ
          </a>{" "}
          and{" "}
          <a href="https://openweathermap.org/current" target="_blank">
            OpenWeatherMap
          </a>
        </label>
      </div>
    </div>
  );
}

export default Home;
