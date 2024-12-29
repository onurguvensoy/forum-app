import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    identifier: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});

  const { identifier, password } = inputValue;

  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    // Identifier validation (email or phone)
    if (!identifier) {
      handleError("Email or phone number is required");
      tempErrors.identifier = "This field is required";
      isValid = false;
    } else {
      // Check if it's an email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      // Check if it's a phone number (with or without country code)
      const phoneRegex = /^\+?[0-9]{10,15}$/;
      const cleanIdentifier = identifier.replace(/\D/g, '');

      if (!emailRegex.test(identifier) && !phoneRegex.test(cleanIdentifier)) {
        handleError("Please enter a valid email or phone number");
        tempErrors.identifier = "Invalid format";
        isValid = false;
      }
    }

    // Password validation
    if (!password) {
      handleError("Password is required");
      tempErrors.password = "This field is required";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/auth/login",
        {
          identifier: identifier.includes('@') ? identifier : identifier.replace(/\D/g, ''),
          password,
          rememberMe
        },
        { withCredentials: true }
      );

      if (data.success) {
        handleSuccess("Login successful!");
        setTimeout(() => {
          navigate("/");
        }, 500);
      }
    } catch (error) {
      if (error.response?.data?.message) {
        if (error.response.data.message === "Invalid credentials") {
          handleError("Invalid email/phone or password");
        } else {
          handleError(error.response.data.message);
        }
      } else if (error.request) {
        handleError("Unable to connect to server. Please check your internet connection");
      } else {
        handleError("Something went wrong. Please try again later");
      }
    }
  };

  const handleError = (err) =>
    toast.error(err, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      style: {
        backgroundColor: "#1a1a1a",
        border: "1px solid #dc2626",
        borderRadius: "4px",
        color: "#ffffff",
      },
    });

  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      style: {
        backgroundColor: "#1a1a1a",
        border: "1px solid #10b981",
        borderRadius: "4px",
        color: "#ffffff",
      },
    });

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2>Login Account</h2>
        
        <div className="form-group">
          <label>Email or Phone</label>
          <input
            type="text"
            name="identifier"
            value={identifier}
            placeholder="Enter your email or phone"
            onChange={handleOnChange}
            onKeyPress={handleKeyPress}
            className={errors.identifier ? "error" : ""}
          />
          {errors.identifier && <span className="error-message">{errors.identifier}</span>}
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={password}
            placeholder="Enter your password"
            onChange={handleOnChange}
            onKeyPress={handleKeyPress}
            className={errors.password ? "error" : ""}
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <div className="form-group remember-me">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span>Remember me</span>
          </label>
        </div>

        <button type="submit" className="submit-btn" onClick={handleSubmit}>
          Sign-in to ForWhom
        </button>

        <div className="divider">
          <span>OR</span>
        </div>

        <div className="social-buttons">
          <button className="social-btn">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.2 17.64 11.9 17.64 9.2z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.046l3.007-2.339z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.3C4.672 5.173 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button className="social-btn">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M9 0C4.026 0 0 4.026 0 9c0 3.975 2.578 7.344 6.156 8.531.45.082.619-.191.619-.425 0-.212-.011-.92-.011-1.675-2.262.416-2.844-.544-3.026-1.045-.101-.259-.544-1.05-.919-1.263-.314-.169-.763-.585-.011-.596.706-.011 1.21.65 1.378.919.806 1.357 2.097.975 2.611.739.079-.585.315-.975.574-1.2-2.006-.225-4.103-1.004-4.103-4.456 0-.986.349-1.796.924-2.428-.09-.225-.404-1.147.09-2.384 0 0 .754-.236 2.475.919a8.36 8.36 0 012.25-.304c.765 0 1.53.101 2.25.304 1.721-1.166 2.475-.919 2.475-.919.495 1.237.18 2.159.09 2.384.575.632.924 1.431.924 2.428 0 3.463-2.109 4.231-4.116 4.456.326.281.607.821.607 1.665 0 1.2-.011 2.164-.011 2.463 0 .236.169.52.619.425A9.008 9.008 0 0018 9c0-4.974-4.026-9-9-9z"/>
            </svg>
            GitHub
          </button>
        </div>

        <div className="signup-link">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;