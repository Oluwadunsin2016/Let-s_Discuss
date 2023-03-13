import React, { useEffect, useState } from "react";

const Contacts = ({ contacts,changeChat,setGroupMode,showChat }) => {
  const [currentSelected, setCurrentSelected] = useState(undefined);

const changeCurrentChat=(contact,id)=>{
setCurrentSelected(id)
changeChat(contact)
setGroupMode(false)
showChat()
}


  return (
    <div className="contacts-container px-4 pt-md-0 pt-4">
      <h3 className="text-center text-white py-4 d-none d-md-block">Contacts</h3>
      <div className="contacts">
        {contacts.map((contact) => {
          return (
            <div className={`contact ${currentSelected===contact._id?'selected':null}`} key={contact._id} onClick={()=>changeCurrentChat(contact,contact._id)} >
              <div className="image">
                <img src={contact.profileImage} alt="picture" />
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

export default Contacts;
