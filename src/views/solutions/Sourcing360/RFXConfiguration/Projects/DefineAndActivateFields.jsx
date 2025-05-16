import React from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
} from "@mui/material";
import {
  TextFields,
  AlternateEmail,
  Numbers,
  Abc,
  ToggleOn,
  CalendarMonth,
  AccessTime,
  AttachMoney,
  Phone,
  Language,
  List,
  Subject,
  Link,
} from "@mui/icons-material";
import {
  Plus,
  Trash2,
  Save,
  ClipboardList,
  ToggleLeft,
  Edit2,
  X,
} from "lucide-react";
import ESCustomTextField from "ui-component/ESCustomTextField";
import ESCustomDropdown from "ui-component/ESCustomDropdown";
import { useDispatch, useSelector } from "react-redux";
import {
  addField,
  updateField,
  deleteField,
  saveFields,
  startEditing,
  cancelEditing,
} from "store/modules/SolutionSettings/Sourcing360/RFXConfiguration/RFP/Projects/slices/defineFieldsSlice";
import {
  selectFields,
  selectSavedFields,
  selectIsLoading,
  selectError,
  selectIsEditing,
} from "store/modules/SolutionSettings/Sourcing360/RFXConfiguration/RFP/Projects/selectors/defineFieldsSelectors";

const FIELD_TYPES = [
  { value: "text", label: "Text", icon: <TextFields fontSize="small" /> },
  { value: "email", label: "Email", icon: <AlternateEmail fontSize="small" /> },
  { value: "number", label: "Number", icon: <Numbers fontSize="small" /> },
  {
    value: "alphanumeric",
    label: "Alphanumeric",
    icon: <Abc fontSize="small" />,
  },
  { value: "boolean", label: "Boolean", icon: <ToggleOn fontSize="small" /> },
  { value: "date", label: "Date", icon: <CalendarMonth fontSize="small" /> },
  { value: "time", label: "Time", icon: <AccessTime fontSize="small" /> },
  {
    value: "currency",
    label: "Currency",
    icon: <AttachMoney fontSize="small" />,
  },
  { value: "phone", label: "Phone", icon: <Phone fontSize="small" /> },
  {
    value: "multilingual",
    label: "Multilingual Text",
    icon: <Language fontSize="small" />,
  },
  { value: "dropdown", label: "Dropdown", icon: <List fontSize="small" /> },
  { value: "richtext", label: "Rich Text", icon: <Subject fontSize="small" /> },
  { value: "url", label: "URL", icon: <Link fontSize="small" /> },
];

const EmptyFieldsState = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 6,
        borderRadius: 1,
        bgcolor: "grey.50",
        border: "2px dashed",
        borderColor: "grey.200",
        minHeight: 300,
        width: "100%",
      }}
    >
      <Box
        sx={{
          bgcolor: "grey.100",
          p: 2,
          borderRadius: "50%",
          mb: 2,
        }}
      >
        <ClipboardList size={48} color="#9e9e9e" />
      </Box>

      <Typography
        variant="h6"
        sx={{
          color: "text.primary",
          mb: 1,
          fontWeight: 500,
        }}
      >
        No Fields Added Yet
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          textAlign: "center",
          maxWidth: 400,
          mb: 3,
        }}
      >
        Start by clicking the "Add New Field" button to create custom fields for
        your RFP form.
      </Typography>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          color: "text.disabled",
        }}
      >
        {["Field Name", "Field Label", "Field Type", "Status"].map((label) => (
          <Stack key={label} direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "grey.400",
              }}
            />
            <Typography variant="caption">{label}</Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};

