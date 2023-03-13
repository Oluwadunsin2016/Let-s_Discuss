import axios from "axios";
import React, { useEffect, useState } from "react";
import { BsFillChatFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../asset/logo.svg";
import ToastContainer from "../Components/Toast/Toast";
import { setToast } from "../Components/Toast/toastUtils";
import { registerRoute } from "../Utils/APIRoutes";

const Register = () => {
    const navigate = useNavigate();

  const [values, setvalues] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

     useEffect(() => {
    if (localStorage.current_user||localStorage.current_user!==undefined) {
      navigate("/");
    }
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    setvalues({ ...values, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleVerification()) {
    const { firstName, lastName, userName, email, password } = values;

    const { data } = await axios.post(registerRoute, {
      firstName,
      lastName,
      userName,
      email,
      password,
    });
    console.log(data);
    if (data.status) {
    setToast("success","Registration successful")
      localStorage.setItem("current_user", JSON.stringify(data.user));
      navigate("/");
    }else{
    setToast("error",data.message)
    }
    }
  };




  const handleVerification = () => {
    const { firstName, lastName, userName, email, password, confirmPassword } =
      values;
    if (firstName.length < 3 || firstName.length > 20) {
     setToast("error","First name should not be less than 3 or greater than 20 characters")
      return false;
    } else if (lastName.length < 3 || lastName.length > 20) {
      setToast("error","Last name should not be less than 3 or greater than 20 characters")
      return false;
    } else if (userName.length < 3 || userName.length > 15) {
      setToast("error","Username should not be less than 3 or greater than 15 characters")
      return false;
    } else if (email === "") {
      setToast("error","Email is required")
      return false;
    } else if (password < 5) {
      setToast("error","Password should not be less than 5 characters")
      return false;
    } else if (confirmPassword !== password) {
      setToast("error","Password and confirm password should be the same")
      return false;
    }
    return true;
  };

  return (
    <>
      <div className="auth-container">
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
          <BsFillChatFill size={50}/>
            <h3>Let's Discuss</h3>
          </div>
          <input
            type="text"
            placeholder="First Name"
            name="firstName"
            id=""
            onChange={(e) => handleChange(e)}
          />
          <input
            type="text"
            placeholder="Last Name"
            name="lastName"
            id=""
            onChange={(e) => handleChange(e)}
          />
          <input
            type="text"
            placeholder="Username"
            name="userName"
            id=""
            onChange={(e) => handleChange(e)}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            id=""
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            id=""
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            id=""
            onChange={(e) => handleChange(e)}
          />

          <button type="submit">Create User</button>
          <span>
            Already have an account? <Link to="/login">Login here</Link>
          </span>
        </form>
        <ToastContainer/>
      </div>
    </>
  );
};

export default Register;
