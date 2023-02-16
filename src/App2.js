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
  const takeManyPicture = (now, metadata) => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(videoElem, 0, 0, width, height);

      const data = context.getImageData(0, 0, width, height);
      if (previousPhoto == null) {
        previousPhoto = new ImageData(data.width, data.height);
      }
      // console.log(data.width, data.height);
      // console.log(width, height);
      // console.log(previousPhoto.size);
      const diff = pixelmatch(
        data.data,
        previousPhoto.data,
        null,
        data.width,
        data.height,
        { threshold: 0.5 }
      );
      previousPhoto = data;
      console.log("diff", diff);
      if (diff > 400 && metadata.mediaTime > 0) {
        console.log("new image " + diff);

        const src = canvas.toDataURL("image/png");
        setScreenshots((screenshots) => {
          screenshots.push(src);
          return screenshots;
        });
        // let photo = document.createElement("IMG");
        // photo.setAttribute("src", src);
        // output.appendChild(photo);
        // console.log(now, metadata.mediaTime);
      }
    } else {
      // clearphoto();
    }
    videoElem.requestVideoFrameCallback(takeManyPicture);
  };

  useEffect(() => {
    const videoElement = document.getElementById("video");
    navigator.mediaDevices
      .getDisplayMedia({
        video: {
          cursor: "always",
        },
        audio: false,
      })
      .then((captureStream) => {
        videoElement.srcObject = captureStream;
      })
      .catch((err) => {
        console.error(`Error:${err}`);
        return null;
      });
    videoElement.requestVideoFrameCallback(takeManyPicture);
  }, []);
  return (
    <div>
      <video id="video" autoPlay></video>
      <br />
      <canvas id="canvas"> </canvas>
    </div>
  );
}
