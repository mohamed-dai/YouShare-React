import "./styles.css";

import React, { useState, useEffect, useCallback } from "react";
import Screenshots from "./Screenshots";
import pixelmatch from "pixelmatch";

export default function App() {
  const displayMediaOptions = {
    video: {
      cursor: "always",
    },
    audio: false,
  };

  const startCaptureClickHandler = async (e) => {
    e.preventDefault();
    let videoElem = document.getElementById("video");
    try {
      videoElem.srcObject = await navigator.mediaDevices.getDisplayMedia(
        displayMediaOptions
      );
      // dumpOptionsInfo();
      // isCaptureOn = true;
    } catch (err) {
      console.error(`Error: ${err}`);
    }
  };
  
  const onVideoFrame = useCallback(() => {
    if (!canvas.current || !video.current) {
      return;
    }
    const context = canvas.current.getContext("2d");
 
    if (!context) {
      return;
    }
 
    context.filter = "grayscale(100%)";
    context.drawImage(video.current, 0, 0, width, height);
  }, [height, width]);

  let videoElem,
    startElem,
    stopElem,
    canvas,
    isCaptureOn = false;

  const width = 250; // We will scale the photo width to this
  let height = 0; // This will be computed based on the input stream
  let streaming = false;

  let previousPhoto = null;

  const [screenshots, setScreenshots] = useState([]);

  useEffect(() => {
    // videoElem = document.getElementById("video");
    // startElem = document.getElementById("start");
    // stopElem = document.getElementById("stop");
    canvas = document.getElementById("canvas");
    // startElem.addEventListener(
    //   "click",
    //   (evt) => {
    //     startCapture();
    //   },
    //   false
    // );
    // videoElem.addEventListener(
    //   "canplay",
    //   () => {
    //     if (!streaming) {
    //       height = videoElem.videoHeight / (videoElem.videoWidth / width);

    //       // Firefox currently has a bug where the height can't be read from
    //       // the video, so we will make assumptions if this happens.

    //       if (isNaN(height)) {
    //         height = width / (4 / 3);
    //       }

    //       videoElem.setAttribute("width", width);
    //       videoElem.setAttribute("height", height);
    //       canvas.setAttribute("width", width);
    //       canvas.setAttribute("height", height);
    //       // previousPhoto = new ImageData(width, height);
    //       streaming = true;
    //     }
    //   },
    //   false
    // );

    videoElem.requestVideoFrameCallback(takeManyPicture);
    // async function startCapture() {
    //   try {
    //     videoElem.srcObject = await navigator.mediaDevices.getDisplayMedia(
    //       displayMediaOptions
    //     );
    //     // dumpOptionsInfo();
    //     isCaptureOn = true;
    //   } catch (err) {
    //     console.error(`Error: ${err}`);
    //   }
    // }

    function takeManyPicture(now, metadata) {
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
    }
  }, []);

  // function dumpOptionsInfo() {
  //   const videoTrack = videoElem.srcObject.getVideoTracks()[0];
  // }

  return (
    <div className="App">
      <p>
        <button onClick={startCaptureClickHandler}>Start Capture</button>
      </p>

      <video id="video" autoPlay></video>

      <br />

      <canvas id="canvas"> </canvas>

      <Screenshots content={screenshots} />
    </div>
  );
}
