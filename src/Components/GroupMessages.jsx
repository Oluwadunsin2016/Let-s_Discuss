import axios from "axios";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { getMembersRoute, groupMessagesRoute } from "../Utils/APIRoutes";

const GroupMessages = ({
  currentGroup,
  currentUser,
  messages,
  setMessages,
  socket,
}) => {
  const [members, setMembers] = useState([]);

  const scrollRef=useRef()
useEffect(() => {
scrollRef.current?.scrollIntoView({behaviour:"smooth"})
}, [messages])

  useEffect(() => {
    getGroupMessages();
    getGroupMembers();
  }, [currentGroup]);

  const getGroupMembers = async () => {
    // console.log(currentGroup);
    const { data } = await axios.post(getMembersRoute, {
      group: currentGroup._id,
    });
    // console.log(data);
    const memberIds = data.members.map((member) => member.member);
    setMembers(data.users.filter((user) => memberIds.includes(user._id)));
  };
  // console.log(members);

  useEffect(() => {
    getGroupMessages();
  }, [messages]);

  const getGroupMessages = async () => {
    const { data } = await axios.post(groupMessagesRoute, {
      group: currentGroup._id,
    });
    setMessages(data.messages);
    socket.on("received-group-message", (data) => {
      setMessages([...messages, data]);
    });
  };

  const senderName = (id) => {
    const sender = members.find((member) => member._id == id);
    if (sender) {
      return `${sender.firstName} ${sender.lastName}`;
    }
  };

  const time = (message) => {
    // To get the time of the last message
    // console.log(message);
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
  };

  return (
    <div className="message-container">
      {messages &&
        messages.map((message) => {
          return (
            // <div key={uuidv4()} ref={scrollRef}>
            <div key={uuidv4()}>
              <div
                className={`message ${
                  message.sender == currentUser._id ? "sent" : "received"
                }`}
              >
                <div className="content">
                  <h6>{message.sender==currentUser._id? "You":senderName(message.sender)}</h6>
                    <p className="m-0">{message.message} <span className="float-end textTime mt-3 ms-3 text-muted">
                      {time(message)}
                    </span></p>
                    
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default GroupMessages;
