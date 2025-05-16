import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Chip, IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ESCustomDropdown from "ui-component/ESCustomDropdown";
import ESCustomNumberField from "ui-component/ESCustomNumberField";
import {
  updateToAllLevelData,
  deleteFromAllLevelData,
  SetAllDataToAllLevelsData,
  saveToAllLevelsData,
} from "store/reducer/ApprovalReducer";
import {
  roles,
  employees,
  conditionOperatorOptionsForAmount,
  conditionOperatorOptionsForPredefinedFields,
} from "../constants";
import SaveApproverButton from "./SaveApproverButton";

const ApproversDropdown = ({ setSnackbarMessage, setSnackbarOpen, ruleId }) => {
  const dispatch = useDispatch();
  const allSelectedRules = useSelector(
    (state) => state.approvalReducer.selectedApproverRules
  );
  const AllLevelsData = useSelector(
    (state) => state.approvalReducer.AllLevelsData
  );

  const handleSetAllDataToAllLevelsData = () => {
    dispatch(SetAllDataToAllLevelsData({ allSelectedRules }));
  };

  const handleUpdateLevel = (levelId, field, value, level) => {
    console.log(value);

    const updatedApproverDetails = {
      levelId,
      levelData: { ...level, [field]: value },
    };
    dispatch(updateToAllLevelData(updatedApproverDetails));
  };
  const handleSaveApprover = (levelId) => {
    dispatch(saveToAllLevelsData({ levelId }));
  };
  const handleDeleteApprover = (levelId) => {
    dispatch(deleteFromAllLevelData({ levelId }));
  };

  return (
    <Box>
      {AllLevelsData.map((level, index) => (
        <Box
          key={level.levelId}
          sx={{
            p: 2,
            mt: 2,
            border: "1px solid #e0e0e0",
            borderRadius: 2,
            backgroundColor: "#f9f9f9",
          }}
        >
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
                Object.keys(level?.conditionParam ?? {}).length === 0
                  ? ""
                  : level?.conditionParam
              }
              onChange={(e) =>
                handleUpdateLevel(level.levelId, "conditionParam", e, level)
              }
              options={[{ label: "Amount", value: "Amount" }]}
              label="Select Condition Parameter"
              isClearable
              style={{ margin: "0px" }}
              textFieldborderColor={"#4682b4"}
              //textFieldbackGroundColor={"#f0f8ff"}
            />
            <ESCustomDropdown
              value={
                Object.keys(level?.conditionOperator ?? {}).length === 0
                  ? ""
                  : level?.conditionOperator
              }
              onChange={(e) =>
                handleUpdateLevel(level.levelId, "conditionOperator", e, level)
              }
              options={
                level.conditionParam === "Category ID" ||
                level.conditionParam === "Post PO Document" ||
                level.conditionParam === "Company" ||
                level.conditionParam === "Country"
                  ? conditionOperatorOptionsForPredefinedFields
                  : conditionOperatorOptionsForAmount
              }
              label="Select Condition Operator"
              isClearable
              textFieldborderColor={"#4682b4"}
              // textFieldbackGroundColor={"#f0f8ff"}
            />

            <ESCustomNumberField
              value={level?.numberFieldOne}
              onChange={(e) =>
                handleUpdateLevel(level.levelId, "numberFieldOne", e, level)
              }
              label={
                level?.conditionOperator?.value === "between"
                  ? "Lower Range Value"
                  : "Enter Threshold Value"
              }
              variant="outlined"
              style={{ marginBottom: "0px", width: "12rem" }}
              disabled={false}
              textFieldborderColor={"#4682b4"}
              // textFieldbackGroundColor={"#f0f8ff"}
            />
            {level?.conditionOperator?.value === "between" && (
              <ESCustomNumberField
                value={level?.numberFieldTwo}
                onChange={(e) =>
                  handleUpdateLevel(level.levelId, "numberFieldTwo", e, level)
                }
                label="Upper Range Value"
                variant="outlined"
                style={{ marginBottom: "0px", width: "12rem" }}
                textFieldborderColor={"#4682b4"}
              />
            )}
            {/* <ESCustomDropdown
              value={
                Object.keys(level?.selectedRole ?? {}).length === 0
                  ? ""
                  : level?.selectedRole
              }
              options={roles}
              onChange={(e) =>
                handleUpdateLevel(level.levelId, "selectedRole", e, level)
              }
              label="Select Roles"
              isClearable
            /> */}
            <ESCustomDropdown
              value={
                Object.keys(level?.selectedEmployee ?? {}).length === 0
                  ? ""
                  : level?.selectedEmployee
              }
              options={employees}
              onChange={(e) =>
                handleUpdateLevel(level.levelId, "selectedEmployee", e, level)
              }
              label="Select Roles & Employee"
              isClearable
              width="22rem"
            />
            <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
              <SaveApproverButton
                ruleId={ruleId}
                approver={level}
                handleSaveApprover={handleSaveApprover}
                isSettingAllLevelData={true}
              />
              <Tooltip placement="top" title="Delete">
                <IconButton
                  sx={{ color: "#9747ff" }}
                  onClick={() => handleDeleteApprover(level.levelId)}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      ))}
      {AllLevelsData.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "end" }}>
          <Button
            onClick={handleSetAllDataToAllLevelsData}
            sx={{ mt: 3, width: "10rem" }}
            variant="outlined"
          >
            Update
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ApproversDropdown;
