import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { AiFillEdit } from 'react-icons/ai';
import { BsCamera, BsImages } from 'react-icons/bs';
import { HiOutlineCamera } from 'react-icons/hi';
import { fileUploadRoute } from '../Utils/APIRoutes';
import Camera from './Camera';
import CircularProgressBar from './CircularProgressBar';
import { CompletedSign } from './CompletedSign';
import EditProfileModal from './EditProfileModal';
import ImageView from './ImageView';

const DeviceProfile = ({
  currentUser,
  setIsProfilePictureSet,
  isCompleted,
  setIsCompleted,
  setcurrentUser}) => {
  const [file, setFile] = useState("");
  const [pictureChangeMode, setpictureChangeMode] = useState(false);
  const [isuploading, setIsUploading] = useState(false);
  const [takePicture, setTakePicture] = useState(false);
  const [viewProfilePicture, setViewProfilePicture] = useState(false);
  const [editMode, setEditMode] = useState(false)

  const openClose = () => {
    setpictureChangeMode(!pictureChangeMode);
  };

  useEffect(() => {
    if (file !== "") {
      uploadFile();
    }
  }, [file]);

console.log(currentUser);
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
        fileUploadRoute,
        {
          file,
          id: currentUser._id,
        },
        {
          onUploadProgress: (data) => {
            console.log(data.bytes, data.progress, data.total);
          },
        }
      )
      .then((data) => {
        if (data.data.status) {
          setIsUploading(true);
          console.log(data.data.message);
          localStorage.setItem("current_user", JSON.stringify(data.data.user));
          setIsProfilePictureSet(true);
          setFile("");
        } else {
          console.log(data.data.message);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
     <div className="contacts-container d-md-none px-4 text-white">
      <h3 className="text-center text-white py-4">Profile</h3>
      <div className="contacts deviceProfile">
        {currentUser && (
          <div className="profile px-sm-4">
            <div className="cover my-5">
              <div className="image">
                <img
                  onClick={() => setViewProfilePicture(true)}
                  src={currentUser.profileImage}
                  alt=""
                />
              </div>
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
            </div>
            <div className="mx-md-5">
              <h4>
                <span>Name:</span> {currentUser.firstName} {currentUser.lastName}
              </h4>
              <h5>
                <span>Username:</span> {currentUser.userName}
              </h5>
              <h6>
                <span>Email: </span>
                {currentUser.email}
              </h6>
              <button type="submit" className="profileEdit float-end" onClick={()=>setEditMode(true)}><AiFillEdit size={30}/></button>
            
            </div>
          </div>
        )}
      </div>
        {takePicture && (
          <Camera setTakePicture={setTakePicture} setFile={setFile} />
        )}
        {viewProfilePicture && (
          <ImageView
            setViewProfilePicture={setViewProfilePicture}
            currentUser={currentUser}
          />
        )}
        {editMode && <EditProfileModal setcurrentUser={setcurrentUser} currentUser={currentUser} setEditMode={setEditMode}/>}
    </div>
  )
}

export default DeviceProfile