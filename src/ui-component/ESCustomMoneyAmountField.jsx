import React, { useState } from "react";
import { Box, Typography, InputAdornment, Select, MenuItem } from "@mui/material";
import ESCustomTextField from "./ESCustomTextField";
import currencyCodes from 'currency-codes';

// Get all currency codes and provide fallback for missing symbols
const currencies = currencyCodes.codes()
  .map(code => {
    const currency = currencyCodes.code(code);
    return {
      value: code,
      label: `${code} - ${currency.currency}`,
      symbol: currency.symbol || code // Use code as fallback if symbol is missing
    };
  });

const ESCustomMoneyAmountField = ({
  label = "",
  value = "",
  currency = "USD",
  onChangeAmount = () => {},
  onChangeCurrency = () => {},
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
}) => {
  const selectedCurrency = currencies.find((c) => c.value === currency) || currencies[0];
  const [localValue, setLocalValue] = useState(value);

  const formatAmount = (amount) => {
    // Convert to float and fix to 2 decimal places
    const floatValue = parseFloat(amount);
    if (isNaN(floatValue)) return "";
    
    const fixedValue = floatValue.toFixed(2);
    
    // Split into whole and decimal parts
    const [whole, decimal] = fixedValue.split('.');
    
    // Add commas to the whole part
    const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    // Combine whole and decimal parts
    return `${formattedWhole}.${decimal}`;
  };

  const handleBlur = () => {
    const formattedValue = formatAmount(localValue);
    setLocalValue(formattedValue);
    onChangeAmount(formattedValue);
  };

  return (
    <Box sx={{ width, ...boxSx }}>
      <Typography
        variant="h5"
        sx={{ color: "#696969", mb:0, fontWeight: "400", ...typographySx }}
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
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Select
          value={selectedCurrency.value}
          onChange={(e) => onChangeCurrency(e.target.value)}
          disabled={disabled || readOnly}
          sx={{
            width: "120px",
            mr: 1,
            mb:1,
            height: height,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#D2D2D2',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#000',
            },
            '& .MuiSelect-select': {
              padding: '8px 14px',
            },
            ...sx
          }}
        >
          {currencies.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        <ESCustomTextField
          value={value}
          onChange={onChangeAmount}
          onBlur={handleBlur}
          placeholder={placeholder || "Enter amount"}
          required={required}
          width="calc(100% - 130px)"
          height={height}
          sx={sx}
          disabled={disabled}
          readOnly={readOnly}
          variant={variant}
          error={error}
          helperText={helperText}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">{selectedCurrency.symbol}</InputAdornment>
            ),
          }}
        />
      </Box>
    </Box>
  );
};

export default ESCustomMoneyAmountField;