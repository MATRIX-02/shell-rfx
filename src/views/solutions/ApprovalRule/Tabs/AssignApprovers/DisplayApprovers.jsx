import { Box, Button, Chip, IconButton, Tooltip } from "@mui/material";
import React, { useState } from "react";
import ESCustomDropdown from "ui-component/ESCustomDropdown";
import ESCustomNumberField from "ui-component/ESCustomNumberField";
import {
  conditionOperatorOptionsForAmount,
  conditionOperatorOptionsForPredefinedFields,
} from "../constants";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  addApproverLevel,
  deleteApproverLevel,
  updateApproverLevel,
  saveApproverLevel,
} from "store/reducer/ApprovalReducer";
import { useDispatch } from "react-redux";
import { employees } from "../constants";
import SaveApproverButton from "./SaveApproverButton";

const Approver = ({
  approver,
  index,
  setSnackbarMessage,
  setSnackbarOpen,
  ruleId,
}) => {
  const dispatch = useDispatch();
  const handleChange = (field, value) => {
    const updatedApproverDetails = {
      ruleId,
      id: approver.levelId,
      levelData: {
        ...approver,
        [field]: value,
      },
    };
    dispatch(updateApproverLevel(updatedApproverDetails));
  };
  const handleSaveApprover = (ruleId, levelId) => {
    dispatch(saveApproverLevel({ ruleId, levelId }));
  };
  const handleDeleteApprover = (ruleId, id) => {
    dispatch(deleteApproverLevel({ ruleId, id }));
    setSnackbarOpen(true);
    setSnackbarMessage("Appover deleted");
  };

  return (
    <Box
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        p: 2,
        backgroundColor: "#f9f9f9",
      }}
    >
      <Box>
        <Chip
          sx={{
            mb: 2,
            backgroundColor: "white",
            color: "#9747ff",
            fontWeight: "bold",
            border: "1px solid #9747ff",
          }}
          label={`Level ${index + 1}`}
        />
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <ESCustomDropdown
            value={
              Object.keys(approver?.conditionParam ?? {}).length === 0
                ? ""
                : approver?.conditionParam
            }
            onChange={(e) => handleChange("conditionParam", e)}
            options={[{ label: "Amount", value: "Amount" }]}
            label="Select Condition Parameter"
            isClearable
            style={{ margin: "0px" }}
            textFieldborderColor={"#4682b4"}
            // textFieldbackGroundColor={"#f0f8ff"}
          />
          <ESCustomDropdown
            value={
              Object.keys(approver?.conditionOperator ?? {}).length === 0
                ? ""
                : approver?.conditionOperator
            }
            onChange={(e) => handleChange("conditionOperator", e)}
            options={
              approver?.conditionParam?.label === "Category ID" ||
              approver?.conditionParam?.label === "Post PO Document" ||
              approver?.conditionParam?.label === "Company" ||
              approver?.conditionParam?.label === "Country"
                ? conditionOperatorOptionsForPredefinedFields
                : conditionOperatorOptionsForAmount
            }
            label="Select Condition Operator"
            isClearable
            textFieldborderColor={"#4682b4"}
            // textFieldbackGroundColor={"#f0f8ff"}
          />

          <ESCustomNumberField
            value={approver.numberFieldOne}
            onChange={(e) => {
              handleChange("numberFieldOne", e);
            }}
            label={
              approver?.conditionOperator?.value === "between"
                ? "Lower Range Value"
                : "Enter Threshold Value"
            }
            variant="outlined"
            style={{ marginBottom: "0px", width: "12rem" }}
            disabled={false}
            textFieldborderColor={"#4682b4"}
            // textFieldbackGroundColor={"#f0f8ff"}
          />

          {approver?.conditionOperator?.value === "between" && (
            <ESCustomNumberField
              value={approver.numberFieldTwo}
              onChange={(e) => handleChange("numberFieldTwo", e)}
              label="Upper Range Value"
              variant="outlined"
              style={{ marginBottom: "0px", width: "12rem" }}
              textFieldborderColor={"#4682b4"}
            />
          )}
          {/* <ESCustomDropdown
            value={
              Object.keys(approver?.selectedRole ?? {}).length === 0
                ? ""
                : approver?.selectedRole
            }
            options={roles}
            onChange={(e) => handleChange("selectedRole", e)}
            label="Select Roles"
            isClearable
          /> */}
          <ESCustomDropdown
            value={
              Object.keys(approver?.selectedEmployee ?? {}).length === 0
                ? ""
                : approver?.selectedEmployee
            }
            width="22rem"
            options={employees}
            onChange={(e) => handleChange("selectedEmployee", e)}
            label="Select Roles & Employee"
            isClearable
          />
          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <SaveApproverButton
              ruleId={ruleId}
              approver={approver}
              handleSaveApprover={handleSaveApprover}
            />
            <Tooltip placement="top" title="Delete">
              <IconButton sx={{ color: "#9747ff" }}>
                <DeleteIcon
                  onClick={() => handleDeleteApprover(ruleId, approver.levelId)}
                />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const DisplayApprovers = ({
  setSnackbarMessage,
  setSnackbarOpen,
  ruleId,
  approvers,
}) => {
  const dispatch = useDispatch();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {approvers.map((approver, index) => (
        <Approver
          key={approver.levelId}
          approver={approver}
          index={index}
          setSnackbarMessage={setSnackbarMessage}
          setSnackbarOpen={setSnackbarOpen}
          ruleId={ruleId}
        />
      ))}
      {/* <Button
        onClick={handleAddNewApprover}
        sx={{ mt: 3, width: "15rem" }}
        variant="outlined"
      >
        Add New Approver
      </Button> */}
    </Box>
  );
};

export default DisplayApprovers;
