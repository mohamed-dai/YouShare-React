import "./styles.css";

import React, { useState, useEffect, useCallback } from "react";
import Screenshots from "./Screenshots";
import pixelmatch from "pixelmatch";

export default function App2() {
  const [isCapturing, setIsCapturing] = useState(false);

  return (
    <div className="App">
      {isCapturing ? (
        <>
          <button onClick={() => setIsCapturing(false)}>Stop Capture</button>
          <CaptureView />
        </>
      ) : (
        <button onClick={() => setIsCapturing(true)}>Start Capture</button>
      )}
    </div>
  );
}

function CaptureView() {
  useEffect(() => {
    navigator.mediaDevices
      .getDisplayMedia({
        video: {
          cursor: "always",
        },
        audio: false,
      })
      .then((captureStream) => {
        document.getElementById("video").srcObject = captureStream;
      })
      .catch((err) => {
        console.error(`Error:${err}`);
        return null;
      });
  }, []);
  return (
    <div>
      <video id="video" autoPlay></video>
      <br />
      <canvas id="canvas"> </canvas>
    </div>
  );
}
