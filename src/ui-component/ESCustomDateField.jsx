import React from "react";
import { TextField, Typography, Box } from "@mui/material";
import { styled } from "@mui/system";

const CustomDatePicker = styled(TextField)({
  "& .MuiPickersDay-root": {
    "&:hover": {
      backgroundColor: "#f9f4ff",
    },
    "&.Mui-selected": {
      backgroundColor: "#9747ff",
      border: "none",
    },
    "&.Mui-selected:hover": {
      backgroundColor: "#9747ff",
    },
  },
});

const ESCustomDateField = ({
  label,
  value,
  onChange,
  placeholder,
  required,
  width = "250px",
  height = "40px",
  readOnly,
  helperText,
  error
}) => {
  return (
    <Box sx={{ width, mb: 2 }}>
      <Typography
        variant="h6"
        sx={{ color: "#696969", mb: 1, fontWeight: "bold" }}
        gutterBottom
      >
        {label}
        {required && (
          <span
            style={{
              color: "red",
              fontSize: "1rem",
              position: "relative",
              marginLeft: "4px",
            }}
          >
            *
          </span>
        )}
      </Typography>
      <CustomDatePicker
        fullWidth
        type="date"
        placeholder={placeholder || "Select date"}
        value={value}
        onChange={onChange}
        required={required}
        error={error}
        helperText={
          helperText && (
            <Typography variant="h6" color={error ? "error" : "textSecondary"}>
              {helperText}
            </Typography>
          )
        }
        sx={{
          "& .MuiOutlinedInput-root": {
            height,
            "& fieldset": {
              borderColor: error ? "red" : "#D2D2D2",
            },
            "&:hover fieldset": {
              borderColor: error ? "red" : "#000",
            },
            "&.Mui-focused fieldset": {
              borderColor: error ? "red" : "#9747ff",
            },
          },
          "& .MuiInputLabel-root": {
            color: error ? "red" : "#D2D2D2",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: error ? "red" : "#5e17eb",
          },
        }}
        InputLabelProps={{
          shrink: true,
          style: {
            lineHeight: "11px",
            backgroundColor: "white",
          },
        }}
        inputProps={{
          style: {
            backgroundColor: "white",
          },
          readOnly: readOnly,
        }}
      />
    </Box>
  );
};

export default ESCustomDateField;
