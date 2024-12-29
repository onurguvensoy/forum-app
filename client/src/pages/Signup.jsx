import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Signup.css";
import { CountryCode } from '../utils/CountryCodes';

const Signup = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState("");
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
  });
  const [showErrorBubble, setShowErrorBubble] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
    phoneNumber: false,
  });
  const [selectedCountry, setSelectedCountry] = useState("+90");

  const { email, username, password, confirmPassword, phoneNumber } = inputValue;

  const checkPasswordStrength = (password) => {
    const requirements = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const strength = Object.values(requirements).filter(Boolean).length;

    // Update password requirements state
    setPasswordRequirements(requirements);

    if (strength === 0) return "";
    if (strength <= 2) return "weak";
    if (strength <= 4) return "medium";
    return "strong";
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });

    // Show error bubble on focus
    setShowErrorBubble({
      ...showErrorBubble,
      [name]: true,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }

    // Update password strength
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      handleError("Email address is required");
      tempErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(email)) {
      handleError("Please enter a valid email address");
      tempErrors.email = "Invalid email format";
      isValid = false;
    }

    // Username validation
    if (!username) {
      handleError("Username is required");
      tempErrors.username = "Username is required";
      isValid = false;
    } else if (username.length < 3) {
      handleError("Username must be at least 3 characters long");
      tempErrors.username = "Too short";
      isValid = false;
    }

    // Password validation
    if (!password) {
      handleError("Password is required");
      tempErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 8) {
      handleError("Password must be at least 8 characters long");
      tempErrors.password = "Too short";
      isValid = false;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      handleError("Passwords do not match");
      tempErrors.confirmPassword = "Passwords don't match";
      isValid = false;
    }

    // Phone number validation
    const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
    if (!phoneNumber) {
      handleError("Phone number is required");
      tempErrors.phoneNumber = "Phone number is required";
      isValid = false;
    } else if (cleanPhoneNumber.length < 10 || cleanPhoneNumber.length > 15) {
      handleError("Please enter a valid phone number");
      tempErrors.phoneNumber = "Invalid phone number";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
      const fullPhoneNumber = `${selectedCountry}${cleanPhoneNumber}`;
      
      const { data } = await axios.post(
        "http://localhost:4000/api/auth/signup",
        {
          email,
          username,
          password,
          phoneNumber: fullPhoneNumber,
        },
        { withCredentials: true }
      );

      if (data.success) {
        handleSuccess("Account created successfully! Redirecting...");
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (error) {
      if (error.response?.data?.message) {
        // Handle specific error messages from server
        const errorMessage = error.response.data.message;
        
        if (errorMessage.includes("duplicate key")) {
          if (errorMessage.toLowerCase().includes("email")) {
            handleError("This email is already registered");
          } else if (errorMessage.toLowerCase().includes("username")) {
            handleError("This username is already taken");
          } else if (errorMessage.toLowerCase().includes("phonenumber")) {
            handleError("This phone number is already registered");
          }
        } else if (errorMessage.includes("validation failed")) {
          handleError("Please check your input and try again");
        } else {
          handleError(errorMessage);
        }
      } else if (error.request) {
        // Network error
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

  const handleClickOutside = (e) => {
    if (!e.target.closest('.form-group')) {
      setShowErrorBubble({
        username: false,
        email: false,
        password: false,
        confirmPassword: false,
        phoneNumber: false,
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="signup-wrapper">
      <div className="signup-container">
        <h2>Signup Account</h2>
        
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={username}
            placeholder="Enter your username"
            onChange={handleOnChange}
            onKeyPress={handleKeyPress}
            className={errors.username ? "error" : ""}
          />
          {errors.username && <span className="error-message">{errors.username}</span>}
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={email}
            placeholder="Enter your email"
            onChange={handleOnChange}
            onKeyPress={handleKeyPress}
            className={errors.email ? "error" : ""}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label>Password</label>
          <div className="input-wrapper">
            <input
              type="password"
              name="password"
              value={password}
              placeholder="Enter your password"
              onChange={handleOnChange}
              onKeyPress={handleKeyPress}
              onFocus={() => setShowErrorBubble({ ...showErrorBubble, password: true })}
              className={errors.password ? "error" : ""}
            />
            {showErrorBubble.password && (
              <div className="error-bubble">
                <div className="error-bubble-content">
                  <div className="error-bubble-header">Password Requirements:</div>
                  <div className="password-requirements">
                    <div className={`requirement ${passwordRequirements.length ? 'met' : ''}`}>
                      <span className="icon">{passwordRequirements.length ? '✓' : '×'}</span>
                      At least 8 characters
                    </div>
                    <div className={`requirement ${passwordRequirements.lowercase ? 'met' : ''}`}>
                      <span className="icon">{passwordRequirements.lowercase ? '✓' : '×'}</span>
                      One lowercase letter
                    </div>
                    <div className={`requirement ${passwordRequirements.uppercase ? 'met' : ''}`}>
                      <span className="icon">{passwordRequirements.uppercase ? '✓' : '×'}</span>
                      One uppercase letter
                    </div>
                    <div className={`requirement ${passwordRequirements.number ? 'met' : ''}`}>
                      <span className="icon">{passwordRequirements.number ? '✓' : '×'}</span>
                      One number
                    </div>
                    <div className={`requirement ${passwordRequirements.special ? 'met' : ''}`}>
                      <span className="icon">{passwordRequirements.special ? '✓' : '×'}</span>
                      One special character
                    </div>
                  </div>
                </div>
                <div className="error-bubble-arrow"></div>
              </div>
            )}
          </div>
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            placeholder="Confirm your password"
            onChange={handleOnChange}
            onKeyPress={handleKeyPress}
            className={errors.confirmPassword ? "error" : ""}
          />
          {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <div className="phone-input-wrapper">
            <select 
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="country-select"
            >
              {CountryCode.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.code}
                </option>
              ))}
            </select>
            <input
              type="tel"
              name="phoneNumber"
              value={phoneNumber}
              placeholder="Enter your phone number"
              onChange={handleOnChange}
              onKeyPress={handleKeyPress}
              className={errors.phoneNumber ? "error" : ""}
            />
          </div>
          {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
        </div>

        <button type="submit" className="submit-btn" onClick={handleSubmit}>
          Sign-up to ForWhom
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

        <div className="login-link">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signup;
