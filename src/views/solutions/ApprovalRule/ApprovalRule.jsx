import React, { useState } from "react";
import MainCard from "ui-component/cards/MainCard";
import { Tabs, Tab, Box, Button, Snackbar } from "@mui/material";
import SetRuleValues from "./Tabs/SetRuleValues";
import AssignApprovers from "./Tabs/AssignApprovers/AssignApprovers";
import AdvancedOptions from "./Tabs/AdvancedOption";
import RuleIcon from "@mui/icons-material/Rule";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import SettingsIcon from "@mui/icons-material/Settings";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PublishIcon from "@mui/icons-material/Publish";
import MuiAlert from "@mui/material/Alert";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const ApprovalRule = () => {
  const [value, setValue] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };
  const handleBack = () => {
    setValue((prevValue) => prevValue - 1);
  };

  const handleNext = () => {
    setValue((prevValue) => prevValue + 1);
  };

  const handlePublish = () => {
    setSnackbarOpen(true);
    console.log("Publishing...");
  };

  return (
    <MainCard
      title="Set Approval Rule"
      caption="Configure approval rules and assign approvers to streamline your approval process."
    >
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="approval rule tabs"
        sx={{
          "& .MuiTab-root": {
            minHeight: 64,
            color: "text.secondary",
          },
          "& .Mui-selected": {
            color: "#000",
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "#000",
          },
        }}
      >
        <Tab
          icon={<RuleIcon />}
          iconPosition="start"
          label="Set Rule Values"
          sx={{ "&:hover": { color: "#000" } }}
        />
        <Tab
          icon={<AssignmentIndIcon />}
          iconPosition="start"
          label="Assign Approvers"
          sx={{ "&:hover": { color: "#000" } }}
        />
        <Tab
          icon={<SettingsIcon />}
          iconPosition="start"
          label="Advanced Options"
          sx={{ "&:hover": { color: "#000" } }}
        />
      </Tabs>

      <TabPanel value={value} index={0}>
        <SetRuleValues />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <AssignApprovers />
      </TabPanel>

      <TabPanel value={value} index={2}>
        <AdvancedOptions />
      </TabPanel>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        {value > 0 && (
          <Button
            variant="contained"
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
          >
            Back
          </Button>
        )}
        {value < 2 && (
          <Button
            variant="contained"
            onClick={handleNext}
            endIcon={<ArrowForwardIcon />}
            sx={{ ml: "auto" }}
          >
            Next
          </Button>
        )}
        {value === 2 && (
          <Button
            variant="contained"
            color="primary"
            onClick={handlePublish}
            endIcon={<PublishIcon />}
            sx={{ ml: "auto" }}
          >
            Publish
          </Button>
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
          Data saved successfully!
        </MuiAlert>
      </Snackbar>
    </MainCard>
  );
};

export default ApprovalRule;
