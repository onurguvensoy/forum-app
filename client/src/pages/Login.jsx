import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });
  const { email, password } = inputValue;
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };
  const handleError = (err) =>
    toast.error(err, {
      className: "error-toast",
      position: "top-right",
      autoClose: 2000,
      closeButton: false,
      hideProgressBar: false,
      theme: "dark",
    });
  const handleSuccess = (msg) =>
    toast.success(msg, {
      className: "success-toast",
      position: "top-right",
      autoClose: 10000,
      closeButton: false,
      hideProgressBar: false,
      theme: "dark",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/login",
        {
          ...inputValue,
        },
        { withCredentials: true }
      );
      console.log(data);
      const { success, message } = data;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        handleError(message);
    }
  } catch (error) {
    console.log(error);
  }
  setInputValue({
    ...inputValue,
    email: "",
    password: "",
  });
};

return (
<div className="form-wrapper">
  <div className="form_container">
    <h2>Login Account</h2>
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email</label>
        <input
        id="email"
          type="email"
          name="email"
          value={email}
          placeholder="Enter your email"
          onChange={handleOnChange}
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
        id="password"
          type="password"
          name="password"
          value={password}
          placeholder="Enter your password"
          onChange={handleOnChange}
        />
      </div>
      <button
      id="login-button"
       type="submit">Submit</button>
      <span>
        Already have an account? <Link to={"/signup"}>Signup</Link>
      </span>
    </form>
    <ToastContainer />
  </div>
 </div> 
);
};

export default Login;