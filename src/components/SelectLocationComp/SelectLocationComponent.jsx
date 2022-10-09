import React from "react";
import "./SelectLocationComponent.css";

function SelectLocationComponent() {
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

export default SelectLocationComponent;
