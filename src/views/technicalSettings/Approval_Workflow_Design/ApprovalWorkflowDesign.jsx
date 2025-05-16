import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Tabs, Tab, Box, Button, Snackbar, Typography } from "@mui/material";
import AddFields from "./tabs/AddFields";
import Review from "./tabs/Review";
import Lookup from "./tabs/Lookup";
import ApprovalRule from "./tabs/ApprovalRule";
import MainCard from "ui-component/cards/MainCard";

import {
  IconPlus,
  IconEye,
  IconSearch,
  IconCheck,
  IconCircleCheckFilled,
  IconArrowNarrowRight,
} from "@tabler/icons-react";

function TabPanel({ children, value, index }) {
  return (
    <Box hidden={value !== index} p={3}>
      {value === index && children}
    </Box>
  );
}

function ApprovalWorkflowDesign() {
  const tables = useSelector((state) => state.approvalReducer.tables);
  console.log("tables:", tables);
  const navigate = useNavigate();

  const columns = useSelector((state) => {
    return state.approvalReducer ? state.approvalReducer.columns : [];
  });

  const [value, setValue] = useState(0);
  const [completedTabs, setCompletedTabs] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isPublishable, setIsPublishable] = useState(false);

  useEffect(() => {
    const canPublish = tables.every(
      (item) =>
        item.approvalType !== "" && item.name !== "" && item.fields.length !== 0
    );
    setIsPublishable(canPublish);
  }, [tables]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleNext = () => {
    if (value < 3) {
      setCompletedTabs([...completedTabs, value]);
      setValue(value + 1);
    }
  };

  const handlePrevious = () => {
    if (value > 0) {
      setValue(value - 1);
    }
  };

  const handlePublish = () => {
    if (isPublishable) {
      console.log("Workflow published");
      setSnackbarOpen(true);
    } else {
      console.log("Fill all details first to publish!");
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleSetValues = () => {
    navigate("/solutions/approvalRule");
  };

  const isTabCompleted = (tabIndex) => {
    return tabIndex < value;
  };

  const tabLabels = ["Add Fields", "Review", "Lookup", "Approval Rule"];

  const iconMap = {
    "Add Fields": <IconPlus />,
    Review: <IconEye />,
    Lookup: <IconSearch />,
    "Approval Rule": <IconCheck />,
  };

  const isLastTab = value === 3;
  const isTableFilled = tables.length > 0;

  return (
    <MainCard
      title="Approval Workflow Design"
      caption="Streamline Your Processes with an Efficient Approval Workflow Design"
    >
      <Box sx={{ width: "100%" }}>
        <Box
          sx={{ borderBottom: 1, borderColor: "divider", position: "relative" }}
        >
          <Tabs value={value} onChange={handleChange} aria-label="form tabs">
            {tabLabels.map((label, index) => (
              <Tab
                key={index}
                icon={iconMap[label]}
                iconPosition="start"
                label={label}
                completed={isTabCompleted(index)}
              />
            ))}
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <AddFields />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Review columns={columns} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Lookup />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <ApprovalRule />
        </TabPanel>
        {/* <TabPanel value={value} index={4}>
					<Approvers />
				</TabPanel>
				<TabPanel value={value} index={5}>
					<AdvanceOption />
				</TabPanel> */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Button
            onClick={handlePrevious}
            disabled={value === 0}
            variant="contained"
          >
            Previous
          </Button>
          {isLastTab ? (
            isTableFilled && (
              <Button
                variant="contained"
                onClick={handlePublish}
                disabled={!isPublishable}
              >
                Publish
              </Button>
            )
          ) : (
            <Button variant="contained" onClick={handleNext}>
              Next
            </Button>
          )}
        </Box>
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Typography
              variant="h4"
              mb="0.5rem"
              sx={{ display: "flex", alignContent: "baseline" }}
            >
              <IconCircleCheckFilled size="20px" />
              Approval Rule Created!
            </Typography>
            <Typography variant="body1" sx={{ color: "#000" }}>
              Visit Set Values page to configure your approval rule
            </Typography>
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              onClick={handleSetValues}
              sx={{
                mt: 2,
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <>Set Values</>
              <IconArrowNarrowRight
                size="20px"
                style={{ marginBottom: ".1rem" }}
              />
            </Button>
          </Box>
        }
        sx={{
          "& .MuiSnackbarContent-root": {
            bgcolor: (theme) => theme.palette.background.paper,
            color: (theme) => theme.palette.common.white,
            borderRadius: "5px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(38, 105, 93, 0.1)",
          },
          mt: 10,
        }}
      />
    </MainCard>
  );
}

export default ApprovalWorkflowDesign;
