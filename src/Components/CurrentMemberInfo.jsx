import React from "react";
import { useState } from "react";
import ImageView from "./ImageView";

const CurrentMemberInfo = ({ currentMember, changeChat, setGroupMode,showChat }) => {
const [viewProfilePicture, setViewProfilePicture] = useState(false);
  const message = () => {
    setGroupMode(false);
    changeChat(currentMember);
    showChat()
  };
  return (
    <div className="contacts-container px-4">
      <h3 className="text-center text-white py-4">Member Infos</h3>
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
