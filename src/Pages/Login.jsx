import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from '../asset/logo.svg'
import { loginRoute } from "../Utils/APIRoutes";

const Login = () => {
const navigate=useNavigate()
  const [values, setvalues] = useState({
    userName: "",
    password: ""
  });

   useEffect(() => {
    if (localStorage.current_user||localStorage.current_user!==undefined) {
      navigate("/");
    }
  }, []);

  

  const handleChange = async(e) => {
    e.preventDefault();
    setvalues({ ...values, [e.target.name]: e.target.value });
  };
  const handleSubmit = async(e) => {
    e.preventDefault();
const {data}=await axios.post(loginRoute,values)
console.log(data);
if (data.status) {
   localStorage.setItem("current_user", JSON.stringify(data.user));
      navigate("/");
}
  };

  return (
    <div className="auth-container">
      <form onSubmit={(event) => handleSubmit(event)}>
        <div className="brand">
          <img src={Logo} alt="logo" />
          <h3>Let's Discuss</h3>
        </div>
        <input
          type="text"
          placeholder="Username"
          name="userName"
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
        <button type="submit">Login</button>
          <span>
            Don't have an account? <Link to="/register">Register here</Link>
          </span>
      </form>
    </div>
  );
};

export default Login;
