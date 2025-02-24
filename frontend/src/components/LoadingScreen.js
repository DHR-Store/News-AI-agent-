import React from "react";
import Lottie from "react-lottie";
import animationData from "../assets/loading.json";

const LoadingScreen = () => {
  return (
    <div className="loading-container">
      <Lottie options={{ animationData, loop: true, autoplay: true }} />
    </div>
  );
};

export default LoadingScreen;
