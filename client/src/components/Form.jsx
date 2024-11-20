import React, {useState,useEffect} from 'react';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
const Form = () => {
  const [inputValue, setInputValue] = useState({
    title: "",
    content: "",
  });
  const { title, content } = inputValue;
  const [username, setUsername] = useState("")
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/user");
        setUsername(data.username);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
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
    try {
      const { data } = await axios.post(
        "http://localhost:4000/entry",
        {
          ...inputValue,
          username,
        },
        { withCredentials: true }
      );
  
      const { success, message } = data;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {}, 1000);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.log(error);
    }
    setInputValue({
      title: "",
      content: "",
    });
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
          placeholder="Please Type..."
          onChange={handleOnChange}
        />
        <label htmlFor="content">Content:</label>
        <input
          id="content"
          name="content"
          value={content}
          onChange={handleOnChange}
        />
        <button type="submit">Submit</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Form;