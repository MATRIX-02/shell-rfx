import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Chip,
  FormControlLabel,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  Tooltip,
  Typography,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import InfoIcon from "@mui/icons-material/Info";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useEffect, useRef, useState } from "react";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ApproversDropdown from "./ApproversDropdown";
import { useSelector, useDispatch } from "react-redux";
import {
  addToAllLevelsData,
  changeFlowTypeOfAllSelectedRules,
  setIsExpandedToAllLevelsData,
} from "store/reducer/ApprovalReducer";

const ApproversSetter = () => {
  const [expanded, setExpanded] = useState(false);
  const isAllLevelsDataDropdownExpanded = useSelector(
    (state) => state.approvalReducer.isAllLevelsDataDropdownExpanded
  );
  const dispatch = useDispatch();
  const allSelectedRules = useSelector(
    (state) => state.approvalReducer.selectedApproverRules
  );

  const handleAddNewApprover = () => {
    dispatch(
      addToAllLevelsData({
        selectedRole: {},
        selectedEmployee: {},
        conditionParam: {},
        conditionOperator: {},
        numberFieldOne: null,
        numberFieldTwo: null,
      })
    );
  };
  const flowTypeRef = useRef("Parallel");
  useEffect(() => {
    if (allSelectedRules.length > 0) {
      dispatch(
        changeFlowTypeOfAllSelectedRules({
          allRules: allSelectedRules,
          value: flowTypeRef.current,
        })
      );
    }
  }, [allSelectedRules.length, dispatch]);
  const handleFlowChangeForAllRules = (value) => {
    flowTypeRef.current = value;
    if (allSelectedRules.length > 0) {
      dispatch(
        changeFlowTypeOfAllSelectedRules({ allRules: allSelectedRules, value })
      );
    }
  };
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });
  const handleAccordionChange = (event, isExpanded) => {
    dispatch(setIsExpandedToAllLevelsData());
  };

  return (
    <Box key={"index"}>
      <Paper sx={{ mt: 1 }} elevation={2}>
        <Accordion
          expanded={isAllLevelsDataDropdownExpanded}
          onChange={handleAccordionChange}
          // sx={{
          //   backgroundColor: isAllLevelsDataDropdownExpanded
          //     ? "#F2E6FF"
          //     : "white",
          // }}
        >
          <AccordionSummary
            expandIcon={allSelectedRules.length > 0 ? <ExpandMoreIcon /> : null}
          >
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                {allSelectedRules.length > 0 ? (
                  <Typography
                    sx={{ color: "#000", fontWeight: "600", mt: 1 }}
                    variant="h4"
                  >
                    Set Selected Approver Details
                  </Typography>
                ) : (
                  <Typography
                    sx={{ color: "#000", fontWeight: "600", mt: 1 }}
                    variant="h4"
                  >
                    Select Approvers from above Dropdown to Modify
                  </Typography>
                )}
                <Box sx={{ display: "flex", gap: 1, my: 1 }}>
                  {allSelectedRules.map((rule) => {
                    return (
                      <Chip
                        sx={{
                          backgroundColor: "lightgray",
                          color: "#000",
                          width: "auto",
                        }}
                        label={rule.value}
                      />
                    );
                  })}
                </Box>
              </Box>
            </Box>
          </AccordionSummary>
          {allSelectedRules.length > 0 && (
            <AccordionDetails>
              <Box
                sx={{
                  px: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <RadioGroup
                  row
                  sx={{
                    display: "flex",
                  }}
                  value={flowTypeRef.current}
                  onChange={(e) => handleFlowChangeForAllRules(e.target.value)}
                >
                  <Box
                    sx={{
                      display: "flex",
                      gap: 0,
                    }}
                  >
                    <FormControlLabel
                      value="Parallel"
                      sx={{ marginRight: "10px" }}
                      control={
                        <Radio
                          sx={{
                            color: "#000",
                            "&.Mui-checked": {
                              color: "#000",
                            },
                          }}
                        />
                      }
                      label="Parallel"
                      // disabled={editingRule !== rule.id}
                    />
                    <Tooltip
                      title="Assign Approvers Parallelly"
                      placement="top"
                    >
                      <InfoIcon sx={{ mr: 2, width: "14px", color: "#666" }} />
                    </Tooltip>
                  </Box>

                  <Box sx={{ display: "flex", gap: 0 }}>
                    <FormControlLabel
                      value="Sequential"
                      sx={{ marginRight: "10px" }}
                      control={
                        <Radio
                          sx={{
                            color: "#000",
                            "&.Mui-checked": {
                              color: "#000",
                            },
                          }}
                        />
                      }
                      label="Sequential"
                      // disabled={editingRule !== rule.id}
                    />
                    <Tooltip
                      title="Assign Approvers Sequentially"
                      placement="top"
                    >
                      <InfoIcon sx={{ width: "14px", color: "#666" }} />
                    </Tooltip>
                  </Box>
                </RadioGroup>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Tooltip title="Add New Approver" placement="top">
                    <IconButton
                      onClick={handleAddNewApprover}
                      // disabled={"allOptionsSelected"}
                    >
                      <AddIcon
                        sx={{
                          fontSize: 32,
                          color: "#9747ff",
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                  <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload files
                    <VisuallyHiddenInput
                      type="file"
                      onChange={(event) => console.log(event.target.files)}
                      multiple
                    />
                  </Button>
                </Box>
              </Box>
              <ApproversDropdown />
            </AccordionDetails>
          )}
        </Accordion>
      </Paper>
    </Box>
  );
};

export default ApproversSetter;
