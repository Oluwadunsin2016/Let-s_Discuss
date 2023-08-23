import React from "react";
import robot from '../asset/robot.gif'

const Welcome = ({currentUser}) => {
  return (
    <div className="welcome-container">
      <img src={robot} alt="robot" />
      <h2>
        Welcome, <span>{currentUser.userName}!</span>
      </h2>
      <h4>Please, select a chat to start messaging</h4>
    </div>
  );
};

export default Welcome;
