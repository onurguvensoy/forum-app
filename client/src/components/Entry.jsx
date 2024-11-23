import React from "react";
import { Link } from "react-router-dom";
const Entry = ({ _id , title, content,username}) => {
  return (
    <Link to={`/${_id}`}>
    <div className="entry">
      <h2>{title}</h2>
      <p>{content}</p>
      <h4>{username}</h4>
    </div>
    </Link>
  );
};

export default Entry;
