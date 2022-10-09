import React from "react";
import "./ErrorComponent.css";

function ErrorComponent() {
  return (
    <>
      <h1 className="">Weather App</h1>
      <h3 className="error">
        <span>Location Not Found.</span>
        <span>Please recheck.</span>
      </h3>
    </>
  );
}

export default ErrorComponent;
