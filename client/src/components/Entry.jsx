import React from "react";
import { Link } from "react-router-dom";

const Entry = ({ _id, title, content, username }) => {
    return (
        <Link to={`/entries/${_id}`}>
            <div className="entry">
                <h2>{title}</h2>
                <p className="entry-content">{content}</p> {/* entry-content class eklendi */}
                <h1>{username}</h1>
            </div>
        </Link>
    );
};

export default Entry;