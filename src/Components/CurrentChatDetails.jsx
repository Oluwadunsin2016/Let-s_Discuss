import React, { useState } from "react";
import pic from "../asset/default_user_image.png";
import 'animate.css'
import { MdOutlineClose } from "react-icons/md";
import { useEffect } from "react";

const CurrentChatDetails = ({ currentChat, cover }) => {
  const [viewCurrentChatProfilePicture, setViewCurrentChatProfilePicture] =
    useState(false);
    const [seenImage, setSeenImage] = useState(false);


  const closeIt = () => {
    document.querySelector(".animation").classList.remove("animate__backInDown");
    document.querySelector(".animation").classList.add("animate__backOutUp");
    setTimeout(() => {
    cover();
    document.querySelector(".animation").classList.remove("animate__backOutUp");
    document.querySelector(".animation").classList.add("animate__backInDown");
    
    }, 1000);
  };

  useEffect(()=>{
  if(seenImage){
  setViewCurrentChatProfilePicture(false);
    document.querySelector(".image").classList.remove("animate__zoomOut");
    document.querySelector(".image").classList.add("animate__zoomIn");
    setSeenImage(false);
  }
  },[seenImage])

  const closeViewImage = () => {
    document.querySelector(".image").classList.remove("animate__zoomIn");
    document.querySelector(".image").classList.add("animate__zoomOut");
    setSeenImage(true)
  };
  return (
    <div className="current-chat-Details">
      <div className="animation animate__animated animate__backInDown">
        {currentChat && (
          <div className="chat-profile text-white bg-dark col-md-6 px-5 py-2">
            <div className="close" onClick={closeIt}>
              <MdOutlineClose />
            </div>
            <div className="image my-5">
              <img
                onClick={() => setViewCurrentChatProfilePicture(true)}
                src={
                  currentChat.isProfileImageSet ? currentChat.profileImage : pic
                }
                alt=""
              />
            </div>

            <div className="mx-md-5">
              <h4>
                <span>Name:</span> {currentChat.firstName}{" "}
                {currentChat.lastName}
              </h4>
              <h5>
                <span>Username:</span> {currentChat.userName}
              </h5>
              <h6>
                <span>Email: </span>
                {currentChat.email}
              </h6>
            </div>
          </div>
        )}
      </div>
      {viewCurrentChatProfilePicture && (
        <div className="imageView-container">
          <img
          className="image animate__animated animate__zoomIn"
            onClick={closeViewImage}
            src={currentChat.isProfileImageSet ? currentChat.profileImage : pic}
            alt=""
          />
        </div>
      )}
    </div>
  );
};

export default CurrentChatDetails;
