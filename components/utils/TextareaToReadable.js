import React from "react";

export default function TextareaToReadable(text) {
  if (!text) return null;

  // Split the text by newlines and map to JSX elements
  const lines = text.split("\n").map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));

  return lines;
}
