import React from "react";
import { Button, Box } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";

const ToggleSwitch = ({
  option1,
  option2,
  onToggle,
  isActive,
  sx,
  buttonOneSx,
  buttonTwoSx,
  isIcon = false,
  containerWidth = "300px",
  containerMargin = "20px auto 0",
  showDoneIcon = true,
}) => {
  const handleToggle = (newIsActive) => {
    if (typeof onToggle === "function") {
      onToggle(newIsActive);
    }
  };
  console.log(isActive);

  const containerSx = {
    display: "flex",
    border: "1px solid #ccc",
    borderRadius: "100px",
    overflow: "hidden",
    height: "40px",
    width: containerWidth,
    margin: containerMargin,
    ...sx,
  };

  const buttonSx = (active, isSecondButton) => ({
    padding: "10px 20px",
    backgroundColor: active
      ? isSecondButton
        ? "#FF7F7F" // Updated red color
        : "#BFE6BF"
      : "white",
    color: active ? "#000" : isIcon ? "#9747FF" : "#000",
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.3s ease, color 0.3s ease",
    whiteSpace: "nowrap",
    flexShrink: 0,
    position: "relative",
    borderRadius: 0,
    "&:hover": {
      backgroundColor: active
        ? isSecondButton
          ? "#FF9999" // Lighter shade for hover
          : "#A8E0A8"
        : "#F5F5F5",
    },
  });

  const iconWrapperSx = (visible) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "opacity 0.3s ease, width 0.3s ease",
    width: visible ? "24px" : "0",
    opacity: visible ? 1 : 0,
    overflow: "hidden",
    marginRight: visible ? "8px" : "0",
  });

  return (
    <Box sx={{ ...containerSx, border: "1px solid black" }}>
      <Button
        sx={{
          ...buttonSx(isActive, false),
          ...buttonOneSx,
        }}
        onClick={() => handleToggle(false)}
        disableRipple
      >
        {showDoneIcon && (
          <Box sx={iconWrapperSx(!isActive)}>
            <DoneIcon />
          </Box>
        )}
        {option1}
      </Button>
      <Button
        sx={{
          ...buttonSx(!isActive, true),
          ...buttonTwoSx,
        }}
        onClick={() => handleToggle(true)}
        disableRipple
      >
        {showDoneIcon && (
          <Box sx={iconWrapperSx(isActive)}>
            <DoneIcon />
          </Box>
        )}
        {option2}
      </Button>
    </Box>
  );
};

export default ToggleSwitch;
