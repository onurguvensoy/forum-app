import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Form = () => {
  const [username, setUsername] = useState("");
  const [inputValue, setInputValue] = useState({
    title: "",
    content: "",
  });
  
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/getusername", {
          withCredentials: true, 
        });

        if (data.status) {
          setUsername(data.username); 
        } else {
          console.error("Failed to fetch username");
          toast.error("Failed to fetch username", { theme: "dark" });
        }
      } catch (error) {
        console.error("Error fetching username:", error);
        toast.error("Error fetching username", { theme: "dark" });
      }
    };

    fetchUsername();
  }, []);

  const { title, content } = inputValue;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleError = (err) =>
    toast.error(err, {
      position: "top-right",
      autoClose: 2000,
      closeButton: false,
      hideProgressBar: false,
      theme: "dark",
    });

  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "top-right",
      autoClose: 2000,
      closeButton: false,
      hideProgressBar: false,
      theme: "dark",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username) {
      handleError("Username not found. Please log in again.");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:4000/entry",
        {
          ...inputValue,
          username: username,
        },
        { withCredentials: true }
      );

      const { success, message } = data;
      if (success) {
        handleSuccess(message);
        setInputValue({ title: "", content: "" }); 
      } else {
        handleError(message);
      }
    } catch (error) {
      console.error("Error during submission:", error);
      handleError("Submission failed.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          placeholder="Please Type Title..."
          onChange={handleOnChange}
        />
        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          name="content"
          value={content}
          onChange={handleOnChange}
          placeholder="Please Type Content..."
        />
        <button type="submit">Submit</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Form;
