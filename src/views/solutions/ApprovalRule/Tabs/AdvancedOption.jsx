import React, { useState, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Checkbox,
  FormControlLabel,
  Button,
  Snackbar,
  Alert,
  Paper,
  Grid,
  Divider,
  Collapse,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  addAdvancedRule,
  updateAdvancedRule,
  deleteAdvancedRule,
} from "store/reducer/ApprovalReducer";
import InfoIcon from "@mui/icons-material/Info";
import { Tooltip } from "@mui/material";
import ESCustomDropdown from "ui-component/ESCustomDropdown";
import ESCustomTextField from "ui-component/ESCustomTextField";

const AdvancedOptions = () => {
  const dispatch = useDispatch();
  const tables = useSelector((state) => {
    return state.approvalReducer.tables
      .map((table) => ({ ...table }))
      .filter((table) => table.isActive);
  });

  const advancedRules = useSelector(
    (state) => state.approvalReducer.advancedRules
  );

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [expanded, setExpanded] = useState({});
  const [editingRule, setEditingRule] = useState(null);
  const [newRule, setNewRule] = useState(null);
  console.log(tables);

  const options = useMemo(
    () =>
      tables.map((table) => ({
        value: table.id,
        label: table.name,
        approvalType: table.approvalType,
        status: table.isActive ? "Active" : "Inactive",
      })),
    [tables]
  );
  console.log(options);

  const getAvailableOptions = useCallback(
    (currentRuleId) => {
      const selectedOptions = advancedRules.flatMap((rule) =>
        rule.id !== currentRuleId && rule.selectedOption
          ? rule.selectedOption.map((option) => option.value)
          : []
      );

      if (newRule && newRule.id !== currentRuleId) {
        selectedOptions.push(
          ...(newRule.selectedOption?.map((option) => option.value) || [])
        );
      }

      return options.filter(
        (option) => !selectedOptions.includes(option.value)
      );
    },
    [advancedRules, newRule, options]
  );

  const allOptionsSelected = useMemo(() => {
    const totalSelectedOptions = advancedRules
      .flatMap((rule) =>
        rule.selectedOption
          ? rule.selectedOption.map((option) => option.value)
          : []
      )
      .concat(newRule?.selectedOption?.map((option) => option.value) || []);

    return totalSelectedOptions.length >= options.length;
  }, [advancedRules, newRule, options]);

  const handleAddNewRule = () => {
    const rule = {
      id: `rule-${Date.now()}`,
      name: `AdvancedRule ${advancedRules.length + 1}`,
      escalateToSupervisor: false,
      timeoutPeriod: null,
      timeoutValue: "",
      singleApprovalRejection: null,
      multiApprovalRejection: null,
      fallbackAction: null,
      selectedOption: null,
    };
    setNewRule(rule);
    setExpanded((prev) => ({ ...prev, [rule.id]: true }));
    setEditingRule(rule.id);
  };

  const handleDeleteRule = (ruleId) => {
    dispatch(deleteAdvancedRule(ruleId));
    setEditingRule(null);
    setExpanded((prev) => ({ ...prev, [ruleId]: false }));
  };

  const handleRuleChange = (ruleId, field, value) => {
    if (newRule && newRule.id === ruleId) {
      setNewRule((prev) => ({ ...prev, [field]: value }));
    } else {
      dispatch(updateAdvancedRule({ id: ruleId, [field]: value }));
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const toggleExpandCollapse = (ruleId) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [ruleId]: !prevExpanded[ruleId],
    }));
  };

  const handleCancel = (ruleId) => {
    if (newRule && newRule.id === ruleId) {
      setNewRule(null);
    }
    setEditingRule(null);
    setExpanded((prev) => ({ ...prev, [ruleId]: false }));
    setSnackbarMessage("Changes canceled.");
    setSnackbarOpen(true);
  };

  const handleSave = (ruleId) => {
    const ruleToSave =
      newRule && newRule.id === ruleId
        ? newRule
        : advancedRules.find((rule) => rule.id === ruleId);

    if (ruleToSave.selectedOption && ruleToSave.selectedOption.length > 0) {
      // Create individual rules for each selected option
      ruleToSave.selectedOption.forEach((option) => {
        const individualRule = {
          ...ruleToSave,
          id: `${ruleToSave.id}-${option.value}`,
          selectedOption: [option],
        };

        if (newRule && newRule.id === ruleId) {
          dispatch(addAdvancedRule(individualRule));
        } else {
          dispatch(updateAdvancedRule(individualRule));
        }
      });

      setSnackbarMessage("Rules saved successfully.");
    } else {
      setSnackbarMessage("No options selected. Rule not saved.");
    }

    setNewRule(null);
    setEditingRule(null);
    setExpanded((prev) => ({ ...prev, [ruleId]: false }));
    setSnackbarOpen(true);
  };

  const isRuleComplete = (rule) => {
    return (
      rule.selectedOption &&
      rule.selectedOption.length > 0 &&
      rule.timeoutPeriod &&
      rule.timeoutValue &&
      rule.singleApprovalRejection &&
      rule.multiApprovalRejection &&
      rule.fallbackAction
    );
  };

  const handleEdit = (ruleId) => {
    setEditingRule(ruleId);
    setExpanded((prev) => ({ ...prev, [ruleId]: true }));
  };

  const availableOptions = useMemo(() => {
    const selectedOptions = advancedRules.flatMap((rule) =>
      rule.selectedOption
        ? rule.selectedOption.map((option) => option.value)
        : []
    );
    if (newRule && newRule.selectedOption) {
      selectedOptions.push(
        ...newRule.selectedOption.map((option) => option.value)
      );
    }
    return options.filter((option) => !selectedOptions.includes(option.value));
  }, [advancedRules, newRule, options]);

  const customOption = ({ innerProps, label, data }) => (
    <div
      {...innerProps}
      style={{ display: "flex", alignItems: "center", padding: "8px" }}
    >
      <span style={{ marginRight: "8px" }}>{label}</span>
      <Chip
        label={data.status}
        size="small"
        color={data.status === "Active" ? "success" : "default"}
      />
    </div>
  );

  const timeoutPeriodOptions = [
    { value: "Hours", label: "Hours" },
    { value: "Days", label: "Days" },
    { value: "Months", label: "Months" },
  ];

  const rejectionOptions = [
    {
      value: "Return",
      label: "Return To Previous Level",
      info: "Send the approval back to the previous level",
    },
    {
      value: "Cancel",
      label: "Cancel Approval Process",
      info: "Terminate the entire approval process",
    },
    {
      value: "Escalate",
      label: "Escalate To Supervisor",
      info: "Send the approval to a higher authority",
    },
    {
      value: "Notify",
      label: "Notify Procurement Team",
      info: "Alert the procurement team about the rejection",
    },
  ];

  const renderRuleContent = (rule) => {
    const isEditing = editingRule === rule.id;
    const isComplete = isRuleComplete(rule);
    return (
      <>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} md={4}>
            <ESCustomDropdown
              value={rule.timeoutPeriod}
              onChange={(selected) =>
                handleRuleChange(rule.id, "timeoutPeriod", selected)
              }
              options={timeoutPeriodOptions}
              isClearable
              boxSx={{ width: "100%" }}
              label="Select Approval Timeout Period"
              isDisabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ESCustomTextField
              value={rule.timeoutValue}
              onChange={(e) =>
                handleRuleChange(rule.id, "timeoutValue", e.target.value)
              }
              label="Enter Timeout Value"
              boxSx={{ width: "100%" }}
              variant="outlined"
              disabled={!isEditing}
              type="number"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={rule.escalateToSupervisor}
                  onChange={(e) =>
                    handleRuleChange(
                      rule.id,
                      "escalateToSupervisor",
                      e.target.checked
                    )
                  }
                  disabled={!isEditing}
                />
              }
              label="Escalate To Supervisor"
              labelPlacement="start"
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <ESCustomDropdown
              value={rule.singleApprovalRejection}
              onChange={(selected) =>
                handleRuleChange(rule.id, "singleApprovalRejection", selected)
              }
              options={rejectionOptions}
              isClearable
              boxSx={{ width: "100%" }}
              label="Select Single Approval Rejection Behavior"
              isDisabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ESCustomDropdown
              value={rule.multiApprovalRejection}
              onChange={(selected) =>
                handleRuleChange(rule.id, "multiApprovalRejection", selected)
              }
              options={rejectionOptions}
              isClearable
              boxSx={{ width: "100%" }}
              label="Select Multi Approval Rejection Behaviour"
              isDisabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ESCustomDropdown
              value={rule.fallbackAction}
              onChange={(selected) =>
                handleRuleChange(rule.id, "fallbackAction", selected)
              }
              options={rejectionOptions}
              isClearable
              boxSx={{ width: "100%" }}
              label="Select Fallback Action"
              isDisabled={!isEditing}
            />
          </Grid>
        </Grid>

        {isEditing && (
          <Box display="flex" justifyContent="flex-end" sx={{ mt: 2, gap: 2 }}>
            <Button variant="outlined" onClick={() => handleCancel(rule.id)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSave(rule.id)}
              disabled={!isComplete}
            >
              {newRule && newRule.id === rule.id ? "Add" : "Save"}
            </Button>
          </Box>
        )}
      </>
    );
  };

  return (
    <Box sx={{ backgroundColor: "#fff" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 0.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <Typography variant="h2" sx={{ color: "#000" }}>
            Set Advanced Settings
          </Typography>
          <Tooltip
            title="This section allows you to set advanced options for approval rules."
            placement="top"
          >
            <InfoIcon sx={{ ml: 2, color: "#000", cursor: "pointer", mt: 0 }} />
          </Tooltip>
        </Box>
        <Tooltip title="Add New Configuration" placement="top">
          <IconButton onClick={handleAddNewRule} disabled={allOptionsSelected}>
            <AddIcon
              sx={{ fontSize: 32, color: allOptionsSelected ? "#ddd" : "#000" }}
            />
          </IconButton>
        </Tooltip>
      </Box>
      <Typography variant="body2" sx={{ color: "#666", mb: 2, mt: -1 }}>
        Configure Advanced Options For Created Approval Rules
      </Typography>

      {advancedRules.length === 0 && !newRule ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            minHeight: "550px",
            borderRadius: "10px",
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
            <SettingsIcon
              sx={{
                fontSize: 80,
                color: "000",
                mb: 2,
              }}
            />
            <SettingsIcon
              sx={{
                fontSize: 80,
                color: "#9747FF",
                mb: 2,
                position: "absolute",
                bottom: "3px",
                right: "3px",
              }}
            />
          </Box>
          <Typography variant="h6" sx={{ mb: 2, color: "#333" }}>
            No Advanced Options set yet!
          </Typography>
          <Typography
            variant="body1"
            sx={{ mb: 2, color: "#666", textAlign: "center" }}
          >
            Click the "+" icon above to set advanced options for a particular
            created rule.
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddNewRule}
          >
            Set Advanced Options for Created Rules
          </Button>
        </Box>
      ) : (
        [...advancedRules, ...(newRule ? [newRule] : [])]
          .slice(0)
          .reverse()
          .map((rule) => (
            <Paper
              key={rule.id}
              elevation={3}
              sx={{
                p: 2,
                mb: 3,
                borderRadius: 2,
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box
                  display="flex"
                  alignItems="center"
                  height="100%"
                  width="90%"
                >
                  {editingRule === rule.id ? (
                    <ESCustomDropdown
                      value={rule.selectedOption}
                      onChange={(selectedOption) => {
                        handleRuleChange(
                          rule.id,
                          "selectedOption",
                          selectedOption
                        );
                      }}
                      options={getAvailableOptions(rule.id)}
                      isMulti
                      components={{ Option: customOption }}
                      isClearable
                      placeholder="Select Approval Rule"
                      isDisabled={false}
                      width="100%"
                      boxSx={{ mt: 2 }}
                    />
                  ) : (
                    rule.selectedOption &&
                    rule.selectedOption.map((rule) => {
                      console.log(rule);

                      return (
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          <Typography
                            variant="h4"
                            sx={{ mb: 1, color: "#000" }}
                          >
                            {rule.label}
                          </Typography>
                          <Typography
                            variant="h5"
                            sx={{ color: "#000", fontWeight: "400" }}
                          >
                            Approval ID: <strong>{rule?.value}</strong>
                          </Typography>
                          <Typography
                            variant="h5"
                            sx={{ color: "#000", fontWeight: "400" }}
                          >
                            Approval Type: <strong>{rule?.approvalType}</strong>
                          </Typography>
                        </Box>
                      );
                    })
                  )}
                </Box>
                <Box display="flex" alignItems="center">
                  {!newRule || newRule.id !== rule.id ? (
                    <>
                      <IconButton onClick={() => handleEdit(rule.id)}>
                        <EditIcon sx={{ color: "#000" }} />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteRule(rule.id)}>
                        <DeleteIcon sx={{ color: "#000" }} />
                      </IconButton>
                    </>
                  ) : null}
                  <IconButton onClick={() => toggleExpandCollapse(rule.id)}>
                    {expanded[rule.id] ? (
                      <KeyboardArrowUpIcon sx={{ color: "#000" }} />
                    ) : (
                      <KeyboardArrowDownIcon sx={{ color: "#000" }} />
                    )}
                  </IconButton>
                </Box>
              </Box>

              <Collapse in={expanded[rule.id]}>
                <Divider sx={{ my: 2 }} />
                {renderRuleContent(rule)}
              </Collapse>
            </Paper>
          ))
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="info"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};
export default AdvancedOptions;
