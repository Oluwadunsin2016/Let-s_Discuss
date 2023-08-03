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
import { FiMoreVertical } from "react-icons/fi";
import { BiArrowBack } from "react-icons/bi";
import Welcome from "../Components/Welcome";
import Messages from "../Components/Messages";
import ChatInput from "../Components/ChatInput";
import { io } from "socket.io-client";
import SideIcons from "../Components/SideIcons";
import Profile from "../Components/Profile";
import Chats from "../Components/Chats";
import Groups from "../Components/Groups";
import CurrentChatDetails from "../Components/CurrentChatDetails";
import GroupMembers from "../Components/GroupMembers";
import AddGroupMember from "../Components/AddGroupMember";
import GroupInformation from "../Components/GroupInformation";
import GroupMessages from "../Components/GroupMessages";
import GroupChatInput from "../Components/GroupChatInput";
import CurrentMemberInfo from "../Components/CurrentMemberInfo";
import Navbar from "../Components/Navbar";
import DeviceProfile from "../Components/DeviceProfile";
import LastSeen from "../Components/LastSeen";

const Chat = () => {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [chats, setChats] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentUser, setcurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isloaded, setIsloaded] = useState(false);
  const [messages, setMessages] = useState("");
  const [arrivedMessage, setArrivedMessage] = useState("");
  const [isProfilePictureSet, setIsProfilePictureSet] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentPosition, setCurrentPosition] = useState("Chats");
  const [groupMode, setGroupMode] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [groupMessages, setGroupMessages] = useState([]);
  const [currentMember, setCurrentMember] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loggedOutUsers, setLoggedOutUsers] = useState(
    JSON.parse(localStorage.getItem("loggedOutUsers")) || []
  );
  const [main, setmain] = useState(
    "col-lg-8 col-md-7 d-md-block col-12 d-none"
  );
  const [side, setside] = useState("col-lg-4 col-md-5 col-12 d-md-flex d-flex");
  const [mynav, setmynav] = useState("d-md-none");

  useEffect(() => {
    if (isProfilePictureSet) {
      setcurrentUser(JSON.parse(localStorage.getItem("current_user")));
    }
  }, [isProfilePictureSet]);

  useEffect(() => {
    getCurrentUser();
  }, [localStorage.current_user]);

  const getCurrentUser = async () => {
    if (!localStorage.current_user || localStorage.current_user === undefined) {
      navigate("/login");
    } else {
      setcurrentUser(await JSON.parse(localStorage.getItem("current_user")));
      setIsloaded(true);
    }
  };

  // To keep track of the online Users
  socket.current = io(host);
  // const  socket = io(host);
  useEffect(() => {
    if (currentUser) {
      // console.log(socket.current);
      socket.current.emit("add-user", currentUser._id);

      socket.current.on("onlineUsers", (users) => {
        const loggedOut = loggedOutUsers.filter(
          (user) => user.loggedOutUserId == currentUser._id
        );
        localStorage.setItem("loggedOutUsers", JSON.stringify(loggedOut));
        setLoggedOutUsers(loggedOut);
        setOnlineUsers(users);
      });

      socket.current.on("userDisconnected", ({ loggedOutUserId, lastSeen }) => {
        // setOnlineUsers((users) =>
        //   users.filter((user) => user !== loggedOutUserId)
        // );
        // {loggedOutUserId:currentUserId, lastSeen:new Date()}
        if (localStorage.loggedOutUsers) {
          const outUsers = JSON.parse(localStorage.loggedOutUsers);

          localStorage.setItem(
            "loggedOutUsers",
            JSON.stringify([...outUsers, { loggedOutUserId, lastSeen }])
          );
        } else {
          localStorage.setItem(
            "loggedOutUsers",
            JSON.stringify([{ loggedOutUserId, lastSeen }])
          );
          console.log({ loggedOutUserId, lastSeen });
          console.log("I'm seen");
        }
        setLoggedOutUsers([...loggedOutUsers, { loggedOutUserId, lastSeen }]);
      });

      return () => {
        socket.current.off("onlineUsers");
        socket.current.off("userDisconnected");
      };
    }
  }, [currentUser, socket.current]);

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
      createdAt: new Date(),
    });
    console.log(response);
    setMessages([
      ...messages,
      { fromSelf: true, message, createdAt: new Date() },
    ]);
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
  }, [contacts, messages]);

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
    setChatMessages(currentMessages);
    const currentChattedIds0 = currentMessages.map(
      (chattedPerson) => chattedPerson.users[0]
    );
    const currentChattedIds1 = currentMessages.map(
      (chattedPerson) => chattedPerson.users[1]
    );
    const currentChattedIds = [...currentChattedIds0, ...currentChattedIds1];
    const currentChattedUsers = contacts.filter((contact) =>
      currentChattedIds.includes(contact._id)
    );
    setChats(currentChattedUsers);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("received-message", (data) => {
        console.log(data);
        setArrivedMessage({
          fromSelf: false,
          message: data.message,
          createdAt: data.createdAt,
        });
      });
    }
  }, [messages, socket.current]);
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

  const changeGroupFunction = (name) => {
    setCurrentPosition(name);
    setShowDropdown(false);
    hideChat();
  };

  const lastSeen = (chatId) => {
    if (loggedOutUsers) {
      const loggedOut = loggedOutUsers.find(
        (person) => person.loggedOutUserId == chatId
      );
      if (loggedOut) {
        return loggedOut.lastSeen;
      }
    }
  };

  // function to show chat in medium and small devices
  const showChat = () => {
    setmain("col-lg-8 col-md-7 d-md-block col-12 ");
    setside("col-lg-4 col-md-5 col-12 d-md-flex d-none");
    setmynav("d-md-none d-none");
  };

  const hideChat = () => {
    setmain("col-lg-8 col-md-7 d-md-block col-12 d-none");
    setside("col-lg-4 col-md-5 col-12 d-md-flex d-flex");
    setmynav("d-md-none");
  };

  return (
    <>
      <div className="proCover d-none">
        <Profile
          setcurrentUser={setcurrentUser}
          close={close}
          currentUser={currentUser}
          setIsProfilePictureSet={setIsProfilePictureSet}
          isCompleted={isCompleted}
          setIsCompleted={setIsCompleted}
        />
      </div>
      <div className={mynav}>
        <Navbar
          socket={socket.current}
          currentPosition={currentPosition}
          setCurrentPosition={setCurrentPosition}
          currentUser={currentUser}
        />
      </div>
      <div className="chat-container">
        <div className={side}>
          <div className="col-1 d-none d-md-inline bg-dark">
            <SideIcons
              open={open}
              currentUser={currentUser}
              currentPosition={currentPosition}
              setCurrentPosition={setCurrentPosition}
              socket={socket.current}
            />
          </div>
          <div className="col-12 col-md-11 contacts-cover">
            {currentPosition === "Chats" && (
              <Chats
                currentUser={currentUser}
                setGroupMode={setGroupMode}
                chatMessages={chatMessages}
                chats={chats}
                changeChat={changeChat}
                showChat={showChat}
                onlineUsers={onlineUsers}
                loggedOutUsers={loggedOutUsers}
              />
            )}
            {currentPosition === "Contacts" && (
              <Contacts
                contacts={contacts}
                changeChat={changeChat}
                setGroupMode={setGroupMode}
                showChat={showChat}
              />
            )}
            {currentPosition === "Groups" && (
              <Groups
                contacts={contacts}
                setGroupMode={setGroupMode}
                currentUser={currentUser}
                changeChat={changeChat}
                showChat={showChat}
              />
            )}
            {currentPosition === "Add Member" && (
              <AddGroupMember
              showChat={showChat}
                contacts={contacts}
                currentGroup={groupMode ? currentChat : []}
              />
            )}
            {currentPosition === "Group Members" && (
              <GroupMembers
                currentGroup={groupMode ? currentChat : []}
                currentUser={currentUser}
                setCurrentPosition={setCurrentPosition}
                setCurrentMember={setCurrentMember}
                showChat={showChat}
              />
            )}
            {currentPosition === "Group Information" && (
              <GroupInformation
                currentGroup={groupMode ? currentChat : []}
                setIsProfilePictureSet={setIsProfilePictureSet}
                isCompleted={isCompleted}
                setIsCompleted={setIsCompleted}
                currentUser={currentUser}
                setCurrentGroup={setCurrentChat}
                setCurrentPosition={setCurrentPosition}
                setCurrentMember={setCurrentMember}
                showChat={showChat}
              />
            )}

            {currentPosition === "Current Member" && (
              <CurrentMemberInfo
                setGroupMode={setGroupMode}
                changeChat={changeChat}
                showChat={showChat}
                currentMember={currentMember}
                currentGroup={groupMode ? currentChat : []}
              />
            )}

            {currentPosition === "Profile" && (
              <DeviceProfile
                setcurrentUser={setcurrentUser}
                currentUser={currentUser}
                setIsProfilePictureSet={setIsProfilePictureSet}
                isCompleted={isCompleted}
                setIsCompleted={setIsCompleted}
              />
            )}
          </div>
        </div>
        {isloaded && currentChat === undefined ? (
          <div className={main}>
            <Welcome currentUser={currentUser} />
          </div>
        ) : (
          <div className={`${main} chatContainer`}>
            {groupMode ? (
              <div>
                {currentChat && (
                  <div className="h-100">
                    <div className="chat-area">
                      <div>
                        <div className="head">
                          <div className="profile-nav d-flex justify-content-between align-items-center">
                          <div className="back text-white me-2 d-md-none" onClick={hideChat}>
                        <BiArrowBack size={25}/>
                        </div>
                            <div
                              className="profile w-100 w-md-75 w-lg-100"
                              onClick={() =>
                                changeGroupFunction("Group Information")
                              }
                            >
                              <div className="image">
                                <img
                                  src={currentChat.profileImage}
                                  alt="picture"
                                />
                              </div>
                              <div className="currentGroupName">
                                <h5 className="mb-0">
                                  {currentChat.userName
                                    ? currentChat.userName
                                    : currentChat.name}
                                </h5>
                                <p className="m-0 ps-4 text-white">
                                  Tap for Info
                                </p>
                              </div>
                            </div>
                            <div
                              className="text-light moreVertical"
                              onClick={() => setShowDropdown(!showDropdown)}
                            >
                              <FiMoreVertical size={30} />
                            </div>
                          </div>
                          {/* This is group info dropdown */}
                          {showDropdown && (
                            <div className="dropDown">
                              <ul className="list-unstyled">
                                {currentChat.admin == currentUser._id && (
                                  <li
                                    onClick={() =>
                                      changeGroupFunction("Add Member")
                                    }
                                  >
                                    Add Member
                                  </li>
                                )}
                                <li
                                  onClick={() =>
                                    changeGroupFunction("Group Members")
                                  }
                                >
                                  Group Members
                                </li>
                                <li
                                  onClick={() =>
                                    changeGroupFunction("Group Information")
                                  }
                                >
                                  Group Informations
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>
                        <GroupMessages
                          socket={socket.current}
                          messages={groupMessages}
                          setMessages={setGroupMessages}
                          currentGroup={currentChat}
                          currentUser={currentUser}
                        />
                        <GroupChatInput
                          socket={socket.current}
                          messages={groupMessages}
                          setMessages={setGroupMessages}
                          currentGroup={currentChat}
                          currentUser={currentUser}
                        />
                      </div>
                    </div>
                    <div className="chatDetails d-none">
                      <CurrentChatDetails
                        currentChat={currentChat}
                        cover={cover}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {currentChat && (
                  <div className="h-100">
                    <div className="chat-area">
                      <div className="head">
                        <div className="profile-nav d-flex align-items-center">
                        <div className="back text-white me-2 d-md-none" onClick={hideChat}>
                        <BiArrowBack size={25}/>
                        </div>
                          <div className="profile" onClick={view}>
                            <div className="image">
                              <img
                                src={currentChat.profileImage}
                                alt="picture"
                              />
                            </div>
                            <div>
                              <h5 className="mb-0">
                                {currentChat.userName
                                  ? currentChat.userName
                                  : currentChat.name}
                              </h5>
                              <span key={currentChat._id}>
                                {onlineUsers && (
                                  <p className="m-0">
                                    {onlineUsers.includes(currentChat._id) ? (
                                      <span className="onlineUser ps-2 m-0">
                                        online
                                      </span>
                                    ) : (
                                      <span className="text-white">
                                        {lastSeen(currentChat._id) ? (
                                          <LastSeen
                                            time={lastSeen(currentChat._id)}
                                          />
                                        ) : (
                                          "offline"
                                        )}
                                      </span>
                                    )}
                                  </p>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Messages messages={messages} />
                      <ChatInput handleSendMsg={handleSendMsg} />
                    </div>
                    <div className="chatDetails d-none">
                      <CurrentChatDetails
                        currentChat={currentChat}
                        cover={cover}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Chat;
