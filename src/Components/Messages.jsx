import React, { useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

const Messages = ({ messages }) => {
const scrollRef=useRef()
useEffect(() => {
scrollRef.current?.scrollIntoView({behaviour:"smooth"})
}, [messages])

const time=(message)=>{
    // To get the time of the last message
    if (message) {
         const dateObj = new Date(message.createdAt);
        const hours = dateObj.getHours();
        const minutes = dateObj.getMinutes();

        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);

        const timeIn12Hrs = date.toLocaleString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        return timeIn12Hrs;
    }
  }

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
                  <p className="m-0">{message.message} <span className="float-end textTime mt-3 ms-3 text-muted">{time(message)}</span></p>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Messages;
