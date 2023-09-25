import React from "react";
import { Link } from "react-router-dom";
import cl from "./MyLink.module.css";

const MyLink = ({ text, linkTo, clickFunction, color, backColor }) => {
  return (
    <Link
      to={linkTo}
      onClick={clickFunction ? clickFunction : null}
      style={color && backColor && { color: color, backgroundColor: backColor, padding: '8px 16px' }}
      className={cl.MyLink}
    >
      {text}
    </Link>
  );
};

export default MyLink;
