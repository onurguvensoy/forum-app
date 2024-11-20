import React from "react";

const Entry = ({ title, content,username}) => {
  return (
    <div className="entry">
      <h2>{title}</h2>
      <p>{content}</p>
      <h4>{username}</h4>
    </div>
  );
};

export default Entry;
