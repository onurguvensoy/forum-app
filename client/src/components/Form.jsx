import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useUser } from "../utils/userProvider";
import { filterAllWords, hasMinimumChars, hasExceededCharLimit } from "../utils/wordFilter";

const MIN_TITLE_CHARS = 5;
const MIN_CONTENT_CHARS = 20;
const MAX_TITLE_CHARS = 25;
const MAX_CONTENT_CHARS = 250;

const Form = () => {
    const [inputValue, setInputValue] = useState({
        title: "",
        content: "",
    });

    const { username } = useUser();
    const { title, content } = inputValue;

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        const filteredValue = filterAllWords(value);

        if (name === "title") {
            if (hasExceededCharLimit(filteredValue, MAX_TITLE_CHARS)) {
                toast.error("Title exceeds character limit.");
                return;
            }
        } else if (name === "content") {
            if (hasExceededCharLimit(filteredValue, MAX_CONTENT_CHARS)) {
                toast.error("Content exceeds character limit.");
                return;
            }
        }

        setInputValue({
            ...inputValue,
            [name]: filteredValue.substring(
                0,
                name === "title" ? MAX_TITLE_CHARS : MAX_CONTENT_CHARS
            ),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!hasMinimumChars(title, MIN_TITLE_CHARS)) {
            toast.error(`Title must have at least ${MIN_TITLE_CHARS} characters.`);
            return;
        }

        if (!hasMinimumChars(content, MIN_CONTENT_CHARS)) {
            toast.error(`Content must have at least ${MIN_CONTENT_CHARS} characters.`);
            return;
        }

        if (hasExceededCharLimit(title, MAX_TITLE_CHARS)) {
            toast.error(`Title cannot exceed ${MAX_TITLE_CHARS} characters.`);
            return;
        }

        if (hasExceededCharLimit(content, MAX_CONTENT_CHARS)) {
            toast.error(`Content cannot exceed ${MAX_CONTENT_CHARS} characters.`);
            return;
        }

        try {
            const filteredTitle = filterAllWords(title);
            const filteredContent = filterAllWords(content);

            const { data } = await axios.post(
                "http://localhost:4000/entry",
                {
                    title: filteredTitle,
                    content: filteredContent,
                    username: username,
                },
                { withCredentials: true }
            );

            const { success, message } = data;
            if (success) {
                toast.success(message);
                setInputValue({ title: "", content: "" });
            } else {
                toast.error(message);
            }
        } catch (error) {
            console.error("Error during submission:", error);
            toast.error("Submission failed.");
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
                    maxLength={MAX_TITLE_CHARS}
                />
                <p>{title.length}/{MAX_TITLE_CHARS}</p>

                <label htmlFor="content">Content:</label>
                <textarea
                    id="content"
                    name="content"
                    value={content}
                    onChange={handleOnChange}
                    placeholder="Please Type Content..."
                    maxLength={MAX_CONTENT_CHARS}
                />
                <p>{content.length}/{MAX_CONTENT_CHARS}</p>

                <button type="submit">Submit</button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default Form;