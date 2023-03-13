import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { MdOutlineClose } from 'react-icons/md'
import { editUserRoute } from '../Utils/APIRoutes'
import "animate.css"

const EditProfileModal = ({currentUser,setEditMode,setcurrentUser}) => {
const [values, setValues] = useState({
firstName:currentUser.firstName,
lastName:currentUser.lastName,
userName:currentUser.userName,
email:currentUser.email,
})

console.log(currentUser);

const handleChange=(e)=>{
e.preventDefault()
setValues({...values,[e.target.name]:e.target.value})
}

const handleSubmit=async(e)=>{
e.preventDefault()
const {data}=await axios.post(editUserRoute,{...values,id:currentUser._id})
console.log(data);
if (data.status) {
    localStorage.setItem("current_user", JSON.stringify(data.user));
    setcurrentUser(data.user)
    closeIt()
}
}

const closeIt = () => {
    document.querySelector(".comeIn").classList.remove("animate__fadeInDown");
    document.querySelector(".comeIn").classList.add("animate__fadeOutUp");
    setEditMode(false);
   setTimeout(()=>{
    document.querySelector(".comeIn").classList.remove("animate__fadeOutUp");
    document.querySelector(".comeIn").classList.add("animate__fadeInDown");
   },1000)
  };


  return (
<>
 <div className="edit-container">
        {currentUser && <form className='comeIn animate__animated animate__fadeInDown' onSubmit={handleSubmit}>
        <div className="close" onClick={closeIt}>
              <MdOutlineClose />
            </div>
            <h3 className='text-center text-white'>Edit Profile</h3>
          <input
            type="text"
            placeholder="First Name"
            name="firstName"
            id=""
            value={values.firstName}
            onChange={(e) => handleChange(e)}
          />
          <input
            type="text"
            placeholder="Last Name"
            name="lastName"
            id=""
            value={values.lastName}
            onChange={(e) => handleChange(e)}
          />
          <input
            type="text"
            placeholder="Username"
            name="userName"
            id=""
            value={values.userName}
            onChange={(e) => handleChange(e)}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            id=""
            value={values.email}
            onChange={(e) => handleChange(e)}
          />

          <button type="submit">Update User</button>
        </form>}
      </div>
</>

  )
}

export default EditProfileModal