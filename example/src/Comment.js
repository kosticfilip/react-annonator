import React from "react";
import { Preview } from "test";

export default function Comment({ comment }) {
  console.log(comment);
  return <div>{comment.type}</div>;
}
