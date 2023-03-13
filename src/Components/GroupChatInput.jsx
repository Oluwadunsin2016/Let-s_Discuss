import axios from "axios";
import React, { createRef, useEffect, useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import { sendMessageToGroupRoute } from "../Utils/APIRoutes";
import Emoji from "./Emoji";

const GroupChatInput = ({currentUser,currentGroup,socket,messages,setMessages}) => {
const inputRef=createRef()
  const [msg, setMsg] = useState("");
  const [emojiStatus, setemojiStatus] = useState(false);
  const [cursorPosition, setcursorPosition] = useState("")

  const showEmojiPicker = () => {
    setemojiStatus(!emojiStatus);
  };

  const handleEmojiClick=({emoji})=>{
  const ref=inputRef.current;
  ref.focus()
  const start=msg.substring(0,ref.selectionStart)
  const end=msg.substring(ref.selectionStart)
  let message= start + emoji + end
  setMsg(message)
  setcursorPosition(start.length+emoji.length)
  }

  useEffect(() => {
    inputRef.current.selectionEnd=cursorPosition
  }, [cursorPosition])

//   const sendChat=()=>{
//  if (msg.length>0) {
//    handleSendMsg(msg)
//    setMsg("")
//  }
//   }

    const handleSendMsg = async () => {
    const messageInfo={
      sender: currentUser._id,
      group: currentGroup._id,
      message:msg,
    }
   if (msg.length>0) {
     const response = await axios.post(sendMessageToGroupRoute, messageInfo);
    setMsg("")
    console.log(response);
   }
    socket.emit("send-group-message", messageInfo);
    messageInfo.createdAt = new Date()

    setMessages([...messages,messageInfo])

  };
  


  return (
    <div className="chatInput-container">
      <div className="emoji">
        <BsEmojiSmileFill onClick={showEmojiPicker} />
        {emojiStatus && (
          <div>
            <Emoji handleEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>

        <input
        ref={inputRef}
          type="text"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          name=""
          id=""
        />
      <div className="send" onClick={handleSendMsg}>
        <IoMdSend />
      </div>
    </div>
  );
};

export default GroupChatInput;
