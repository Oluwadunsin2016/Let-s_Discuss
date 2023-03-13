import React, { useState, useEffect } from "react";
import { MdOutlineClose } from "react-icons/md";
import toastHook from "./hook";

import "./toast.css";
import { initialToast } from "./toastUtils";

const ToastContainer = () => {
  const [myToast, setMyToast] = useState({});
  const [toastify, setToastify] = useState({status:"",message:"",position:""})
const [showToast, setShowToast] = useState(false);
  
  useEffect(() => {
    getToast();
  }, [toastify]);

  useEffect(() => {
    if (showToast) {
      setTimeout(() => {
        setShowToast(false);
      }, 5000);
    }
  }, [showToast]);

  const getToast = () => {
    if (toastHook.success().title == toastify.status.toUpperCase()) {
      setMyToast(toastHook.success(toastify.message, toastify.position));
    } else if (toastHook.error().title == toastify.status.toUpperCase()) {
      setMyToast(toastHook.error(toastify.message, toastify.position));
    } else if (toastHook.info().title == toastify.status.toUpperCase()) {
      setMyToast(toastHook.info(toastify.message, toastify.position));
    } else if (toastHook.warning().title == toastify.status.toUpperCase()) {
      setMyToast(toastHook.warning(toastify.message, toastify.position));
    }
  };

  const selfClose = () => {
    setShowToast(false);
  };

  useEffect(() => {
initialToast(setToastify,setShowToast)
  }, [setToastify,setShowToast])

  return (
    <>
      {showToast && (
        <div
          className={`notification-container p-2 text-white rounded shadow ${myToast.position}`}
          style={{ backgroundColor: myToast.backgroundColor }}
        >
          <MdOutlineClose size={20} className="float-end selfClose" onClick={selfClose} />
          <div className="d-flex">
            <div className="fs-3 me-2">{myToast.icon}</div>
            <div>
              <h6 className="notification-title">{myToast.title}</h6>
              <p className="desc">{myToast.description}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ToastContainer;