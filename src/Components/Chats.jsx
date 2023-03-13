import React, { useEffect, useState } from "react";
import LastSeen from "./LastSeen";

const Chats = ({
  chats,
  changeChat,
  chatMessages,
  currentUser,
  setGroupMode,
  showChat,
  onlineUsers,
  loggedOutUsers
}) => {
  const [currentSelected, setCurrentSelected] = useState(undefined);

  const changeCurrentChat = (chat, id) => {
    setCurrentSelected(id);
    changeChat(chat);
    setGroupMode(false);
    showChat();
  };

  // console.log(onlineUsers);

  const getLastChat = (chatId) => {
    // To get the last message object
    const chatMessage = chatMessages
      .filter(
        (message) =>
          (message.users[0] == chatId && message.users[1] == currentUser._id) ||
          (message.users[0] == currentUser._id && message.users[1] == chatId)
      )
      .pop();
    // To get the last message
    return chatMessage.message;
  };

  const time = (chatId) => {
    const chatMessage = chatMessages
      .filter(
        (message) =>
          (message.users[0] == chatId && message.users[1] == currentUser._id) ||
          (message.users[0] == currentUser._id && message.users[1] == chatId)
      )
      .pop();

    // To get the time of the last message
    // console.log(chatMessage.createdAt);
    if (chatMessage.createdAt) {
      const dateObj = new Date(chatMessage.createdAt);
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

  const lastSeen=(chatId)=>{
  if (loggedOutUsers) {
    const loggedOut= loggedOutUsers.find(person=>person.loggedOutUserId==chatId)
    if (loggedOut) {
      return loggedOut.lastSeen
    }
  }
  }

  return (
    <div className="contacts-container px-4 pt-md-0 pt-4">
      <h3 className="text-center text-white py-4 d-none d-md-block">Chats</h3>
      <div className="contacts">
        {chats == [] || chats == undefined ? (
          <div className="text-white text-center">
            <h5>Your chat history is empty!</h5>
          </div>
        ) : (
          chats.map((chat) => {
            return (
              <div
                className={`contact ${
                  currentSelected === chat._id ? "selected" : null
                }`}
                key={chat._id}
                onClick={() => changeCurrentChat(chat, chat._id)}
              >
                <div className="d-flex justify-content-between w-100 px-2">
                  <div className="d-flex gap-2 align-items-center text-white chattedPersonCover">
                    <div className="image">
                      <img src={chat.profileImage} height={50} width={50} alt="picture" />
                    </div>
                    <div className="username myChats w-75 py-2">
                      <h4 className="fs-5 mb-0">{chat.userName}</h4>
                      <div className="chatHistory">
                        {getLastChat(chat._id)}
          
                      </div>
                    </div>
                  </div>
                  <div className="text-white d-flex align-items-center">
                    <span key={chat._id}>
                    {onlineUsers.includes(chat._id)? <p className="onlineUser m-0">online</p> : <p className="m-0">{lastSeen(chat._id)?<LastSeen time={lastSeen(chat._id)} />:"offline"}</p>}
                      <p className="m-0 text-muted">{time(chat._id)}</p>
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Chats;
