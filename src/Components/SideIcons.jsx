import React from "react";
import { MdOutlineContacts, MdOutlineLogout } from "react-icons/md";
import { BsChatText } from "react-icons/bs";
import { HiOutlineUserGroup } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const SideIcons = ({ open, currentUser,currentPosition, setCurrentPosition,socket }) => {
const navigate=useNavigate()
 const logOut = () => {
 console.log(socket);
if (socket) {
  //  socket.emit('disconnectMe',currentUser._id)
   socket.disconnect()
    localStorage.removeItem("current_user");
    navigate("/login");
  };
}

const changePosition=(name)=>{
setCurrentPosition(name)
}

  return (
    <>
      {currentUser && (
        <div className="sideIcons-container">
          <div className="icons">
            <div id="Chats" className={`${currentPosition==="Chats"?"current":""}`} onClick={()=>changePosition("Chats")}>
              <BsChatText />
            </div>
            <div id="Contacts" className={`${currentPosition==="Contacts"?"current":""}`} onClick={()=>changePosition("Contacts")}>
              <MdOutlineContacts />
            </div>
            <div id="Groups"  className={`${currentPosition==="Groups"?"current":""}`} onClick={()=>changePosition("Groups")}>
              <HiOutlineUserGroup />
            </div>
          </div>
          <div className="bottom">
            <div id="Profile">
              <div className="profile" onClick={open}>
                <img
                  src={currentUser.profileImage}
                  alt="picture"
                />
              </div>
            </div>
            <div id="logout">
              <button className="logout" onClick={logOut}>
                <MdOutlineLogout />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SideIcons;
