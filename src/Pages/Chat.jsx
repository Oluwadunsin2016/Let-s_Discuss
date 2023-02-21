import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Contacts from "../Components/Contacts";
import {
  allUsersRoute,
  getAllMessagesRoute,
  getcurrentChatMessagesRoute,
  host,
  sendMessageRoute,
} from "../Utils/APIRoutes";
import profile from "../asset/default_user_image.png";
import { MdOutlineClose, MdOutlineLogout } from "react-icons/md";
import Welcome from "../Components/Welcome";
import Messages from "../Components/Messages";
import ChatInput from "../Components/ChatInput";
import { io } from "socket.io-client";
import SideIcons from "../Components/SideIcons";
import Profile from "../Components/Profile";
import Chats from "../Components/Chats";
import Groups from "../Components/Groups";
import CurrentChatDetails from "../Components/CurrentChatDetails";

const Chat = () => {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [chats, setChats] = useState([]);
  const [chatMessages, setChatMessages] = useState([])
  const [currentUser, setcurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isloaded, setIsloaded] = useState(false);
  const [messages, setMessages] = useState("");
  const [arrivedMessage, setArrivedMessage] = useState("");
  const [isProfilePictureSet, setIsProfilePictureSet] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentPosition, setCurrentPosition] = useState("Chats");
  const [viewCurrentChatDetails, setviewCurrentChatDetails] = useState(false);

  useEffect(() => {
    if (isProfilePictureSet) {
      setcurrentUser(JSON.parse(localStorage.getItem("current_user")));
    }
  }, [isProfilePictureSet]);

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    if (!localStorage.current_user || localStorage.current_user === undefined) {
      navigate("/login");
    } else {
      setcurrentUser(await JSON.parse(localStorage.getItem("current_user")));
      setIsloaded(true);
    }
  };

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    getAllUsers();
  }, [currentUser]);

  const getAllUsers = async () => {
    if (currentUser) {
      const { data } = await axios.get(`${allUsersRoute}/${currentUser._id}`);
      setContacts(data);
    }
  };

  const changeChat = (chat) => {
    setCurrentChat(chat);
  };

  const handleSendMsg = async (message) => {
    const response = await axios.post(sendMessageRoute, {
      from: currentUser._id,
      to: currentChat._id,
      message,
    });
    socket.current.emit("send-message", {
      from: currentUser._id,
      to: currentChat._id,
      message,
    });
    console.log(response);
    const msgs = [...messages];
    console.log(msgs);
    msgs.push({ fromSelf: true, message });
    setMessages(msgs);
  };

  useEffect(() => {
    if (currentChat) {
      getMessages();
    }
  }, [currentChat]);

  const getMessages = async () => {
    const { data } = await axios.post(getcurrentChatMessagesRoute, {
      from: currentUser._id,
      to: currentChat._id,
    });
    setMessages(data);
    console.log(data);
  };

  useEffect(() => {
      getChattedUsers();
  }, [contacts]);

  const getChattedUsers = async () => {
     const { data } = await axios.get(getAllMessagesRoute);
    const currentMessages = data.messages.filter((message, id) => {
      if (currentUser) {
        return (
          message.sender == currentUser._id ||
          message.users[1] == currentUser._id
        );
      }
    });
    console.log(currentMessages);
    setChatMessages(currentMessages);
    const currentChattedIds=currentMessages.map(chattedPerson=>chattedPerson.users[1])
    const currentChattedUsers=contacts.filter(contact=>currentChattedIds.includes(contact._id));
    setChats(currentChattedUsers);
  };
    console.log(chats);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("received-message", (message) => {
        setArrivedMessage({ fromSelf: false, message });
      });
    }
  }, []);
  useEffect(() => {
    arrivedMessage && setMessages([...messages, arrivedMessage]);
  }, [arrivedMessage]);

  const open = () => {
    document.querySelector(".proCover").classList.remove("d-none");
  };
  const close = () => {
    document.querySelector(".proCover").classList.add("d-none");
  };

  const view = () => {
    document.querySelector(".chatDetails").classList.remove("d-none");
  };

  const cover = () => {
    document.querySelector(".chatDetails").classList.add("d-none");
  };

  return (
    <>
      <div className="proCover d-none">
        <Profile
          close={close}
          currentUser={currentUser}
          setIsProfilePictureSet={setIsProfilePictureSet}
          isCompleted={isCompleted}
          setIsCompleted={setIsCompleted}
        />
      </div>
      <div className="chat-container">
        <div className="col-4 d-flex">
          <div className="col-1 bg-dark">
            <SideIcons
              open={open}
              currentUser={currentUser}
              currentPosition={currentPosition}
              setCurrentPosition={setCurrentPosition}
            />
          </div>
          <div className="col-11 contacts-cover">
            {currentPosition === "Chats" && (
              <Chats currentUser={currentUser} chatMessages={chatMessages} chats={chats} changeChat={changeChat} />
            )}
            {currentPosition === "Contacts" && (
              <Contacts contacts={contacts} changeChat={changeChat} />
            )}
            {currentPosition === "Groups" && (
              <Groups contacts={contacts} changeChat={changeChat} />
            )}
          </div>
        </div>
        {isloaded && currentChat === undefined ? (
          <div className="col-8">
            <Welcome currentUser={currentUser} />
          </div>
        ) : (
          <div className="chatContainer col-8">
            {currentChat && (
              <div className="h-100">
                <div className="profile-nav">
                  <div className="profile" onClick={view}>
                    <div className="image">
                      <img
                        src={
                          currentChat.isProfileImageSet
                            ? currentChat.profileImage
                            : profile
                        }
                        alt="picture"
                      />
                    </div>
                    <h5>{currentChat.userName}</h5>
                  </div>
                </div>
                <div className="chat-field">
                  <Messages messages={messages} />
                  <ChatInput handleSendMsg={handleSendMsg} />
                </div>
                <div className="chatDetails d-none">
                  <CurrentChatDetails currentChat={currentChat} cover={cover} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Chat;
