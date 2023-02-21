import React from "react";

const ImageView = ({ setViewProfilePicture, profile, currentUser }) => {
  // const closeIt = () => {
  //     new WOW.WOW().init();
  //     document.querySelector(".wow").classList.remove("bounceInUp");
  //     document.querySelector(".wow").classList.add("bounceOutDown");
  //    setTimeout(()=>{
  //     close();
  //     document.querySelector(".wow").classList.remove("bounceOutDown");
  //     document.querySelector(".wow").classList.add("bounceInUp");
  //    },1000)
  //   };

  const closeViewImage = () => {
    document.querySelector(".image").classList.remove("animate__zoomIn");
    document.querySelector(".image").classList.add("animate__zoomOut");
    setViewProfilePicture(false);
    setTimeout(() => {
    document.querySelector(".image").classList.remove("animate__zoomOut");
    document.querySelector(".image").classList.add("animate__zoomIn");
    
    }, 1000);
  };

  return (
    <div className="imageView-container">
      <img
      className="image animate__animated animate__zoomIn"
        onClick={closeViewImage}
        src={currentUser.isProfileImageSet ? currentUser.profileImage : profile}
        alt=""
      />
    </div>
  );
};

export default ImageView;
