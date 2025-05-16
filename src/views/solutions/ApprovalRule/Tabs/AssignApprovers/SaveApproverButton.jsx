import { Button } from "@mui/material";
import React, { useMemo } from "react";

const isObjectWithValueAndLabel = (obj) =>
  obj &&
  typeof obj === "object" &&
  "value" in obj &&
  "label" in obj &&
  obj.value != null &&
  obj.label != null;

const SaveApproverButton = ({
  ruleId,
  approver,
  handleSaveApprover,
  isSettingAllLevelData,
}) => {
  const {
    conditionOperator,
    conditionParam,
    selectedEmployee,
    numberFieldOne,
    numberFieldTwo,
    levelId,
  } = approver;

  const isDisabled = useMemo(() => {
    const mandatoryFieldsFilled =
      isObjectWithValueAndLabel(conditionOperator) &&
      isObjectWithValueAndLabel(conditionParam) &&
      isObjectWithValueAndLabel(selectedEmployee) &&
      numberFieldOne != null &&
      numberFieldOne !== "";

    if (conditionOperator?.value === "between") {
      return !(
        mandatoryFieldsFilled &&
        numberFieldTwo != null &&
        numberFieldTwo !== ""
      );
    }

    return !mandatoryFieldsFilled;
  }, [
    conditionOperator,
    conditionParam,
    selectedEmployee,
    numberFieldOne,
    numberFieldTwo,
  ]);
  const handleClick = () => {
    if (isSettingAllLevelData) {
      // Call with extraParam if provided
      handleSaveApprover(levelId);
    } else {
      // Call with default parameters
      handleSaveApprover(ruleId, levelId);
    }
  };
  return (
    <Button
      onClick={handleClick}
      variant="contained"
      color="primary"
      disabled={isDisabled}
    >
      Save
    </Button>
  );
};

export default SaveApproverButton;
