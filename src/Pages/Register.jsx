import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Logo from "../asset/logo.svg";
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


  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const handleChange = (e) => {
    e.preventDefault();
    setvalues({ ...values, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (handleVerification()) {
    // }
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
      localStorage.setItem("current_user", JSON.stringify(data.user));
      navigate("/");
    }
  };


  const handleVerification = () => {
    const { firstName, lastName, userName, email, password, confirmPassword } =
      values;
    if (firstName.length < 3 || firstName.length > 20) {
      toast.error(
        "First Name should not be less than 3 or greater than 20 characters",
        toastOptions
      );
      return false;
    } else if (lastName.length < 3 || lastName.length > 20) {
      console.log("seen");
      toast.error(
        "Last Name should not be less than 3 or greater than 20 characters",
        toastOptions
      );
      return false;
    } else if (userName.length < 3 || userName.length > 15) {
      toast.error(
        "Username should not be less than 3 or greater than 15 characters",
        toastOptions
      );
      return false;
    } else if (email === "") {
      toast.error("Email is required", toastOptions);
      return false;
    } else if (password < 5) {
      toast.error(
        "Password should not be less than 5 characters",
        toastOptions
      );
      return false;
    } else if (confirmPassword !== password) {
      toast.error(
        "Password and confirm password should be the same",
        toastOptions
      );
      return false;
    }
    return true;
  };

  return (
    <>
      <div className="auth-container">
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="logo" />
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
        <ToastContainer />
      </div>
    </>
  );
};

export default Register;
