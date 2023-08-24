import axios from "axios";
import React, { useEffect, useState } from "react";
import profile from "../asset/default_user_image.png";
import { addMemberRoute, getMembersRoute } from "../Utils/APIRoutes";
import { BiArrowBack } from "react-icons/bi";
import ToastContainer from "./Toast/Toast";
import { setToast } from "./Toast/toastUtils";

const AddGroupMember = ({ currentGroup, showChat }) => {
const [isLoading, setIsLoading] = useState(false)
  const [availableContacts, setAvailableContacts] = useState([]);

  useEffect(() => {
    getAvailableContacts();
  }, [currentGroup]);

  const getAvailableContacts = () => {
  setIsLoading(true)
    axios.post(getMembersRoute, { group: currentGroup._id }).then((res) => {
      const data = res.data;
      const memberIds = data.members.map((member) => member.member);
      console.log(memberIds);
      setAvailableContacts(
        data.users.filter((user) => !memberIds.includes(user._id))
      );
  setIsLoading(false)
    });
  };

  const addMember = async (member) => {
    const infos = { member, group: currentGroup };
    const {data} = await axios.post(addMemberRoute, infos);
    console.log(data);
    if (data.success) {
      setToast("success",data.message)
    }else{
      setToast("error",data.message)
    }
  };
  return (
    <div className="contacts-container px-4">
      <div className="d-flex py-4">
        <div className="back text-white me-2 d-md-none" onClick={showChat}>
          <BiArrowBack size={25} />
        </div>
        <h3 className="text-center text-white w-100">Add Member</h3>
      </div>
      <ToastContainer/>
      {isLoading? <div className="d-flex justify-content-center align-items-center mt-5">
        <div class="spinner-border text-light mx-auto" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
       </div> : <div className="contacts">{availableContacts.map((contact) => {
          return (
            <div
              className="contact addGroup"
              onClick={() => addMember(contact._id)}
              key={contact._id}
            >
              <div className="image">
                <img
                  src={
                    contact.isProfileImageSet ? contact.profileImage : profile
                  }
                  alt="picture"
                />
              </div>
              <div className="username text-white">
                <h4>{contact.userName}</h4>
              </div>
            </div>
          );
        })}</div>}
    </div>
  );
};

export default AddGroupMember;
