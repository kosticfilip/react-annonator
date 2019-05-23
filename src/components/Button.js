import React from "react";

export default function Button({ toggleInit, type, activeType, buttonClass }) {
  let btnClass = buttonClass || "__ra-button";
  if (type === activeType) {
    btnClass += " active";
  }
  return (
    <button className={btnClass} onClick={() => toggleInit(type)}>
      {type}
    </button>
  );
}
