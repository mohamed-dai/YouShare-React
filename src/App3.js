import "./styles.css";

import React, { useState, useEffect, useCallback } from "react";
import Screenshots from "./Screenshots";
import pixelmatch from "pixelmatch";

export default function App3() {
  const CAPTURE = { NOT_STARTED: 0, IN_PROGRESS: 1, FINISHED: -1 };
  const [captureStatus, setCaptureStatus] = useState(CAPTURE.NOT_STARTED);

  let view = (
    <CaptureNotStarted onStart={() => setCaptureStatus(CAPTURE.IN_PROGRESS)} />
  );
  if (captureStatus === CAPTURE.IN_PROGRESS) {
    view = (
      <CaptureInProgress
        onFinished={() => setCaptureStatus(CAPTURE.FINISHED)}
      />
    );
  } else if (captureStatus === CAPTURE.FINISHED) {
    view = <CaptureFinished />;
  }

  return <div className="App">{view}</div>;
}

function CaptureNotStarted({ onStart }) {
  return <button onClick={onStart}>Start Capture</button>;
}

function CaptureInProgress({ onFinished }) {
  return (
    <>
      <button onClick={onFinished}>Finish Capture</button>
      <CaptureView />
    </>
  );
}

function CaptureFinished() {
  return <h1>Finished</h1>;
}

function CaptureView() {
  const [screenshots, setScreenshots] = useState([]);
  let videoElement, previousPhoto;
  // const width = 250,
  //   height = 0;
  const takeManyPicture = (now, metadata) => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.drawImage(videoElement, 0, 0, metadata.width, metadata.height);
    const data = context.getImageData(0, 0, metadata.width, metadata.height);
    if (previousPhoto === undefined) {
      previousPhoto = new ImageData(data.width, data.height);
    }
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
    }

    videoElement.requestVideoFrameCallback(takeManyPicture);
  };

  useEffect(() => {
    videoElement = document.getElementById("video");
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