const DefineAndActivateFields = () => {
  const dispatch = useDispatch();
  const fields = useSelector(selectFields);
  const savedFields = useSelector(selectSavedFields);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const isEditing = useSelector(selectIsEditing);

  const handleAddField = () => {
    dispatch(addField());
  };

  const handleChange = (id, field, value) => {
    dispatch(updateField({ id, field, value }));
  };

  const handleDelete = (id, isSaved) => {
    dispatch(deleteField({ id, isSaved }));
  };

  const handleSave = () => {
    dispatch(saveFields());
  };

  const handleStartEdit = () => {
    dispatch(startEditing());
  };

  const handleCancelEdit = () => {
    dispatch(cancelEditing());
  };

  const formatOptionLabel = ({ label, icon }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {icon}
      <span>{label}</span>
    </Box>
  );

  const renderFieldRow = (field, isSaved = false) => (
    <Box
      key={field.id}
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr) auto",
        gap: 2,
        mb: 2,
        alignItems: "center",
        position: "relative",
      }}
    >
      <ESCustomTextField
        placeholder="Enter field name"
        value={field.fieldName}
        onChange={(e) => handleChange(field.id, "fieldName", e.target.value)}
        disabled={!isEditing && isSaved}
        width="100%"
      />
      <ESCustomTextField
        placeholder="Enter field label"
        value={field.fieldLabel}
        onChange={(e) => handleChange(field.id, "fieldLabel", e.target.value)}
        disabled={!isEditing && isSaved}
        width="100%"
      />
      <ESCustomDropdown
        options={FIELD_TYPES}
        value={field.fieldType}
        onChange={(option) => handleChange(field.id, "fieldType", option)}
        isDisabled={!isEditing && isSaved}
        placeholder="Select field type"
        width="100%"
        textFieldborderColor="#D2D2D2"
        formatOptionLabel={formatOptionLabel}
        boxSx={{ mt: 1 }}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={field.isActive}
            onChange={(e) =>
              handleChange(field.id, "isActive", e.target.checked)
            }
            disabled={!isEditing && isSaved}
          />
        }
        label="Active"
        sx={{ mt: 1 }}
      />
      {(!isSaved || isEditing) && (
        <IconButton
          size="small"
          onClick={() => handleDelete(field.id, isSaved)}
          sx={{
            color: "error.main",
            position: "absolute",
            top: 13,
            right: 10,
          }}
        >
          <Trash2 size={20} />
        </IconButton>
      )}
    </Box>
  );

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
            <ToggleLeft size={24} />
            <Typography
              variant="h4"
              sx={{ color: "common.black", fontWeight: "medium" }}
            >
              Define & Activate Fields
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              mb: 4,
              textAlign: "justify",
            }}
          >
            Configure custom fields for your RFP forms. Define field names,
            labels, and types while controlling their visibility through the
            active status.
          </Typography>

          {!isEditing ? (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                onClick={handleAddField}
                startIcon={<Plus size={20} />}
                variant="contained"
              >
                Add New Field
              </Button>
              {savedFields.length > 0 && (
                <Button
                  onClick={handleStartEdit}
                  startIcon={<Edit2 size={20} />}
                  sx={{
                    color: "#000",
                    bgcolor: "#f6f7f9",
                    fontWeight: "bold",
                    p: 1,
                    px: 1.5,
                  }}
                >
                  Edit Fields
                </Button>
              )}
            </Box>
          ) : (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                onClick={handleSave}
                startIcon={<Save size={20} />}
                variant="contained"
                sx={{
                  bgcolor: "secondary.dark",
                  color: "white",
                  fontWeight: "bold",
                  p: 1,
                  px: 2,
                  "&:hover": {
                    bgcolor: "secondary.main",
                  },
                }}
              >
                Save Fields
              </Button>
              <Button
                onClick={handleCancelEdit}
                startIcon={<X size={20} />}
                sx={{
                  color: "text.secondary",
                  borderColor: "text.secondary",
                  p: 1,
                  px: 2,
                }}
              >
                Cancel
              </Button>
            </Box>
          )}
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {savedFields.length === 0 && fields.length === 0 ? (
            <EmptyFieldsState />
          ) : (
            <>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr) auto",
                  gap: 2,
                  mb: 3,
                  "& > *": {
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "text.secondary",
                  },
                }}
              >
                <Typography>Field Name</Typography>
                <Typography sx={{ ml: 1.2 }}>Field Label</Typography>
                <Typography sx={{ ml: 2.6 }}>Field Type</Typography>
                <Typography sx={{ ml: 3.5 }}>Status</Typography>
                <Box sx={{ width: 40 }} />
              </Box>

              {savedFields.map((field) => renderFieldRow(field, true))}
              {fields.map((field) => renderFieldRow(field))}

              {fields.length > 0 && !isEditing && (
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                >
                  <Button
                    variant="contained"
                    startIcon={<Save size={20} />}
                    onClick={handleSave}
                    disabled={fields.every(
                      (f) =>
                        f.fieldName.trim() === "" ||
                        f.fieldLabel.trim() === "" ||
                        f.fieldType === null
                    )}
                    sx={{
                      bgcolor: "secondary.dark",
                      color: "white",
                      fontWeight: "bold",
                      p: 1,
                      px: 2,
                    }}
                  >
                    Save Fields
                  </Button>
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default DefineAndActivateFields;
