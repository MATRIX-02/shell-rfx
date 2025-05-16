import React from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { Typography, Box, useTheme } from "@mui/material";

const ESCustomDropdown = ({
  label,
  sideLabel,
  options,
  value,
  onChange,
  placeholder,
  isDisabled,
  isClearable,
  renderValue,
  required,
  width = { xs: "100%", sm: "250px" },
  height = "40px",
  sx = {},
  typographySx = {},
  boxSx = {},
  additionalStyles = {},
  isMulti = false,
  isLoading = false,
  onFocus,
  onBlur,
  onInputChange,
  formatOptionLabel,
  helperText,
  error,
  style,
  textFieldborderColor,
  textFieldbackGroundColor,
}) => {
  const theme = useTheme();

  const handleChange = (selectedOption) => {
    if (isClearable && selectedOption === null) {
      onChange(null);
    } else {
      onChange(selectedOption);
    }
  };

  return (
    <Box sx={{ width, ...boxSx }} style={style}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        {label && (
          <Typography
            variant="h5"
            sx={{ color: "#696969", mb: 1, fontWeight: "400", ...typographySx }}
            gutterBottom
          >
            {label}
            {required && (
              <Box
                component="span"
                sx={{
                  color: "red",
                  fontSize: "1rem",
                  position: "relative",
                  marginLeft: "4px",
                }}
              >
                *
              </Box>
            )}
          </Typography>
        )}
        {sideLabel && (
          <Typography
            variant="h5"
            sx={{
              color: "#696969",
              mb: 1,
              mr: 1,
              fontWeight: "400",
              ...typographySx,
            }}
            gutterBottom
          >
            {sideLabel}
          </Typography>
        )}
      </Box>
      <Select
        options={options}
        value={value}
        onChange={handleChange}
        placeholder={placeholder || "Select an option..."}
        isDisabled={isDisabled}
        isClearable={isClearable}
        isMulti={isMulti}
        isLoading={isLoading}
        label="Native"
        renderValue={renderValue}
        inputProps={{
          id: "select-multiple-native",
        }}
        onFocus={onFocus}
        onBlur={onBlur}
        onInputChange={onInputChange}
        sx={sx}
        styles={{
          control: (provided, state) => ({
            ...provided,
            minHeight: height,
            backgroundColor: textFieldbackGroundColor,
            borderColor: error
              ? "#f44336" // Error state border color
              : state.isFocused // When field is focused
                ? theme.palette.primary.main // Keep the focused border color
                : textFieldborderColor, // Default border color when not focused
            boxShadow: state.isFocused
              ? "0 0 0 1px #9747ff" // Add box-shadow when focused
              : provided.boxShadow, // Default box-shadow
            "&:hover": {
              borderColor: state.isFocused
                ? theme.palette.primary.main // Keep focused color on hover when focused
                : theme.palette.secondary[800], // Change border color only if not focused
            },
            ...additionalStyles.control,
          }),
          valueContainer: (provided) => ({
            ...provided,
            padding: "2px 8px",
            flexWrap: "wrap",
          }),
          multiValue: (provided) => ({
            ...provided,
            margin: "2px",
            ...additionalStyles.multiValue,
          }),
          indicatorsContainer: (provided) => ({
            ...provided,
            height: "auto",
          }),
          dropdownIndicator: (provided) => ({
            ...provided,
            padding: "0 8px",
          }),
          indicatorSeparator: (provided) => ({
            ...provided,
            display: "block",
          }),
          option: (provided, state) => ({
            ...provided,
            backgroundColor:
              state.isFocused || state.isSelected
                ? theme.palette.primary["200"]
                : provided.backgroundColor,
            color: state.isSelected
              ? "#000"
              : state.isFocused
                ? "#000"
                : provided.color,
            fontWeight: state.isSelected ? 500 : 400,
            "&:active": {
              backgroundColor: theme.palette.primary.main,
              color: "#fff",
              fontWeight: 500,
            },
            ...additionalStyles.option,
          }),
          singleValue: (provided) => ({
            ...provided,
            color: "#000",
            fontWeight: 500,
          }),
          menuPortal: (base) => ({
            ...base,
            zIndex: 9999,
          }),
          menu: (base) => ({
            ...base,
            zIndex: 9999,
          }),
          ...(additionalStyles.custom || {}),
        }}
        menuPortalTarget={document.body}
        formatOptionLabel={formatOptionLabel}
      />
      {helperText && (
        <Typography
          variant="caption"
          color={error ? "error" : "textSecondary"}
          sx={{ mt: 1, ml: 1 }}
        >
          {helperText}
        </Typography>
      )}
    </Box>
  );
};

ESCustomDropdown.propTypes = {
  label: PropTypes.string,
  options: PropTypes.array.isRequired,
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  isDisabled: PropTypes.bool,
  isClearable: PropTypes.bool,
  required: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  height: PropTypes.string,
  sx: PropTypes.object,
  typographySx: PropTypes.object,
  boxSx: PropTypes.object,
  additionalStyles: PropTypes.object,
  isMulti: PropTypes.bool,
  isLoading: PropTypes.bool,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onInputChange: PropTypes.func,
  helperText: PropTypes.string,
  error: PropTypes.bool,
};

ESCustomDropdown.defaultProps = {
  label: "",
  placeholder: "Select an option...",
  isDisabled: false,
  isClearable: false,
  required: false,
  width: { xs: "100%", sm: "250px" },
  height: "40px",
  sx: {},
  typographySx: {},
  boxSx: {},
  additionalStyles: {},
  isMulti: false,
  isLoading: false,
  helperText: "",
  error: false,
};

export default ESCustomDropdown;
