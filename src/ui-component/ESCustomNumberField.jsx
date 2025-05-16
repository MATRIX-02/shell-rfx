import React, { useEffect, useState } from "react";
import { TextField, Typography, Box } from "@mui/material";

const ESCustomNumberField = ({
  label = "",
  value = 0,
  onChange = () => {},
  placeholder = "",
  required = false,
  width = { xs: "100%", sm: "250px" },
  height = "40px",
  sx = {},
  disabled = false,
  readOnly = false,
  variant = "outlined",
  error = false,
  helperText = "",
  typographySx = {},
  boxSx = {},
  min = "",
  max = Infinity,
  step = 1,
  style,
  textFieldborderColor,
  textFieldbackGroundColor,
}) => {
  const [internalValue, setInternalValue] = useState(value);

  const handleChange = (event) => {
    const newValue =
      event.target.value === ""
        ? min
        : Math.max(min, Math.min(max, parseInt(event.target.value, 10)));
    setInternalValue(newValue);
    onChange(newValue);
  };

  useEffect(() => {
    if (value !== internalValue) {
      setInternalValue(value);
    }
  }, [value]);

  return (
    <Box sx={{ width, mb: 2, ...boxSx }} style={style}>
      <Typography
        variant="h5"
        sx={{ color: "#696969", mb: 1, fontWeight: "400", ...typographySx }}
        gutterBottom
      >
        {label}
        {required && (
          <Box
            component="span"
            sx={{ color: "red", fontSize: "1rem", marginLeft: "4px" }}
          >
            *
          </Box>
        )}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <TextField
          fullWidth
          type="number"
          placeholder={placeholder || "Enter number"}
          value={internalValue}
          onChange={handleChange}
          required={required}
          disabled={disabled || readOnly}
          variant={variant}
          error={error}
          helperText={helperText}
          InputProps={{
            inputProps: {
              min: min,
              max: max,
              step: step,
              readOnly: readOnly,
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              height, // Ensure the custom height is applied
              backgroundColor: textFieldbackGroundColor || "transparent", // Apply bg color to entire input container
              "& input": {
                backgroundColor: textFieldbackGroundColor || "transparent", // Apply bg color to the actual input
              },
              "& fieldset": {
                borderColor: textFieldborderColor
                  ? textFieldborderColor
                  : "#D2D2D2", // Default border color
              },
              "&:hover fieldset": {
                borderColor: textFieldborderColor
                  ? textFieldborderColor
                  : "#000", // Hover border color
              },
              "&.Mui-focused fieldset": {
                borderColor: "#9747ff", // Focused border color
              },
            },
            "& .MuiInputBase-input": {
              padding: "10px", // Adjust padding to match the design
              height: "100%", // Ensure the input takes full height
            },
            ...sx, // Spread any additional styles passed
          }}
        />
      </Box>
    </Box>
  );
};

export default ESCustomNumberField;
