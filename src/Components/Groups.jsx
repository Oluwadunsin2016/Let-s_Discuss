import React, { useEffect, useState } from "react";
import profile from '../asset/default_user_image.png'

const Groups = ({ contacts,changeChat }) => {
  const [currentSelected, setCurrentSelected] = useState(undefined);

const changeCurrentChat=(contact,id)=>{
setCurrentSelected(id)
changeChat(contact)
}


  return (
    <div className="contacts-container px-4">
      <h3 className="text-center text-white py-4">Groups</h3>
      <div className="contacts">
        {contacts.map((contact) => {
          return (
            <div className={`contact ${currentSelected===contact._id?'selected':null}`} key={contact._id} onClick={()=>changeCurrentChat(contact,contact._id)} >
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

export default Groups;
