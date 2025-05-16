import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Paper, Button } from "@mui/material";
import { Save, Edit2, Upload } from "lucide-react";
import {
  PictureAsPdf,
  Description,
  Article,
  TextSnippet,
  TableChart,
} from "@mui/icons-material";
import ESCustomDropdown from "ui-component/ESCustomDropdown";
import ESCustomTextField from "ui-component/ESCustomTextField";
import ESCustomTextArea from "ui-component/ESCustomTextArea";
import { selectUploadFileSettings } from "store/modules/SolutionSettings/Sourcing360/RFXConfiguration/RFP/Common/selectors/uploadFileSettingsSelectors";
import { updateSettings } from "store/modules/SolutionSettings/Sourcing360/RFXConfiguration/RFP/Common/slices/uploadFileSettingsSlice";

const getFileIcon = (format) => {
  switch (format.toLowerCase()) {
    case "pdf":
      return <PictureAsPdf />;
    case "doc":
    case "docx":
      return <Description />;
    case "txt":
      return <TextSnippet />;
    case "rtf":
      return <Article />;
    case "xlsx":
    case "csv":
      return <TableChart />;
    default:
      return <Description />;
  }
};

const fileFormatOptions = [
  { value: "pdf", label: "PDF", icon: getFileIcon("pdf") },
  { value: "doc", label: "DOC", icon: getFileIcon("doc") },
  { value: "docx", label: "DOCX", icon: getFileIcon("docx") },
  { value: "txt", label: "TXT", icon: getFileIcon("txt") },
  { value: "rtf", label: "RTF", icon: getFileIcon("rtf") },
  { value: "xlsx", label: "XLSX", icon: getFileIcon("xlsx") },
  { value: "csv", label: "CSV", icon: getFileIcon("csv") },
];

const CustomOption = ({ children, ...props }) => {
  const { data } = props;
  return (
    <Box
      component="div"
      {...props}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        p: 1,
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.04)",
        },
      }}
    >
      {data.icon}
      <span>{children}</span>
    </Box>
  );
};

const UploadFileSettings = () => {
  const dispatch = useDispatch();
  const savedSettings = useSelector(selectUploadFileSettings);
  const [isEditing, setIsEditing] = useState(true);
  const [localSettings, setLocalSettings] = useState(savedSettings);

  const isFormValid = () => {
    return (
      localSettings.supportedFormats.length > 0 &&
      localSettings.maxSize.trim() !== "" &&
      localSettings.errorMessage.trim() !== ""
    );
  };

  const handleSupportedFormatsChange = (selectedOptions) => {
    setLocalSettings((prev) => ({
      ...prev,
      supportedFormats: selectedOptions || [],
    }));
  };

  const handleMaxSizeChange = (event) => {
    const value = event.target.value;
    if (value === "" || (/^\d*\.?\d*$/.test(value) && parseFloat(value) >= 0)) {
      setLocalSettings((prev) => ({
        ...prev,
        maxSize: value,
      }));
    }
  };

  const handleErrorMessageChange = (event) => {
    setLocalSettings((prev) => ({
      ...prev,
      errorMessage: event.target.value,
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    dispatch(updateSettings(localSettings));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalSettings(savedSettings);
    setIsEditing(false);
  };

  return (
    <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "300px 1fr",
          gap: 7,
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Upload size={24} />
            <Typography
              variant="h4"
              sx={{ color: "common.black", fontWeight: "medium" }}
            >
              Upload File Settings
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              mb: 2,
              textAlign: "justify",
            }}
          >
            Configure file upload restrictions including supported formats,
            maximum file size, and custom error messages for invalid uploads.
          </Typography>
          <Button
            onClick={isEditing ? handleSave : handleEdit}
            size="small"
            startIcon={isEditing ? <Save size={20} /> : <Edit2 size={20} />}
            variant={isEditing ? "contained" : "text"}
            disabled={isEditing && !isFormValid()}
            sx={
              isEditing
                ? {
                    bgcolor: "secondary.dark",
                    color: "white",
                    fontWeight: "bold",
                    p: 1,
                    px: 2,
                  }
                : {
                    color: "#000",
                    bgcolor: "#f6f7f9",
                    fontWeight: "bold",
                    p: 1,
                    px: 2,
                  }
            }
          >
            {isEditing ? "Save File Settings" : "Edit File Settings"}
          </Button>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box>
            <ESCustomDropdown
              label="Supported Formats"
              options={fileFormatOptions}
              value={localSettings.supportedFormats}
              onChange={handleSupportedFormatsChange}
              isMulti={true}
              placeholder="Select file formats..."
              isDisabled={!isEditing}
              required
              width={{ xs: "100%" }}
              textFieldborderColor="#D2D2D2"
              components={{ Option: CustomOption }}
              formatOptionLabel={(option) => (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {option.icon}
                  <span>{option.label}</span>
                </Box>
              )}
            />
          </Box>

          <Box>
            <ESCustomTextField
              label="Maximum Size (MB)"
              type="number"
              width="100%"
              value={localSettings.maxSize}
              onChange={handleMaxSizeChange}
              placeholder="Enter maximum file size..."
              disabled={!isEditing}
              readOnly={!isEditing}
              required
            />
          </Box>

          <Box>
            <ESCustomTextArea
              label="Error Message"
              value={localSettings.errorMessage}
              onChange={handleErrorMessageChange}
              placeholder="Enter error message..."
              isDisabled={!isEditing}
              isReadOnly={!isEditing}
              required
              minHeight="100px"
              isResizable="vertical"
              boxSx={{ width: "100%" }}
            />
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default UploadFileSettings;