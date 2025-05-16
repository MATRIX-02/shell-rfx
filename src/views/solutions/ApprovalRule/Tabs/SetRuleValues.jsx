import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Info, Edit } from "@mui/icons-material";
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Tooltip,
  Snackbar,
} from "@mui/material";
import RuleIcon from "@mui/icons-material/Rule";
import ESCustomDropdown from "ui-component/ESCustomDropdown";
import ESCustomTextField from "ui-component/ESCustomTextField";
import ESCustomNumberField from "ui-component/ESCustomNumberField";
import {
  updateRuleFieldValue,
  updateTableArray,
} from "store/reducer/ApprovalReducer";
import MuiAlert from "@mui/material/Alert";

import { dummyOptions } from "./constants";
import { currencyOptions } from "./constants";

const SetRuleValues = () => {
  const dispatch = useDispatch();
  const approvalTableArray = useSelector(
    (state) => state.approvalReducer.tables
  );
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const activeRules = approvalTableArray.filter((rule) => rule.isActive);
  const ruleOptions = activeRules.map((rule) => ({
    value: rule.id,
    label: rule.name,
  }));

  const selectedRule = useMemo(() => {
    const lastSelectedRuleId = localStorage.getItem("lastSelectedRuleId");
    if (lastSelectedRuleId) {
      return activeRules.find((rule) => rule.id === lastSelectedRuleId) || null;
    }
    return null;
  }, [activeRules]);

  useEffect(() => {
    if (selectedRule) {
      localStorage.setItem("lastSelectedRuleId", selectedRule.id);
    } else {
      localStorage.removeItem("lastSelectedRuleId");
    }
  }, [selectedRule]);

  const handleRuleChange = (selectedOption) => {
    if (selectedOption) {
      const newSelectedRule = activeRules.find(
        (rule) => rule.id === selectedOption.value
      );
      if (newSelectedRule) {
        localStorage.setItem("lastSelectedRuleId", newSelectedRule.id);
        // Force a re-render to update the memoized selectedRule
        dispatch({ type: "FORCE_RERENDER" });
      }
    } else {
      localStorage.removeItem("lastSelectedRuleId");
      // Force a re-render to update the memoized selectedRule
      dispatch({ type: "FORCE_RERENDER" });
    }
    setErrors({});
    setIsEditing(true);
  };

  const handleFieldChange = (fieldName, value) => {
    if (selectedRule && isEditing) {
      let updatedFields = selectedRule.fields.map((field) => {
        if (field.name === fieldName) {
          return { ...field, value };
        } else if (field.name === "amount" && fieldName === "amount_currency") {
          return { ...field, currency: value };
        }
        return field;
      });

      const updatedRule = { ...selectedRule, fields: updatedFields };
      dispatch(
        updateRuleFieldValue({
          ruleId: selectedRule.id,
          fieldName: fieldName,
          value: value,
        })
      );
      setErrors((prev) => ({ ...prev, [fieldName]: "" }));

      // Check for range condition
      if (
        fieldName === "amount_lower_limit" ||
        fieldName === "amount_upper_limit"
      ) {
        const amountField = updatedFields.find((f) => f.name === "amount");
        if (amountField && amountField.operator.toLowerCase() === "range") {
          const lowerLimit =
            fieldName === "amount_lower_limit" ? value : amountField.lowerLimit;
          const upperLimit =
            fieldName === "amount_upper_limit" ? value : amountField.upperLimit;
          if (
            lowerLimit !== undefined &&
            upperLimit !== undefined &&
            lowerLimit >= upperLimit
          ) {
            setErrors((prev) => ({
              ...prev,
              [fieldName]: "Lower limit must be less than upper limit",
            }));
          }
        }
      }
    }
  };

  const handleSave = () => {
    const newErrors = {};
    let hasErrors = false;

    selectedRule.fields.forEach((field) => {
      if (field.name === "amount") {
        if (!field.value && field.value !== 0) {
          newErrors["amount"] = "*required field";
          hasErrors = true;
        }
        if (!field.currency) {
          newErrors["amount_currency"] = "*required field";
          hasErrors = true;
        }
        if (field.operator.toLowerCase() === "range") {
          if (field.lowerLimit >= field.upperLimit) {
            newErrors["amount_lower_limit"] =
              "Lower limit must be less than upper limit";
            hasErrors = true;
          }
        }
      } else if (!field.value && field.value !== 0) {
        newErrors[field.name] = "*required field";
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
    } else {
      dispatch(updateTableArray(selectedRule));
      setIsEditing(false);
      setErrors({});
      setSnackbarOpen(true);
    }
  };

  const handleCancel = () => {
    if (!isEditing) {
      // setSelectedRule(null);
      setErrors({});
      setIsEditing(false);
      localStorage.removeItem("lastSelectedRuleId");
    } else {
      setIsEditing(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const renderField = (field) => {
    if (field.name.toLowerCase() === "amount") {
      return renderAmountField(field);
    } else if (field.isPredefined) {
      return renderPredefinedField(field);
    } else {
      return renderRegularField(field);
    }
  };

  const renderAmountField = (field) => {
    const isRange = field.operator.toLowerCase() === "range";

    return (
      <Box key={field.name} sx={{ display: "flex", gap: 2, width: "100%" }}>
        <ESCustomDropdown
          value={
            field.currency
              ? { value: field.currency, label: field.currency }
              : null
          }
          onChange={(selected) =>
            handleFieldChange(
              "amount_currency",
              selected ? selected.value : null
            )
          }
          options={currencyOptions}
          isClearable
          boxSx={{ width: "30%" }}
          label="Currency"
          disabled={!isEditing}
          helperText={errors["amount_currency"] || ""}
          error={!!errors["amount_currency"]}
        />
        {isRange ? (
          <>
            <ESCustomNumberField
              value={field.lowerLimit}
              onChange={(value) =>
                handleFieldChange("amount_lower_limit", value)
              }
              label="Amount Lower Limit"
              fullWidth
              boxSx={{ width: "35%" }}
              helperText={errors["amount_lower_limit"] || ""}
              error={!!errors["amount_lower_limit"]}
              disabled={!isEditing}
              type="number"
            />
            <ESCustomNumberField
              value={field.upperLimit}
              onChange={(value) =>
                handleFieldChange("amount_upper_limit", value)
              }
              label="Amount Upper Limit"
              fullWidth
              boxSx={{ width: "35%" }}
              helperText={errors["amount_upper_limit"] || ""}
              error={!!errors["amount_upper_limit"]}
              disabled={!isEditing}
              type="number"
            />
          </>
        ) : (
          <ESCustomNumberField
            value={field.value}
            onChange={(value) => handleFieldChange(field.name, value)}
            label={field.label}
            fullWidth
            boxSx={{ width: "70%" }}
            helperText={errors[field.name] || ""}
            error={!!errors[field.name]}
            disabled={!isEditing}
            type="number"
          />
        )}
      </Box>
    );
  };

  const renderPredefinedField = (field) => {
    const isMulti = ["contain", "contains"].includes(
      field.operator.toLowerCase()
    );
    const options = dummyOptions[field.name] || [];

    // Ensure field.value is an array when isMulti is true
    const fieldValue = isMulti
      ? Array.isArray(field.value)
        ? field.value
        : []
      : field.value;

    return (
      <ESCustomDropdown
        key={field.name}
        value={
          fieldValue
            ? isMulti
              ? fieldValue.map(
                  (v) =>
                    options.find((o) => o.value === v) || { value: v, label: v }
                )
              : options.find((o) => o.value === fieldValue) || {
                  value: fieldValue,
                  label: fieldValue,
                }
            : null
        }
        onChange={(selected) => {
          const newValue = isMulti
            ? (selected || []).map((item) => item.value)
            : selected
              ? selected.value
              : null;
          handleFieldChange(field.name, newValue);
        }}
        options={options}
        isMulti={isMulti}
        isClearable
        boxSx={{ width: "100%", marginBottom: 2 }}
        label={field.label}
        helperText={errors[field.name] || ""}
        error={!!errors[field.name]}
        disabled={!isEditing}
      />
    );
  };

  const renderRegularField = (field) => {
    const fieldType = field.type.toLowerCase();
    const inputType =
      fieldType === "number"
        ? "number"
        : fieldType === "email"
          ? "email"
          : "text";

    return (
      <ESCustomTextField
        key={field.name}
        value={field.value || ""}
        onChange={(event) => handleFieldChange(field.name, event.target.value)}
        label={field.label}
        fullWidth
        boxSx={{ width: "100%", marginBottom: 2 }}
        helperText={errors[field.name] || ""}
        error={!!errors[field.name]}
        disabled={!isEditing}
        type={inputType}
      />
    );
  };

  return (
    <Box sx={{ mb: 5 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "fit-content",
          gap: 1,
          mb: 1,
        }}
      >
        <Typography variant="h2" sx={{ color: "#000", mt: 1.2 }}>
          Set Approval Rule Values
        </Typography>
        <Tooltip
          title="This section allows you to set approval rule field values"
          placement="top"
        >
          <Info sx={{ ml: 1, color: "#000", cursor: "pointer", mt: 1 }} />
        </Tooltip>
      </Box>
      <Typography variant="body2" gutterBottom>
        Set Approval Rule field values (created in Approval Rule page in
        Technical Settings)
      </Typography>
      <Box sx={{ mt: 5 }}>
        <Box>
          <ESCustomDropdown
            value={
              selectedRule
                ? { value: selectedRule.id, label: selectedRule.name }
                : null
            }
            onChange={handleRuleChange}
            options={ruleOptions}
            isClearable
            boxSx={{ width: "100%", marginBottom: 2 }}
            label="Select Approval Rule"
          />
        </Box>
        {selectedRule && (
          <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
            <Box sx={{ mb: 3, width: "100%" }}>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h3"
                  sx={{ color: "#000", fontWeight: "600", mb: 1 }}
                >
                  <strong>{selectedRule?.name}</strong>
                </Typography>
                {!isEditing && (
                  <IconButton onClick={handleEdit}>
                    <Edit />
                  </IconButton>
                )}
              </Box>
              <Typography
                variant="h5"
                sx={{ color: "#000", fontWeight: "400", mb: 1 }}
              >
                Approval Type: <strong>{selectedRule?.approvalType}</strong>
              </Typography>
              <Typography
                variant="h5"
                sx={{ color: "#000", fontWeight: "400", mb: 1 }}
              >
                Approval ID: <strong>{selectedRule?.id}</strong>
              </Typography>
            </Box>
            {selectedRule.fields.map(renderField)}
            {isEditing && (
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
                {/* <Button onClick={handleCancel} sx={{ mr: 1 }}>
                  Cancel
                </Button> */}
                <Button
                  onClick={handleSave}
                  variant="contained"
                  color="primary"
                >
                  Save
                </Button>
              </Box>
            )}
          </Paper>
        )}
        {!selectedRule && (
          <Box
            sx={{
              width: "100%",
              m: 0,
              mt: 5,
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
              Choose a Approval Rule from dropdown to enter its fields' values
            </Typography>
          </Box>
        )}
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ mt: 8, backgroundColor: "#fff" }}
      >
        <MuiAlert
          elevation={6}
          variant="outlined"
          onClose={handleSnackbarClose}
          severity="success"
          sx={{
            boxShadow:
              "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)",
          }}
        >
          Rule values saved successfully!
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default SetRuleValues;
