import React from "react";
import "./ShowWeatherComponent.css";

function ShowWeatherComponent(props) {
  return (
    <div className="showWeatherDiv">
      <label className="name-label">{props.namee}</label>
      <label className="temp-label">{props.tempp}º</label>
      <label className="rows-common">{props.weatherDesc}</label>
      <label className="rows-common">Feels {props.feels}º</label>
      <label className="rows-common">Humidity {props.humid}%</label>
      <label className="rows-common">Cloud Cover {props.cloud}%</label>
      <label className="rows-common">
        {props.rains}mm rain in the last hour
      </label>
      <div className="img-holder">
        <img
          className="weather-img"
          src={props.img}
          alt="Weather Description Image"
        />
      </div>
    </div>
  );
}

export default ShowWeatherComponent;
