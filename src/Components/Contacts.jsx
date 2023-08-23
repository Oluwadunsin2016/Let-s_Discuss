import React, { useEffect, useState } from "react";

const Contacts = ({ contacts,changeChat,setGroupMode,showChat,isLoading }) => {
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
        {isLoading? <div className="d-flex justify-content-center align-items-center mt-5">
        <div className="spinner-border text-light mx-auto" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
       </div> 
       :
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
}
    </div>
  );
};

export default Contacts;
