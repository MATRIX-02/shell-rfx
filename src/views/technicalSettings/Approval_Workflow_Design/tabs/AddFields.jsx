import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Typography,
  Checkbox,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ESCustomTextField from "ui-component/ESCustomTextField";
import ESCustomDropdown from "ui-component/ESCustomDropdown";
import {
  addColumn,
  updateColumn,
  deleteColumn,
  changeColumnState,
} from "store/reducer/ApprovalReducer";
import ToggleSwitch from "ui-component/ToggleSwitch";
import { fontSize, fontWeight } from "@mui/system";

const fileTypes = [
  { label: "Text", value: "text" },
  { label: "Email", value: "email" },
  { label: "Number", value: "number" },
  { label: "File", value: "file" },
  { label: "Alpha Numeric", value: "alphaNumeric" },
];

const AddFields = () => {
  const dispatch = useDispatch();
  const columns = useSelector((state) => state.approvalReducer.columns);

  const [open, setOpen] = useState(false);
  const [newField, setNewField] = useState({
    name: "",
    label: "",
    type: "",
    key: false,
    required: false,
    isPredefined: false,
  });
  const [errorFields, setErrorFields] = useState({
    name: false,
    label: false,
    type: false,
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setErrorFields({ name: false, label: false, type: false });
    setOpen(false);
  };

  const handleAddField = () => {
    let hasError = false;

    if (newField.name === "") {
      hasError = true;
      setErrorFields((prevState) => ({ ...prevState, name: true }));
    } else {
      setErrorFields((prevState) => ({ ...prevState, name: false }));
    }
    if (newField.label === "") {
      hasError = true;
      setErrorFields((prevState) => ({ ...prevState, label: true }));
    } else {
      setErrorFields((prevState) => ({ ...prevState, label: false }));
    }
    if (newField.type === "") {
      hasError = true;
      setErrorFields((prevState) => ({ ...prevState, type: true }));
    } else {
      setErrorFields((prevState) => ({ ...prevState, type: false }));
    }

    if (hasError) {
      return;
    }

    dispatch(addColumn(newField));
    setNewField({
      name: "",
      label: "",
      type: "",
      key: false,
      required: false,
      isPredefined: false,
    });
    handleClose();
  };

  const handleFieldChange = (index, key, value) => {
    const updatedField = { ...columns[index], [key]: value };
    dispatch(updateColumn({ index, updatedField }));
  };

  const handleDeleteField = (index) => {
    const fieldToDelete = columns[index];
    if (!fieldToDelete.name.startsWith("es_")) {
      dispatch(deleteColumn(index));
    } else {
      // Optionally, show an error message or tooltip
      console.log("Cannot delete predefined fields");
    }
  };
  const handleToggle = (column_name, column) => {
    dispatch(changeColumnState({ column_name, column }));
  };
  const handleKeyChange = (index, checked) => {
    const updatedField = { ...columns[index], key: checked };
    dispatch(updateColumn({ index, updatedField }));
  };

  const hasKeyField = columns.some((column) => column.key);

  return (
    <Box sx={{ width: "100%", padding: 4, position: "relative" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h3" sx={{ marginBottom: 2, color: "#9747ff" }}>
            Add Fields
          </Typography>
          <Typography
            variant="body1"
            sx={{ marginBottom: 4, color: "#666666" }}
          >
            You can manage the screen fields for your forms. Predefined fields
            are editable but cannot be deleted.
          </Typography>
        </Box>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#ffffff",
            "&:hover": {
              backgroundColor: "#ffffff",
              transform: "scale(1.1)",
              transition: "transform 0.2s ease",
              boxShadow: "none",
            },
            boxShadow: "none",
          }}
          onClick={handleOpen}
        >
          <Tooltip title="Add New Field" placement="top">
            <AddIcon sx={{ fontSize: "2.5rem", color: "#9747ff" }} />
          </Tooltip>
        </Button>
      </Box>
      {console.log(columns)}
      {columns.map((column, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            alignItems: "center",
            marginBottom: 3,
            gap: 3,
          }}
        >
          <ESCustomTextField
            label="Field Name"
            value={column.name}
            onChange={(e) => handleFieldChange(index, "name", e.target.value)}
            width={{ sm: "350px" }}
            sx={{ marginRight: 2 }}
          />
          <ESCustomTextField
            label="Field Label"
            value={column.label}
            onChange={(e) => handleFieldChange(index, "label", e.target.value)}
            width={{ sm: "350px" }}
            sx={{ marginRight: 2 }}
          />
          <ESCustomDropdown
            label="Field Type"
            options={fileTypes}
            width={{ sm: "350px" }}
            value={fileTypes.find((type) => type.value === column.type)}
            onChange={(selectedOption) =>
              handleFieldChange(index, "type", selectedOption.value)
            }
            sx={{ marginRight: 2 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={column.key}
                onChange={(e) => handleKeyChange(index, e.target.checked)}
                sx={{
                  color: "#9747ff",
                  "&.Mui-checked": { color: "#9747ff" },
                  "&.Mui-disabled": { color: "#c4c4c4" },
                }}
                disabled={hasKeyField && !column.key}
              />
            }
            label="Key"
            sx={{ marginRight: 2, mt: 2.8 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={column.required}
                onChange={(e) =>
                  handleFieldChange(index, "required", e.target.checked)
                }
                sx={{ color: "#9747ff", "&.Mui-checked": { color: "#9747ff" } }}
              />
            }
            sx={{ mt: 2.8 }}
            label="Required"
          />

          <ToggleSwitch
            option1={"Active"}
            option2={"Inactive"}
            activeColor={"green"}
            inactiveColor={"red"}
            buttonOneSx={{
              fontWeight: 600,
              fontSize: "13px",
            }}
            buttonTwoSx={{ fontWeight: 600, fontSize: "13px" }}
            containerWidth="200px"
            containerMargin="15px 3px 0"
            showDoneIcon={false}
            isActive={column.isActive ? true : false}
            onToggle={() => handleToggle(column?.name, column)}
          />

          {!column.name.startsWith("es_") && (
            <Tooltip title="Delete" placement="top">
              <IconButton
                onClick={() => handleDeleteField(index)}
                sx={{
                  color: "#9747ff",
                  position: "absolute",
                  zIndex: "3000",
                  right: "0rem",
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ))}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle variant="h3" component="h3" sx={{ color: "#000", mt: 1 }}>
          Add New Field
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{ width: "34rem", marginBottom: "1rem", marginTop: "0.5rem" }}
          >
            <ESCustomTextField
              label="Field Name"
              value={newField.name}
              onChange={(e) =>
                setNewField({ ...newField, name: e.target.value })
              }
              width="100%"
              error={errorFields.name}
              helperText={errorFields.name ? "*Required" : ""}
            />
          </Box>
          <Box sx={{ width: "34rem", marginBottom: "1rem" }}>
            <ESCustomTextField
              label="Field Label"
              value={newField.label}
              onChange={(e) =>
                setNewField({ ...newField, label: e.target.value })
              }
              width="100%"
              error={errorFields.label}
              helperText={errorFields.label ? "*Required" : ""}
            />
          </Box>
          <Box sx={{ width: "34rem", marginBottom: "1rem" }}>
            <ESCustomDropdown
              label="Field Type"
              options={fileTypes}
              value={fileTypes.find((type) => type.value === newField.type)}
              onChange={(selectedOption) =>
                setNewField({ ...newField, type: selectedOption.value })
              }
              width="100%"
              error={errorFields.type}
              helperText={errorFields.type ? "*Required" : ""}
            />
          </Box>
          <Box sx={{ padding: "0rem", margin: "0rem" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={newField.key}
                  onChange={(e) =>
                    setNewField({ ...newField, key: e.target.checked })
                  }
                  sx={{
                    color: "#9747ff",
                    "&.Mui-checked": { color: "#9747ff" },
                    "&.Mui-disabled": { color: "#c4c4c4" },
                  }}
                  disabled={hasKeyField}
                />
              }
              label="Key"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={newField.required}
                  onChange={(e) =>
                    setNewField({ ...newField, required: e.target.checked })
                  }
                  sx={{
                    color: "#9747ff",
                    "&.Mui-checked": { color: "#9747ff" },
                  }}
                />
              }
              label="Required"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleAddField}
            variant="outlined"
            // sx={{
            //   backgroundColor: "#9747ff",
            //   color: "#fff",
            //   "&:hover": {
            //     backgroundColor: "#9747ff",
            //     transform: "scale(1.05)",
            //     transition: "transform 0.2s",
            //   },
            // }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddFields;
