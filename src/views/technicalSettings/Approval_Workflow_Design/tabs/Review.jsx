import React from "react";
import {
  Box,
  Typography,
  Paper,
  Tooltip,
  IconButton,
  Chip,
} from "@mui/material";
import RuleIcon from "@mui/icons-material/Rule";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import EmailIcon from "@mui/icons-material/Email";
import NumbersIcon from "@mui/icons-material/Numbers";
import FileUploadIcon from "@mui/icons-material/FileUpload";

import {
  addColumn,
  updateColumn,
  deleteColumn,
} from "store/reducer/ApprovalReducer";
import { useSelector } from "react-redux";

const Review = () => {
  const fields = useSelector((state) => state.approvalReducer.columns);
  const isActiveFields = fields.filter((field) => field.isActive);
  const getIcon = (type) => {
    switch (type) {
      case "text":
        return <TextFieldsIcon fontSize="small" />;
      case "email":
        return <EmailIcon fontSize="small" />;
      case "number":
        return <NumbersIcon fontSize="small" />;
      case "file":
        return <FileUploadIcon fontSize="small" />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: "100%", padding: 4 }}>
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h3" sx={{ marginBottom: 2, color: "#9747ff" }}>
          Review Fields
        </Typography>
        <Typography variant="body1" sx={{ color: "#666666" }}>
          Review the fields you have configured for your form.
        </Typography>
      </Box>
      <Paper elevation={isActiveFields.length > 0 ? 3 : 0} sx={{ p: 2 }}>
        {/* Table Header */}
        {isActiveFields.length > 0 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              p: 2,
              borderBottom: "2px solid #9747ff",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ width: "30%", fontWeight: "bold", color: "#9747ff" }}
            >
              Field Label
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ width: "30%", fontWeight: "bold", color: "#9747ff" }}
            >
              Field Name
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ width: "30%", fontWeight: "bold", color: "#9747ff" }}
            >
              Type
            </Typography>
            <Box sx={{ width: "10%" }} /> {/* Spacer for icons */}
          </Box>
        )}

        {/* Table Body */}
        {isActiveFields.map((field, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              p: 2,
              borderBottom:
                index < fields.length - 1 ? "1px solid #e0e0e0" : "none",
              "&:hover": {
                backgroundColor: "#f9f4ff",
                transition: "background-color 0.3s",
              },
            }}
          >
            <Typography variant="body1" sx={{ width: "30%", color: "#000000" }}>
              {field.label}
            </Typography>
            <Typography variant="body1" sx={{ width: "30%", color: "#000000" }}>
              {field.name}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", width: "30%" }}>
              {getIcon(field.type)}
              <Typography variant="body1" sx={{ ml: 1, color: "#000000" }}>
                {field.type.charAt(0).toUpperCase() + field.type.slice(1)}
              </Typography>
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "flex-end", width: "10%" }}
            >
              {field.key && (
                <Chip
                  icon={<VpnKeyIcon />}
                  label="Key"
                  size="medium"
                  sx={{
                    bgcolor: "#e8f5e9",
                    color: "#2e7d32",
                    mr: 1,
                    fontSize: "0.9rem",
                    padding: "4px 8px",
                    "& .MuiChip-icon": { color: "#2e7d32", fontSize: "1.2rem" },
                  }}
                />
              )}
              {field.required && (
                <Chip
                  icon={<CheckCircleIcon />}
                  label="Required"
                  size="medium"
                  sx={{
                    bgcolor: "#fff3e0",
                    color: "#ed6c02",
                    fontSize: "0.9rem",
                    padding: "4px 8px",
                    "& .MuiChip-icon": { color: "#ed6c02", fontSize: "1.2rem" },
                  }}
                />
              )}
            </Box>
          </Box>
        ))}
        {isActiveFields.length <= 0 && (
          <Box
            sx={{
              width: "100%",
              m: 0,
              mt: 2,
              p: 0,
              minHeight: "350px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                position: "relative",
                display: "flex",
                width: "fit-content",
                height: "fit-content",
              }}
            >
              <RuleIcon
                sx={{
                  fontSize: 80,
                  color: "000",
                  mb: 2,
                }}
              />
              <RuleIcon
                sx={{
                  fontSize: 80,
                  color: "#9747ff",
                  mb: 2,
                  position: "absolute",
                  bottom: "3px",
                  right: "3px",
                }}
              />
            </Box>
            <Typography>
              Set Fields Active in Add field tab to review the fields you have
              configured for your form.
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Review;
