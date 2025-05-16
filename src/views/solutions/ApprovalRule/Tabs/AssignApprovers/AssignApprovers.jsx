import React, { useState } from "react";
import {
  Box,
  Typography,
  Tooltip,
  Button,
  Snackbar,
  AccordionDetails,
  AccordionSummary,
  Accordion,
  FormControlLabel,
  Radio,
  RadioGroup,
  Paper,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RuleIcon from "@mui/icons-material/Rule";
import MuiAlert from "@mui/material/Alert";
import InfoIcon from "@mui/icons-material/Info";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ESCustomDropdown from "ui-component/ESCustomDropdown";
import {
  ListAllApprovalRules,
  removeUniqueIdfromSeletedRules,
} from "../constants";
import {
  addApproverLevel,
  changeFlowType,
  setIsApproversDropdownOpen,
  setSelectedApproverRules,
  setShowMultipleApproversBox,
} from "store/reducer/ApprovalReducer";
import DisplayApprovers from "./DisplayApprovers";
import { useSelector, useDispatch } from "react-redux";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ApproversSetter from "./ApproversSetter";

const AssignApprovers = () => {
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
  const dispatch = useDispatch();
  const tables = useSelector((state) => state.approvalReducer.tables);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const allSelectedRules = useSelector(
    (state) => state.approvalReducer.selectedApproverRules
  );

  const handleApprovalRuleChange = (e) => {
    dispatch(setSelectedApproverRules({ e }));
  };
  const handleAccordianDropdown = (ruleId) => {
    dispatch(setIsApproversDropdownOpen({ ruleId }));
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };
  const handleFlowChange = (ruleId, label) => {
    dispatch(changeFlowType({ ruleId, label }));
  };

  const handleAddNewApprover = (ruleId) => {
    const newApproverLevel = {
      ruleId,
      levelData: {
        // selectedRole: {},
        selectedEmployee: {},
        conditionParam: {},
        conditionOperator: {},
        numberFieldOne: null,
        numberFieldTwo: null,
      },
    };
    dispatch(addApproverLevel(newApproverLevel));
    setSnackbarMessage("New Approver Added");
    setSnackbarOpen(true);
  };
  // const showMultipleRulesSelectBox = useSelector(
  //   (state) => state.approvalReducer.showMultipleApproverBox
  // );

  // const handleMultipleRulesSelectBox = () => {
  //   dispatch(setShowMultipleApproversBox());
  // };
  return (
    <Box>
      <Box sx={{ display: "flex" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
          }}
        >
          <Typography
            variant="h2"
            gutterBottom
            sx={{
              color: "#000",
              mt: 1.2,
            }}
          >
            Assign Approvers
          </Typography>
          <Tooltip
            title="This section allows you to create and manage rules."
            placement="top"
          >
            <InfoIcon sx={{ ml: 1, color: "#000", cursor: "pointer" }} />
          </Tooltip>
        </Box>
      </Box>

      <Typography variant="body2" sx={{ color: "#666", mb: 4 }}>
        Add Levels Of Approval Workflow Hierarchy For Created Approval Rules
      </Typography>
      {/* {showMultipleRulesSelectBox ? (
        <Box sx={{ display: "flex", justifyContent: "end" }}>
          <Button
            onClick={handleMultipleRulesSelectBox}
            sx={{ width: "18rem" }}
            variant="outlined"
          >
            Hide Multiple Rules Setter
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: "flex", justifyContent: "end" }}>
          <Button
            onClick={handleMultipleRulesSelectBox}
            sx={{ width: "18rem" }}
            variant="outlined"
          >
            Assign Approvers to Multiple Rules
          </Button>
        </Box>
      )} */}
      <ESCustomDropdown
        value={allSelectedRules}
        onChange={handleApprovalRuleChange}
        options={ListAllApprovalRules(tables)}
        width={"100%"}
        label="Select Approval Rules"
        isClearable
        isMulti
        placeholder="Select Single or Multiple Approval Rules"
      />

      {allSelectedRules.length > 0 ? <ApproversSetter /> : null}
      {tables.map((rule, index) => {
        return (
          <Box key={index}>
            <Paper sx={{ mt: 2 }} elevation={2}>
              <Accordion
                // sx={{
                //   backgroundColor: rule.isApproversExpanded
                //     ? "#F2E6FF"
                //     : "white",
                // }}
                expanded={rule.isApproversExpanded}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  onClick={() => handleAccordianDropdown(rule.id)}
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
                      <Typography
                        sx={{ color: "#000", fontWeight: "600", mb: 0 }}
                        variant="h4"
                      >
                        {`${rule.name} Approver Details `}
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{ color: "#000", fontWeight: "400" }}
                      >
                        Approval Type: <strong>{rule?.approvalType}</strong>
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{ color: "#000", fontWeight: "400", mb: 1 }}
                      >
                        Approval ID: <strong>{rule?.id}</strong>
                      </Typography>
                    </Box>
                  </Box>
                </AccordionSummary>
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
                        //justifyContent: "flex-end",
                        my: 1,
                      }}
                      value={rule.flowType}
                      onChange={(e) =>
                        handleFlowChange(
                          rule.id,

                          e.target.value
                        )
                      }
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
                          <InfoIcon
                            sx={{ mr: 2, width: "14px", color: "#666" }}
                          />
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
                          onClick={() => handleAddNewApprover(rule.id)}
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

                  <DisplayApprovers
                    approvers={rule.approvers}
                    ruleId={rule.id}
                    setSnackbarOpen={setSnackbarOpen}
                    setSnackbarMessage={setSnackbarMessage}
                  />
                </AccordionDetails>
              </Accordion>
            </Paper>
          </Box>
        );
      })}

      {tables.length <= 0 && (
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
            Choose a Approval Rule from dropdown to to assign its approvers or
            assign individually
          </Typography>
        </Box>
      )}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
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
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default AssignApprovers;
