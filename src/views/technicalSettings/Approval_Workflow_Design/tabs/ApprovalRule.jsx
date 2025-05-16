import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Typography,
  Paper,
  Grid,
  IconButton,
  Tooltip,
  Button,
  Snackbar,
  TextField,
  Alert,
  Chip,
  Menu,
  MenuItem,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Select from "react-select";
import ESCustomDropdown from "ui-component/ESCustomDropdown";
import {
  addTable,
  updateTable,
  deleteTable,
} from "store/reducer/ApprovalReducer";

import AddIcon from "@mui/icons-material/Add";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import RuleIcon from "@mui/icons-material/Rule";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import EqualIcon from "@mui/icons-material/DragHandle";
import GreaterThanIcon from "@mui/icons-material/KeyboardArrowRight";
import LessThanIcon from "@mui/icons-material/KeyboardArrowLeft";
import GreaterEqualIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import LessEqualIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import NotEqualIcon from "@mui/icons-material/Clear";
import StartsWithIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import EndsWithIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import { IconArrowsMoveHorizontal } from "@tabler/icons-react";
import { Logger } from "sass";

const ApprovalRule = () => {
  const dispatch = useDispatch();
  const columns = useSelector((state) => state.approvalReducer.columns);
  const activeColumns = columns.filter((column) => column.isActive);
  const rules = useSelector((state) => state.approvalReducer.tables);

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuRuleIndex, setMenuRuleIndex] = useState(null);
  const [newRuleName, setNewRuleName] = useState("");
  const [currentlyEditingIndex, setCurrentlyEditingIndex] = useState(null);
  const [isAddingNewRule, setIsAddingNewRule] = useState(false);
  const [snackbarInfo, setSnackbarInfo] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const approvalTypes = [
    "Purchase Request",
    "Post PO collaboration",
    "Supplier Invite",
    "PO Change",
    "Create Intake Request",
  ];

  function generate4DigitID() {
    const dateObj = Date.now(); // Get the current timestamp
    const uniqueID = dateObj % 10000; // Get the last 4 digits
    return uniqueID.toString().padStart(4, "0"); // Ensure it's 4 digits
  }

  const handleAddNewRuleClick = () => {
    setIsAddingNewRule(true);
    setNewRuleName("");
    const newRule = {
      id: `#${generate4DigitID()}`, // Use timestamp for unique ID
      name: "",
      approvalType: "",
      fields: [],
      approvers: [],
      flowType: "",
      isSaved: false,
      isExpanded: true,
      isApproversExpanded: false,
      isActive: false,
      isEditable: true, // Set to true for new rules
    };
    dispatch(addTable(newRule));
    // setCurrentlyEditingIndex(0);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === "available-fields" &&
      destination.droppableId.startsWith("#")
    ) {
      const sourceField = columns.find(
        (column) => `${column.name}` === result.draggableId
      );
      const ruleIndex = rules.findIndex(
        (rule) => rule.id === destination.droppableId
      );

      if (sourceField && rules[ruleIndex].isEditable) {
        const updatedRules = [...rules];
        const updatedRule = { ...updatedRules[ruleIndex] };

        if (
          !updatedRule.fields.some((field) => field.name === sourceField.name)
        ) {
          updatedRule.fields = [
            ...updatedRule.fields.slice(0, destination.index), // Get fields before the destination index
            {
              ...sourceField,
              type: sourceField.type || "text",
              operator: "equal",
            },
            ...updatedRule.fields.slice(destination.index), // Get fields after the destination index
          ];

          updatedRules[ruleIndex] = updatedRule;
          dispatch(updateTable(updatedRule));
        }
      }
    } else if (
      source.droppableId.startsWith("#") &&
      destination.droppableId.startsWith("#") &&
      source.droppableId === destination.droppableId
    ) {
      const sourceRuleIndex = rules.findIndex(
        (rule) => rule.id === source.droppableId
      );
      const destRuleIndex = rules.findIndex(
        (rule) => rule.id === destination.droppableId
      );

      const updatedRules = [...rules];
      const [removedField] = updatedRules[sourceRuleIndex].fields.splice(
        source.index,
        1
      );
      updatedRules[destRuleIndex].fields.splice(
        destination.index,
        0,
        removedField
      );
      dispatch(updateTable(updatedRules[sourceRuleIndex]));
      dispatch(updateTable(updatedRules[destRuleIndex]));
    }
  };

  const operators = {
    text: [
      { value: "equal", label: "Equal", icon: <EqualIcon /> },
      { value: "not_equal", label: "Not Equal to", icon: <NotEqualIcon /> },
      { value: "contains", label: "Contains", icon: <CompareArrowsIcon /> },
    ],
    number: [
      { value: "equal", label: "Equal", icon: <EqualIcon /> },
      { value: "not_equal", label: "Not Equal to", icon: <NotEqualIcon /> },
      { value: "gt", label: "Greater than", icon: <GreaterThanIcon /> },
      { value: "lt", label: "Less than", icon: <LessThanIcon /> },
      {
        value: "gte",
        label: "Greater than or equal to",
        icon: <GreaterEqualIcon />,
      },
      { value: "lte", label: "Less than or equal to", icon: <LessEqualIcon /> },
      {
        value: "range",
        label: "Between (Range)",
        icon: <IconArrowsMoveHorizontal />,
      },
    ],
    email: [
      { value: "equal", label: "Equal", icon: <EqualIcon /> },
      { value: "not_equal", label: "Not Equal to", icon: <NotEqualIcon /> },
    ],
    // dropdown: [
    //   { value: "equal", label: "Equal", icon: <EqualIcon /> },
    //   { value: "not_equal", label: "Not Equal", icon: <NotEqualIcon /> },
    //   { value: "gt", label: "Greater than", icon: <GreaterThanIcon /> },
    //   { value: "lt", label: "Less than", icon: <LessThanIcon /> },
    //   {
    //     value: "gte",
    //     label: "Greater than or equal to",
    //     icon: <GreaterEqualIcon />,
    //   },
    //   { value: "lte", label: "Less than or equal to", icon: <LessEqualIcon /> },
    //   { value: "between", label: "Between", icon: <CompareArrowsIcon /> }, // Added this line
    // ],
    // custom: [
    //   { value: "contains", label: "Contains", icon: <CompareArrowsIcon /> },
    //   { value: "equal", label: "Equal", icon: <EqualIcon /> },
    //   { value: "not_equal", label: "Not Equal", icon: <NotEqualIcon /> },
    //   { value: "starts_with", label: "Starts With", icon: <StartsWithIcon /> },
    //   { value: "ends_with", label: "Ends With", icon: <EndsWithIcon /> },
    //   { value: "gt", label: "Greater than", icon: <GreaterThanIcon /> },
    //   { value: "lt", label: "Less than", icon: <LessThanIcon /> },
    //   {
    //     value: "gte",
    //     label: "Greater than or equal to",
    //     icon: <GreaterEqualIcon />,
    //   },
    //   { value: "lte", label: "Less than or equal to", icon: <LessEqualIcon /> },
    // ],
    default: [
      { value: "equal", label: "Equal", icon: <EqualIcon /> },
      { value: "not_equal", label: "Not Equal", icon: <NotEqualIcon /> },
    ],
  };

  const currencies = [
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen" },
    { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
    { code: "INR", symbol: "₹", name: "Indian Rupee" },
    // Add more currencies as needed
  ];

  const handleMenuOpen = (event, index) => {
    setAnchorEl(event.currentTarget);
    setMenuRuleIndex(index);
  };

  const handleEditClick = () => {
    const updatedRule = { ...rules[menuRuleIndex], isEditable: true };
    dispatch(updateTable(updatedRule));
    setCurrentlyEditingIndex(menuRuleIndex);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    if (menuRuleIndex !== null && rules[menuRuleIndex]) {
      dispatch(deleteTable(rules[menuRuleIndex].id));
    }
    handleMenuClose();
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuRuleIndex(null);
  };

  const toggleRuleStatus = (index) => {
    const updatedRule = { ...rules[index], isActive: !rules[index].isActive };
    dispatch(updateTable(updatedRule));
    handleMenuClose();
  };

  const removeFieldFromRule = (ruleIndex, fieldIndex) => {
    const updatedRule = JSON.parse(JSON.stringify(rules[ruleIndex]));
    updatedRule.fields.splice(fieldIndex, 1);
    dispatch(updateTable(updatedRule));
  };

  const validateRule = (rule) => {
    if (!rule.name.trim()) {
      return "Please enter a rule name";
    }
    if (!rule.approvalType) {
      return "Please select an approval type";
    }
    if (rule.fields.length === 0) {
      return "Please add at least one field to the rule";
    }
    for (let field of rule.fields) {
      if (!field.type) {
        return `Field ${field.name} is missing a type`;
      }
      if (!field.operator) {
        return `Field ${field.name} is missing an operator`;
      }
    }
    return null;
  };

  const saveRule = (index) => {
    const currentRule = rules[index];
    const validationError = validateRule(currentRule);

    if (validationError) {
      setSnackbarInfo({
        open: true,
        message: validationError,
        severity: "warning",
      });
      return;
    }

    if (
      rules.some(
        (rule, i) =>
          i !== index &&
          rule.name.toLowerCase() === currentRule.name.trim().toLowerCase()
      )
    ) {
      setSnackbarInfo({
        open: true,
        message: "A rule with this name already exists",
        severity: "error",
      });
      return;
    }

    const updatedRule = {
      ...currentRule,
      name: currentRule.name.trim(),
      approvalType: currentRule.approvalType,
      isEditable: false,
      isSaved: true,
    };

    dispatch(updateTable(updatedRule));

    setCurrentlyEditingIndex(null);
    setIsAddingNewRule(false);
    setSnackbarInfo({
      open: true,
      message: "Rule saved successfully",
      severity: "success",
    });
  };

  const handleSnackbarClose = () => {
    setSnackbarInfo({ ...snackbarInfo, open: false });
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        // height: "100vh",
        // minHeight:"70vh",
        height: "fit-content",
        mb: 2,
        p: 2,
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        <Grid
          container
          spacing={2}
          sx={{
            flexGrow: 1,
            overflow: "hidden",
            minHeight: "50vh",
            height: "fit-content",
          }}
        >
          <Grid
            item
            xs={12}
            md={3}
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="h2"
              gutterBottom
              sx={{
                color: "#9747FF",
                fontWeight: 600,

                pb: 0,
                mt: 0.7,
              }}
            >
              Available Fields
            </Typography>
            {activeColumns.length <= 0 && (
              <Typography>No Available Fields</Typography>
            )}
            <Box sx={{ flexGrow: 1, overflowY: "auto", pr: 2 }}>
              <Droppable droppableId="available-fields" type="FIELD">
                {(provided) => (
                  <Box {...provided.droppableProps} ref={provided.innerRef}>
                    {activeColumns.map((column, index) => (
                      <Draggable
                        key={column.name}
                        draggableId={column.name}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              mb: 0.3,
                              display: "flex",
                              alignItems: "center",
                              cursor: "pointer",
                              p: 1.5,
                              borderRadius: "10px",
                              backgroundColor: "white",
                              transition: "all 0.3s",
                              "&:hover": {
                                backgroundColor: "rgba(151, 71, 255, 0.1)",
                                transform: "translateY(-2px)",
                              },
                            }}
                          >
                            <DragIndicatorIcon sx={{ mr: 2, color: "#000" }} />
                            <Typography
                              sx={{
                                flex: 1,
                                fontFamily: "'Roboto', sans-serif",
                                fontSize: "1rem",
                                color: "#333",
                              }}
                            >
                              {column.label}
                            </Typography>
                          </Box>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            md={9}
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              borderLeft: "1px solid #e0e0e0",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 0,
                pb: 0,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
                <Typography
                  variant="h2"
                  sx={{
                    color: "#9747FF",
                    fontWeight: 600,
                    pb: 0,
                    m: 0,
                  }}
                >
                  Create Rule
                </Typography>
                <Tooltip
                  title="This section allows you to create and manage rules."
                  placement="top"
                >
                  <InfoIcon
                    sx={{ ml: 1, color: "#9747FF", cursor: "pointer" }}
                  />
                </Tooltip>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Tooltip title="Add New Rule" placement="top">
                  <IconButton
                    onClick={handleAddNewRuleClick}
                    sx={{
                      color: "#9747ff",
                      bgcolor: "rgba(151, 71, 255, 0.1)",
                      "&:hover": { bgcolor: "rgba(151, 71, 255, 0.2)" },
                    }}
                  >
                    <AddIcon sx={{ fontSize: "1.5rem" }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ color: "#666", mb: 3, ml: 0.5 }}>
              Add Rule By Dragging and Dropping Fields From EaseWork Input
              Fields Section
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {rules.length === 0 ? (
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
                    <RuleIcon
                      sx={{
                        fontSize: 80,
                        color: "000",
                        // stroke: "#808080",
                        mb: 2,
                      }}
                    />
                    <RuleIcon
                      sx={{
                        fontSize: 80,
                        color: "#9747ff",
                        // stroke: "#808080",
                        mb: 2,
                        position: "absolute",
                        bottom: "3px",
                        right: "3px",
                      }}
                    />
                  </Box>
                  <Typography variant="h6" sx={{ mb: 2, color: "#333" }}>
                    No rules created yet
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ mb: 2, color: "#666", textAlign: "center" }}
                  >
                    Click the "+" icon above to create your first rule and start
                    organizing your data.
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleAddNewRuleClick}
                    // sx={{
                    // 	color: "#9747FF",
                    // 	borderColor: "#9747FF",
                    // 	"&:hover": {
                    // 		borderColor: "#8a3ee0",
                    // 		backgroundColor: "rgba(154, 62, 224, 0.1)",
                    // 	},
                    // }}
                  >
                    Create New Rule
                  </Button>
                </Box>
              ) : (
                rules.map((rule, index) => (
                  <Paper
                    key={rule.id}
                    elevation={0}
                    sx={{
                      p: 1,
                      borderRadius: "10px",
                      backgroundColor: "white",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      transition: "box-shadow 0.3s",
                      "&:hover": { boxShadow: "0 6px 8px rgba(0, 0, 0, 0.15)" },
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        pb: 1,
                        pl: 1,
                        pt: 0.5,
                      }}
                    >
                      {rule.isEditable ? (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 2,
                            gap: 2,
                            ml: 0.5,
                          }}
                        >
                          <TextField
                            value={rule.name}
                            onChange={(e) => {
                              const updatedRule = {
                                ...rule,
                                name: e.target.value,
                              };
                              dispatch(updateTable(updatedRule));
                            }}
                            placeholder="Enter Rule name"
                            size="small"
                            sx={{
                              flex: 1,
                              "& .MuiOutlinedInput-root": {
                                height: "2.35rem",
                                "& fieldset": {
                                  // border: "none",
                                  borderRadius: "5px",
                                },
                              },
                            }}
                          />
                          <ESCustomDropdown
                            value={
                              rule.approvalType
                                ? {
                                    value: rule.approvalType,
                                    label: rule.approvalType,
                                  }
                                : null
                            }
                            onChange={(selectedOption) => {
                              const updatedRule = {
                                ...rule,
                                approvalType: selectedOption
                                  ? selectedOption.value
                                  : "",
                              };
                              dispatch(updateTable(updatedRule));
                            }}
                            options={approvalTypes.map((type) => ({
                              value: type,
                              label: type,
                            }))}
                            placeholder="Select Approval Type"
                            isClearable
                            styles={{
                              container: (provided) => ({
                                ...provided,
                                width: "250px",
                              }),
                              control: (provided, state) => ({
                                ...provided,
                                minHeight: "10px",
                                borderColor: state.isFocused
                                  ? "#5e17eb"
                                  : provided.borderColor,
                                boxShadow: state.isFocused
                                  ? "0 0 0 1px #5e17eb"
                                  : provided.boxShadow,
                                "&:hover": {
                                  borderColor: "#5e17eb",
                                },
                              }),
                              option: (provided, state) => ({
                                ...provided,
                                backgroundColor:
                                  state.isFocused || state.isSelected
                                    ? "#E8DEF8"
                                    : provided.backgroundColor,
                                color:
                                  state.isFocused || state.isSelected
                                    ? "#000"
                                    : provided.color,
                                "&:active": {
                                  backgroundColor: "#9747FF",
                                  color: "#fff",
                                },
                              }),
                              singleValue: (provided, state) => ({
                                ...provided,
                                color: state.isFocused
                                  ? "#E8DEF8"
                                  : provided.color,
                              }),
                            }}
                          />
                        </Box>
                      ) : (
                        <Box>
                          <Typography
                            variant="h4"
                            sx={{ color: "#000", flexGrow: 1 }}
                          >
                            {rule.name}
                          </Typography>
                          {rule.approvalType && (
                            <>
                              <Typography variant="h5" sx={{ color: "#000" }}>
                                Approval Type:{" "}
                                <strong>{rule.approvalType}</strong>
                              </Typography>
                              <Typography variant="h5" sx={{ color: "#000" }}>
                                Approval Rule ID: <strong>{rule.id}</strong>
                              </Typography>
                            </>
                          )}
                        </Box>
                      )}
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Chip
                          icon={
                            rule.isActive ? (
                              <CheckCircleIcon style={{ color: "#155724" }} />
                            ) : (
                              <CancelIcon style={{ color: "#721c24" }} />
                            )
                          }
                          label={rule.isActive ? "Active" : "Inactive"}
                          sx={{
                            mr: 1,
                            border: "2px solid #f9f9f9",
                            backgroundColor: rule.isActive
                              ? "#d4edda"
                              : "#f8d7da",
                            color: rule.isActive ? "#155724" : "#721c24",
                          }}
                        />
                        <IconButton onClick={(e) => handleMenuOpen(e, index)}>
                          <MoreVertIcon />
                        </IconButton>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            const updatedRule = {
                              ...rules[index],
                              isExpanded: !rules[index].isExpanded,
                            };
                            dispatch(updateTable(updatedRule));
                          }}
                        >
                          {rule.isExpanded ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </Box>
                      </Box>
                    </Box>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl) && menuRuleIndex === index}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={handleEditClick}>Edit</MenuItem>
                      <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
                      <MenuItem onClick={() => toggleRuleStatus(index)}>
                        {rule.isActive ? "Deactivate" : "Activate"}
                      </MenuItem>
                    </Menu>
                    {rule.isExpanded && (
                      <Droppable
                        droppableId={rule.id}
                        type="FIELD"
                        isDropDisabled={false}
                      >
                        {(provided, snapshot) => (
                          <Box
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            sx={{
                              backgroundColor: snapshot.isDraggingOver
                                ? "rgba(151, 71, 255, 0.1)"
                                : "transparent",
                              transition: "background-color 0.2s ease",
                              minHeight: "1.5rem", // Ensures the box is visible when empty
                              p: 2,
                              borderRadius: "10px",
                            }}
                          >
                            {rule.fields.map((field, fieldIndex) => (
                              <Draggable
                                key={`${rule.id}-${field.name}`}
                                draggableId={`${rule.id}-${field.name}`}
                                index={fieldIndex}
                                isDragDisabled={!rule.isEditable}
                              >
                                {(provided, snapshot) => (
                                  <Box
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        width: "100%",
                                        my: 1.5,
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        <DragIndicatorIcon
                                          sx={{ mr: 1, color: "#000" }}
                                        />
                                        <Typography>{field.label}</Typography>
                                      </Box>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        {/* {field.name === "Amount" && (
                                          <Select
                                            value={
                                              field.currency
                                                ? {
                                                    value: field.currency,
                                                    label: `${currencies.find((c) => c.code === field.currency).symbol} - ${currencies.find((c) => c.code === field.currency).name}`,
                                                  }
                                                : null
                                            }
                                            onChange={(selectedOption) => {
                                              const updatedRule = {
                                                ...rules[index],
                                              };
                                              updatedRule.fields[
                                                fieldIndex
                                              ].currency = selectedOption
                                                ? selectedOption.value
                                                : "";
                                              dispatch(
                                                updateTable(updatedRule)
                                              );
                                            }}
                                            options={currencies.map(
                                              (currency) => ({
                                                value: currency.code,
                                                label: `${currency.symbol} - ${currency.name}`,
                                              })
                                            )}
                                            placeholder="Select Currency"
                                            isClearable
                                            styles={{
                                              container: (provided) => ({
                                                ...provided,
                                                width: "160px",
                                              }),
                                              control: (provided, state) => ({
                                                ...provided,
                                                minHeight: "10px",
                                                borderColor: state.isFocused
                                                  ? "#5e17eb"
                                                  : provided.borderColor,
                                                boxShadow: state.isFocused
                                                  ? "0 0 0 1px #5e17eb"
                                                  : provided.boxShadow,
                                                "&:hover": {
                                                  borderColor: "#5e17eb",
                                                },
                                              }),
                                              option: (provided, state) => ({
                                                ...provided,
                                                backgroundColor:
                                                  state.isFocused ||
                                                  state.isSelected
                                                    ? "#E8DEF8"
                                                    : provided.backgroundColor,
                                                color:
                                                  state.isFocused ||
                                                  state.isSelected
                                                    ? "#000"
                                                    : provided.color,
                                                "&:active": {
                                                  backgroundColor: "#9747FF",
                                                  color: "#fff",
                                                },
                                              }),
                                              singleValue: (
                                                provided,
                                                state
                                              ) => ({
                                                ...provided,
                                                color: state.isFocused
                                                  ? "#E8DEF8"
                                                  : provided.color,
                                              }),
                                            }}
                                          />
                                        )} */}
                                        {!rule.isSaved ||
                                        currentlyEditingIndex === index ? (
                                          <Box
                                            sx={{
                                              display: "flex",
                                              alignItems: "center",
                                            }}
                                          >
                                            <ESCustomDropdown
                                              value={{
                                                value: field.operator,
                                                label:
                                                  (
                                                    operators[field.type] ||
                                                    operators.default
                                                  ).find(
                                                    (op) =>
                                                      op.value ===
                                                      field.operator
                                                  )?.label || "Select Operator",
                                              }}
                                              boxSx={{
                                                height: "100%",
                                              }}
                                              onChange={(selectedOption) => {
                                                const updatedRule = JSON.parse(
                                                  JSON.stringify(rules[index])
                                                );
                                                updatedRule.fields[
                                                  fieldIndex
                                                ].operator =
                                                  selectedOption.value;
                                                dispatch(
                                                  updateTable(updatedRule)
                                                );
                                              }}
                                              options={(
                                                operators[field.type] ||
                                                operators.default
                                              ).map((op) => ({
                                                value: op.value,
                                                label: (
                                                  <div
                                                    style={{
                                                      display: "flex",
                                                      alignItems: "center",
                                                    }}
                                                  >
                                                    <span
                                                      style={{
                                                        marginRight: "8px",
                                                      }}
                                                    >
                                                      {op.icon}
                                                    </span>
                                                    {op.label}
                                                  </div>
                                                ),
                                              }))}
                                            />
                                            <IconButton
                                              onClick={() =>
                                                removeFieldFromRule(
                                                  index,
                                                  fieldIndex
                                                )
                                              }
                                            >
                                              <CloseIcon />
                                            </IconButton>
                                          </Box>
                                        ) : (
                                          <Box
                                            sx={{
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              width: "fit-content",
                                            }}
                                          >
                                            <Typography
                                              variant="h5"
                                              sx={{
                                                color: "#000",
                                                mr: 1,
                                                fontWeight: "400",
                                              }}
                                            >
                                              Operator:
                                            </Typography>
                                            <Typography
                                              variant="h5"
                                              sx={{
                                                color: "#000",
                                                mr: 1,
                                                fontWeight: "400",
                                              }}
                                            >
                                              {/* chosen oprtaor dropdown option for that particular field has to come here, if no operator chosen/present for that particular field, then N/A */}
                                              {field.operator
                                                ? (
                                                    operators[field.type] ||
                                                    operators.default
                                                  ).find(
                                                    (op) =>
                                                      op.value ===
                                                      field.operator
                                                  )?.label
                                                : "N/A"}
                                            </Typography>
                                          </Box>
                                        )}
                                      </Box>
                                    </Box>
                                  </Box>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </Box>
                        )}
                      </Droppable>
                    )}
                    {(currentlyEditingIndex === index || !rule.isSaved) && (
                      <Box
                        sx={{
                          mt: 2,
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        {rule.isEditable && (
                          <Box
                            sx={{
                              mt: 2,
                              display: "flex",
                              justifyContent: "flex-end",
                            }}
                          >
                            <Button
                              // variant="outlined"
                              onClick={() => {
                                if (rule.isSaved) {
                                  const updatedRule = {
                                    ...rule,
                                    isEditable: false,
                                  };
                                  dispatch(updateTable(updatedRule));
                                } else {
                                  dispatch(deleteTable(rule.id));
                                }
                                setCurrentlyEditingIndex(null);
                                setIsAddingNewRule(false);
                              }}
                              // sx={{
                              // 	color: "#9747ff",
                              // 	borderColor: "#9747ff",
                              // 	"&:hover": {
                              // 		borderColor: "#8a3ee0",
                              // 		backgroundColor: "rgba(151, 71, 255, 0.1)",
                              // 	},
                              // }}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={() => saveRule(index)}
                              sx={{
                                // color: "#ffffff",
                                // backgroundColor: "#9747ff",
                                ml: 0.5,
                                // borderColor: "#9747ff",
                                // "&:hover": {
                                // 	backgroundColor: "#8a3ee0",
                                // 	borderColor: "#8a3ee0",
                                // },
                              }}
                            >
                              {rule.isSaved ? "Save" : "Add"}
                            </Button>
                          </Box>
                        )}
                      </Box>
                    )}
                  </Paper>
                ))
              )}
            </Box>
          </Grid>
        </Grid>
      </DragDropContext>
      <Snackbar
        open={snackbarInfo.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarInfo.severity}
          sx={{ width: "100%" }}
        >
          {snackbarInfo.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ApprovalRule;
