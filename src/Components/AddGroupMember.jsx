import axios from "axios";
import React, { useEffect, useState } from "react";
import profile from "../asset/default_user_image.png";
import { addMemberRoute, getMembersRoute } from "../Utils/APIRoutes";
import { BiArrowBack } from "react-icons/bi";

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
    const data = { member, group: currentGroup };
    const response = await axios.post(addMemberRoute, data);
    console.log(response);
  };
  return (
    <div className="contacts-container px-4">
      <div className="d-flex py-4">
        <div className="back text-white me-2 d-md-none" onClick={showChat}>
          <BiArrowBack size={25} />
        </div>
        <h3 className="text-center text-white w-100">Add Member</h3>
      </div>
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
