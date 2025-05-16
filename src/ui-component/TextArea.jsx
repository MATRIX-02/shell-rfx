import React, { useRef, useEffect } from "react";

const TextArea = ({ label, value, onChange, placeholder }) => {
  const textareaRef = useRef(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  const handleChange = (e) => {
    onChange(e);
    adjustHeight();
  };

  return (
    <div
      className="text-area"
      style={{
        width: "100%",
        padding: "10px",
        border: "2px solid #9747ff",
        borderRadius: "8px 8px 0px 0px",
        backgroundColor: "#F9F4FF",
        lineHeight: "1.5",
        overflowY: "auto", // Scrollable when content overflows
        maxHeight: "150px", // Limits height before scrolling
        minHeight: "50px", // Sets initial height
      }}
    >
      {/* <label>{label}</label> */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        rows={1}
      ></textarea>
    </div>
  );
};

export default TextArea;
