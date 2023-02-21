import React, { useEffect, useState } from "react";
import profile from '../asset/default_user_image.png'

const Chats = ({ chats,changeChat,chatMessages,currentUser }) => {
  const [currentSelected, setCurrentSelected] = useState(undefined);
const changeCurrentChat=(chat,id)=>{
setCurrentSelected(id)
changeChat(chat)
}

const getLastChat=(chatId)=>{
const chatHistory=document.getElementsByClassName('chatHistory')
console.log(chatHistory.offsetWidth);


const chatMessage=chatMessages.filter(message=>(message.users[0]==chatId && message.users[1]==currentUser._id) || (message.users[0]==currentUser._id && message.users[1]==chatId)).pop()
return chatMessage.message.length>20? chatMessage.message.slice(0,20)+'...' : chatMessage.message;
}


  return (
    <div className="contacts-container px-4">
      <h3 className="text-center text-white py-4">Chats</h3>
      <div className="contacts">
        {chats ? chats.map((chat) => {
          return (
            <div className={`contact ${currentSelected===chat._id?'selected':null}`} key={chat._id} onClick={()=>changeCurrentChat(chat,chat._id)} >
              <div className="image">
                <img src={chat.isProfileImageSet? chat.profileImage:profile} alt="picture" />
              </div>
              <div className="username text-white py-2  ">
                <h4 className="fs-5 mb-0">{chat.userName}</h4>
              {/* <span>I have done what I told you about</span> */}
              <span className="chatHistory">{getLastChat(chat._id)}</span>
              </div>
            </div>
          );
        }): <div className="text-white text-center"><h5>Your chat history is empty!</h5></div> }
      </div>
    </div>
  );
};

export default Chats;
