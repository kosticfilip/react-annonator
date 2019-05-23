import React from "react";
import Button from "./Button";

const ToolBar = ({ toggleInit, options }) => {
  const buttons = Object.keys(options.types).map(type => {
    if (options.types[type]) {
      return <Button key={type} toggleInit={toggleInit} type={type} />;
    }
  });
  return <div className="__ra-navbar">{buttons}</div>;
};

export default ToolBar;
