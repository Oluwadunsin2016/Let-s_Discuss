import { upload } from "@testing-library/user-event/dist/upload";
import React, { useCallback, useRef, useState } from "react";
import { BsCamera } from "react-icons/bs";
import { MdOutlineClose } from "react-icons/md";
import Webcam from "react-webcam";

const Camera = ({setFile,setTakePicture}) => {
  const [capturedImage, setCapturedImage] = useState(undefined);
  const cameraRef = useRef(null);
  const videoConstraints = {
    width: 600,
    height: 700,
    facingMode: "user",
  };

  const capture = useCallback(() => {
    setCapturedImage(cameraRef.current.getScreenshot());
  }, [cameraRef]);

  const upload =()=>{
  setFile(capturedImage)
  setTakePicture(false)
  }

   const close = () => {
  setTakePicture(false)
  };

  return (
    <div className="camera-container bg-dark">
    <div className="close text-white" onClick={close}>
            <MdOutlineClose />
          </div>
      {capturedImage ? (
        <div className="camera">
          <img height={700} width={600} src={capturedImage} alt="" />
          <div className="upload">
            <button
              className="btn btn-danger"
              onClick={() => setCapturedImage(null)}
            >
              Retake
            </button>
            <button
              className="btn btn-success"
              onClick={upload}
            >
              Upload
            </button>
          </div>
        </div>
      ) : (
        <div className="camera">
          <Webcam
          className="webCam"
            ref={cameraRef}
            height={700}
            width={600}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
          />
          <button className="capture-button" onClick={capture}>
            <BsCamera />
          </button>
        </div>
      )}
    </div>
  );
};

export default Camera;
