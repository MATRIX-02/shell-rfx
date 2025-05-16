import React from "react";
import PropTypes from "prop-types";
import { Typography, Box, TextareaAutosize, InputAdornment } from "@mui/material";
import { useTheme } from "@mui/material";

const ESCustomTextArea = ({
    label,
    value,
    onChange,
    placeholder,
    isDisabled,
    required,
    isReadOnly,
    isResizable = "vertical",
    minHeight = "30px",
    maxHeight = "none",
    fontFamily = "Poppins, sans-serif",
    sx = {},
    typographySx = {},
    boxSx = {},
    additionalStyles = {},
    onFocus,
    onBlur,
    helperText,
    error,
    startIcon,
    endIcon,
}) => {
    const theme = useTheme();

    return (
        <Box sx={{ width: "100%", mb: 2, ...boxSx }}>
            <Typography
                variant="h5"
                sx={{
                    color: "#696969",
                    mb: 1,
                    fontWeight: "400",
                    position: "relative",
                    ...typographySx,
                }}
                gutterBottom
            >
                {label}
                {required && (
                    <span
                        style={{
                            color: "red",
                            fontSize: "1rem",
                            position: "absolute",
                            top: "-.3rem",
                        }}
                    >
                        *
                    </span>
                )}
            </Typography>
            <Box
                sx={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                }}
            >
                {startIcon && (
                    <Box sx={{ position: 'absolute', left: '10px', top: "5px", zIndex: 1 }}>
                        {typeof startIcon === 'string' ? (
                            <img src={startIcon} alt="Start Icon" style={{ width: '2rem', height: 'auto' }} />
                        ) : (
                            startIcon
                        )}
                    </Box>
                )}
                <TextareaAutosize
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder || "Enter your text..."}
                    disabled={isDisabled}
                    readOnly={isReadOnly}
                    minRows={1} 
                    style={{
                        width: "100%", 
                        height: "30px", 
                        minHeight, 
                        maxHeight, 
                        padding: "10px",
                        paddingLeft: startIcon ? '40px' : '10px',
                        paddingRight: endIcon ? '40px' : '10px',
                        borderColor: error ? "#f44336" : "#ced4da", 
                        borderWidth: "1px",
                        borderRadius: "4px",
                        outline: "none",
                        resize: isResizable, 
                        fontFamily: fontFamily,
                        boxShadow: error ? "0 0 0 1px #f44336" : "none",
                        ...additionalStyles,
                    }}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    sx={{
                        ...sx,
                        '&:focus': {
                            border: '2px solid #9747ff',
                        },
                    }}
                />
                {endIcon && (
                    <Box sx={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }}>
                        {typeof endIcon === 'string' ? (
                            <img src={endIcon} alt="End Icon" style={{ width: '20px', height: '20px' }} />
                        ) : (
                            endIcon
                        )}
                    </Box>
                )}
            </Box>
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

ESCustomTextArea.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    isDisabled: PropTypes.bool,
    required: PropTypes.bool,
    minHeight: PropTypes.string,
    maxHeight: PropTypes.string,
    sx: PropTypes.object,
    typographySx: PropTypes.object,
    boxSx: PropTypes.object,
    additionalStyles: PropTypes.object,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    helperText: PropTypes.string,
    error: PropTypes.bool,
    startIcon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    endIcon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
};

ESCustomTextArea.defaultProps = {
    placeholder: "Enter your text...",
    isDisabled: false,
    required: false,
    minHeight: "30px", // Default minHeight
    maxHeight: "none",
    sx: {},
    typographySx: {},
    boxSx: {},
    additionalStyles: {},
    helperText: "",
    error: false,
    startIcon: null,
    endIcon: null,
};

export default ESCustomTextArea;
