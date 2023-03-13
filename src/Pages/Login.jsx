import axios from "axios";
import React, { useEffect, useState } from "react";
import { BsFillChatFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import ToastContainer from "../Components/Toast/Toast";
import { setToast } from "../Components/Toast/toastUtils";
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
}else{
setToast("error",data.message)
}
  };

  return (
    <div className="auth-container">
      <form onSubmit={(event) => handleSubmit(event)}>
        <div className="brand">
          <BsFillChatFill size={50}/>
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
      <ToastContainer/>
    </div>
  );
};

export default Login;
