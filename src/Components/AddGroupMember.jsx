import axios from "axios";
import React from "react";
import profile from '../asset/default_user_image.png'
import { addMemberRoute } from "../Utils/APIRoutes";
import { BiArrowBack } from "react-icons/bi";

const AddGroupMember = ({contacts,currentGroup,showChat}) => {

const addMember=async(member)=>{
const data={member,group:currentGroup}
const response=await axios.post(addMemberRoute,data)
console.log(response);
}
  return (
    <div className="contacts-container px-4">
     <div className="d-flex py-4">
      <div className="back text-white me-2 d-md-none" onClick={showChat}>
        <BiArrowBack size={25} />
      </div>
      <h3 className="text-center text-white w-100">Add Member</h3>
     </div>
      <div className="contacts">
        {contacts.map((contact) => {
          return (
            <div className="contact addGroup" onClick={()=>addMember(contact._id)}  key={contact._id} >
              <div className="image">
                <img src={contact.isProfileImageSet? contact.profileImage:profile} alt="picture" />
              </div>
              <div className="username text-white">
                <h4>{contact.userName}</h4>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AddGroupMember;
