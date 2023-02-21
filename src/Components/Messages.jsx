import React, { useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

const Messages = ({ messages }) => {
const scrollRef=useRef()
useEffect(() => {
// scrollRef.current?.scrollIntoView({behaviour:"smooth"})
}, [messages])

  return (
    <div className="message-container">
      {messages &&
        messages.map((message) => {
          return (
            <div key={uuidv4()} ref={scrollRef}>
              <div
                className={`message ${message.fromSelf ? "sent" : "received"}`}
              >
                <div className="content">
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Messages;
