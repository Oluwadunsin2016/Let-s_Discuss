import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { BsCamera, BsImages } from "react-icons/bs";
import { HiOutlineCamera } from "react-icons/hi";
import { AiFillEdit } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import groupImg from "../asset/groupImage.png";
import { getMembersRoute, groupFileUploadRoute, groupNameUpdateRoute } from "../Utils/APIRoutes";
import Camera from "./Camera";
import CircularProgressBar from "./CircularProgressBar";
import { CompletedSign } from "./CompletedSign";
import ImageView from "./ImageView";
import { useRef } from "react";

const GroupInformation = ({ currentGroup,currentUser, setIsProfilePictureSet,
  isCompleted,
  setIsCompleted,setCurrentGroup,setCurrentPosition,setCurrentMember}) => {
  const inputRef=useRef()
  const [members, setMembers] = useState([]);
  const [groupAdmin, setGroupAdmin] = useState("");
  const [date, setDate] = useState({});
  const [time, setTime] = useState("");
    const [file, setFile] = useState("");
  const [pictureChangeMode, setpictureChangeMode] = useState(false);
  const [isuploading, setIsUploading] = useState(false);
  const [takePicture, setTakePicture] = useState(false);
  const [viewProfilePicture, setViewProfilePicture] = useState(false);
  const [groupEditMode, setGroupEditMode] = useState(false)

  useEffect(() => {
    getGroupMembers();
  }, [currentGroup]);
  useEffect(() => {
    if (members) {
      getAdmin();
    }
  }, [currentGroup, members]);

  const getAdmin = () => {
    const admin = members.find((member) => member._id == currentGroup.admin);
    setGroupAdmin(admin);


    const dateObj = new Date(currentGroup.createdAt);

    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();

    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);

    const timeIn12Hrs = date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    setDate({ year, month, day });
    setTime(timeIn12Hrs);
  };

  const getGroupMembers = async () => {
    console.log(currentGroup);
    const { data } = await axios.post(getMembersRoute, {
      group: currentGroup._id,
    });
    console.log(data);
    const memberIds = data.members.map((member) => member.member);
    console.log(memberIds);
    setMembers(data.users.filter((user) => memberIds.includes(user._id)));
  };

  const openClose = () => {
    setpictureChangeMode(!pictureChangeMode);
  };

  useEffect(() => {
    if (file !== "") {
      uploadFile();
    }
  }, [file]);

  const getFile = (e) => {
    const myFile = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(myFile);
    reader.onload = () => {
      setFile(reader.result);
    };
  };

  const uploadFile = () => {
    axios
      .post(
        groupFileUploadRoute,
        {
          file,
          id: currentGroup._id,
        },
        {
          onUploadProgress: (data) => {
            console.log(data.bytes, data.progress, data.total);
          },
        }
      )
      .then((data) => {
        if (data.data.success) {
          setIsUploading(true);
          console.log(data.data.message);
          setIsProfilePictureSet(true);
          setCurrentGroup(data.data.group)
          setFile("");
        } else {
          console.log(data.data.message);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };


  const updateGroupName=async(e)=>{
  e.preventDefault();
  console.log(inputRef.current.value);
  const {data}=await axios.post(groupNameUpdateRoute,{name:inputRef.current.value,id: currentGroup._id})
  if (data.success) {
    setCurrentGroup(data.group)
    setGroupEditMode(false)
  }
  }

  const viewMemberDetails=(name,id)=>{
  if (currentUser._id!=id) {
  const selectedMember = members.find((member) => member._id == id);
    setCurrentMember(selectedMember)
    setCurrentPosition(name)
  }
  }

  return (
    <div className="contacts-container px-4">
      <h3 className="text-center text-white py-4">Group Information</h3>
      <div className="contacts">
        <div className="groupInfo text-white mb-5">
          <div className="cover">
            <div className="image">
              <img
                onClick={() => setViewProfilePicture(true)}
                src={currentGroup.profileImage}
                alt=""
              />
            </div>
            
          {currentUser._id == currentGroup.admin &&  <div>
            <div className="camera" onClick={openClose}>
              <HiOutlineCamera />
            </div>
            {isuploading && (
                <div className="uploading">
                  {isCompleted ? (
                    <CompletedSign
                      setIsUploading={setIsUploading}
                      setIsCompleted={setIsCompleted}
                    />
                  ) : (
                    <CircularProgressBar
                      setIsCompleted={setIsCompleted}
                      isuploading={isuploading}
                    />
                  )}
                </div>
              )}
              {pictureChangeMode && (
                <div className="gallery">
                  <div
                    className="get-picture"
                    onClick={() => setTakePicture(true)}
                  >
                    <BsCamera />
                  </div>
                  <div className="get-picture">
                    <BsImages />
                    <input
                      className=""
                      type="file"
                      onChange={getFile}
                      name=""
                      id=""
                    />
                  </div>
                </div>
              )}
           </div>}
          </div>
          <h4 className="text-center">{currentGroup.name}</h4>
          <h6 className="text-center">
            {members.length} {members.length < 1 ? "participant" : "participants"}
          </h6>
          {groupAdmin && (
            <span className="text-center">
              <p>
                created by {groupAdmin.firstName} on{" "}
                {`${date.day}/${date.month}/${date.year}`}
              </p>{" "}
              <p>Time: {`${time}`}</p>
            </span>
          )}
          {currentUser._id == currentGroup.admin && <div className="d-flex justify-content-end">{groupEditMode? <IoMdClose size={45} className="me-3 p-2 editBtnClose shadow" onClick={()=>setGroupEditMode(false)} />:<AiFillEdit size={45} className="me-3 p-2 editBtnOpen shadow" onClick={()=>setGroupEditMode(true)} />}</div> }
{groupEditMode &&  <form className="mx-3" onSubmit={updateGroupName}>
          <h4 className="text-center mb-3">Edit Group Name</h4>
          <div className="input-group">
          <input ref={inputRef} type="text" className="form-control" name="" id="" defaultValue={currentGroup.name}/>
          <button type="submit" className="btn btn-success input-group-append">Save</button>
          </div>
          </form>}
        </div>
        <h5 className="text-white text-center">Group members</h5>
        {members.map((member) => {
          return (
            <div className="contact thisMember" key={member._id} onClick={()=>viewMemberDetails("Current Member",member._id)}>
              <div className="image">
                <img
                  onClick={() => setViewProfilePicture(true)}
                  src={member.profileImage}
                  alt="picture"
                />
              </div>
              <div className="username text-white w-100">
                {member._id == currentGroup.admin ? (
                  <div className="admin">
                    <h5>{member.userName}</h5> <span>admin</span>
                  </div>
                ) : (
                  <h5>{member.userName}</h5>
                )}
              </div>
            </div>
          );
        })}
      </div>
       {takePicture && (
          <Camera setTakePicture={setTakePicture} setFile={setFile} />
        )}
      {viewProfilePicture && (
        <ImageView
          setViewProfilePicture={setViewProfilePicture}
          profile={groupImg}
          currentUser={currentGroup}
        />
      )}
    </div>
  );
};

export default GroupInformation;
