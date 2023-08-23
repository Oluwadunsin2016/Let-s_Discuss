import React from "react";
import { useState } from "react";
import ImageView from "./ImageView";
import { BiArrowBack } from "react-icons/bi";

const CurrentMemberInfo = ({ currentMember, changeChat, setGroupMode,showChat,setCurrentPosition,backTo }) => {
const [viewProfilePicture, setViewProfilePicture] = useState(false);
  const message = () => {
    setGroupMode(false);
    changeChat(currentMember);
    showChat()
  };

  const goBack=()=>{
  setCurrentPosition(backTo)
  setGroupMode(true);
  }



  return (
    <div className="contacts-container px-4">
       <div className="d-flex py-4">
      <div className="back text-white me-2" onClick={goBack}>
        <BiArrowBack size={25} />
      </div>
      <h3 className="text-center text-white w-100">Member Information</h3>
     </div>
      <div className="contacts">
        {currentMember && (
          <div className="groupInfo text-white mb-5">
            <div className="cover mb-5">
              <div className="image">
                <img
                  onClick={() => setViewProfilePicture(true)}
                  src={currentMember.profileImage}
                  alt=""
                />
              </div>
            </div>
            <div className="mx-lg-5">
              <h5>
                Name:
                <i>
                  {currentMember.firstName} {currentMember.lastName}
                </i>
              </h5>
              <h5>
                Username: <i>{currentMember.userName}</i>
              </h5>
              <h5>
                Email: <i>{currentMember.email}</i>
              </h5>
              <div className="mt-4 text-center">
                <button className="btn btn-light" onClick={message}>
                  Message {currentMember.firstName}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {viewProfilePicture && (
        <ImageView
          setViewProfilePicture={setViewProfilePicture}
          currentUser={currentMember}
        />
      )}
    </div>
  );
};

export default CurrentMemberInfo;
