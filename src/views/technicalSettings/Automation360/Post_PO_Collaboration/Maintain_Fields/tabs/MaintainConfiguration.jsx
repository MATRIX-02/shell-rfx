import React, { useState, useEffect } from "react";
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
import AddIcon from "@mui/icons-material/Add";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import KeyIcon from "@mui/icons-material/Key";
import InfoIcon from "@mui/icons-material/Info";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import TableChartIcon from "@mui/icons-material/TableChart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const MaintainConfiguration = ({ fields }) => {
  const [availableFields, setAvailableFields] = useState([
    {
      id: "company",
      name: "Company",
      type: "dropdown",
      required: true,
      options: ["Company A", "Company B", "Company C"],
    },
    {
      id: "category-id",
      name: "Category ID",
      type: "text",
      required: true,
      isKey: true,
    },
    {
      id: "country",
      name: "Country",
      type: "dropdown",
      required: true,
      options: ["USA", "UK", "Canada"],
    },
    {
      id: "document",
      name: "Document",
      type: "dropdown",
      required: true,
      options: ["Invoice", "PO", "Contract"],
    },
    {
      id: "custom-field-1",
      name: "Custom Field 1",
      type: "text",
      required: false,
    },
    {
      id: "custom-field-2",
      name: "Custom Field 2",
      type: "text",
      required: false,
    },
    {
      id: "po-confirmation-email",
      name: "PO Confirmation Email",
      type: "switch",
      required: true,
    },
    {
      id: "po-change-email",
      name: "PO Change Email",
      type: "switch",
      required: true,
    },
    {
      id: "confirmation-update-erp",
      name: "Confirmation Update in ERP",
      type: "switch",
      required: true,
    },
    {
      id: "po-update-erp",
      name: "PO Update ERP",
      type: "switch",
      required: true,
    },
  ]);

  const renderAvailableFieldsByType = (type) => {
    const sectionName =
      type === "text"
        ? "textFields"
        : type === "dropdown"
          ? "dropdowns"
          : "switches";

    return (
      <Box sx={{ mb: 2 }}>
        <Box
          onClick={() => toggleSection(sectionName)}
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            mb: 1,
          }}
        >
          <Typography variant="h5" sx={{ color: "#808080", flexGrow: 1 }}>
            {type === "text"
              ? "Text Fields"
              : type === "dropdown"
                ? "Dropdowns"
                : "Switches"}
          </Typography>
          {expandedSections[sectionName] ? (
            <ExpandLessIcon />
          ) : (
            <ExpandMoreIcon />
          )}
        </Box>
        {expandedSections[sectionName] &&
          availableFields
            .filter((field) => field.type === type)
            .map((field, index) => (
              <Box
                key={field.id}
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
                onClick={() => addFieldToScenario(field)}
              >
                <DragIndicatorIcon sx={{ mr: 2, color: "#9747ff" }} />
                <Typography
                  sx={{
                    flex: 1,
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "1rem",
                    color: "#333",
                  }}
                >
                  {field.name}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
                  {field.isKey && <KeyIcon sx={{ mr: 1, color: "#008000" }} />}
                </Box>
              </Box>
            ))}
      </Box>
    );
  };

  const [scenarios, setScenarios] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuScenarioIndex, setMenuScenarioIndex] = useState(null);
  const [newTableName, setNewTableName] = useState("");
  const [currentlyEditingIndex, setCurrentlyEditingIndex] = useState(null);
  const [isAddingNewTable, setIsAddingNewTable] = useState(false);
  const [snackbarInfo, setSnackbarInfo] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === "available-fields") {
      const sourceField = { ...availableFields[source.index] };
      const updatedScenarios = scenarios.map((scenario) => {
        if (scenario.id === destination.droppableId) {
          return {
            ...scenario,
            fields: [
              ...scenario.fields.slice(0, destination.index),
              sourceField,
              ...scenario.fields.slice(destination.index),
            ],
          };
        }
        return scenario;
      });
      setScenarios(updatedScenarios);
    } else {
      const sourceScenario = scenarios.find((s) => s.id === source.droppableId);
      const [removedField] = sourceScenario.fields.splice(source.index, 1);
      const destinationScenario = scenarios.find(
        (s) => s.id === destination.droppableId
      );
      destinationScenario.fields.splice(destination.index, 0, removedField);
      setScenarios([...scenarios]);
    }
  };
  const handleMenuOpen = (event, index) => {
    setAnchorEl(event.currentTarget);
    setMenuScenarioIndex(index);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuScenarioIndex(null);
  };

  const handleEditClick = () => {
    editScenario(menuScenarioIndex);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    deleteScenario(menuScenarioIndex);
    handleMenuClose();
  };
  const [expandedSections, setExpandedSections] = useState({
    textFields: true,
    dropdowns: true,
    switches: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };
  const handleAddNewTableClick = () => {
    setIsAddingNewTable(true);
    setNewTableName("");
    const newScenario = {
      id: `scenario-${scenarios.length + 1}`,
      name: "",
      fields: [],
      isSaved: false,
      isExpanded: true,
      isActive: false,
    };
    setScenarios([newScenario, ...scenarios]);
    setCurrentlyEditingIndex(0);
  };

  const addNewScenario = () => {
    if (newTableName.trim() === "") {
      setSnackbarInfo({
        open: true,
        message: "Please enter a table name",
        severity: "warning",
      });
      return;
    }

    if (
      scenarios.some(
        (scenario) =>
          scenario.name.toLowerCase() === newTableName.trim().toLowerCase()
      )
    ) {
      setSnackbarInfo({
        open: true,
        message: "A table with this name already exists",
        severity: "error",
      });
      return;
    }

    const newScenario = {
      id: `scenario-${scenarios.length + 1}`,
      name: newTableName.trim(),
      fields: [],
      isSaved: false,
      isExpanded: true,
      isActive: false,
    };
    setScenarios([newScenario, ...scenarios]);
    setCurrentlyEditingIndex(0);
    setNewTableName("");
    setSnackbarInfo({
      open: true,
      message: "New table added successfully",
      severity: "success",
    });
  };

  const toggleScenarioStatus = (index) => {
    setScenarios((prevScenarios) =>
      prevScenarios.map((scenario, i) =>
        i === index ? { ...scenario, isActive: !scenario.isActive } : scenario
      )
    );
    handleMenuClose();
  };

  const removeFieldFromScenario = (scenarioIndex, fieldIndex) => {
    setScenarios((prevScenarios) => {
      const newScenarios = [...prevScenarios];
      newScenarios[scenarioIndex].fields.splice(fieldIndex, 1);
      return newScenarios;
    });
  };

  const saveScenario = (index) => {
    if (newTableName.trim() === "") {
      setSnackbarInfo({
        open: true,
        message: "Please enter a table name",
        severity: "warning",
      });
      return;
    }

    if (
      scenarios.some(
        (scenario, i) =>
          i !== index &&
          scenario.name.toLowerCase() === newTableName.trim().toLowerCase()
      )
    ) {
      setSnackbarInfo({
        open: true,
        message: "A table with this name already exists",
        severity: "error",
      });
      return;
    }

    const updatedScenarios = [...scenarios];
    updatedScenarios[index].name = newTableName.trim();
    updatedScenarios[index].isEditable = false;
    updatedScenarios[index].isSaved = true;
    setScenarios(updatedScenarios);
    setCurrentlyEditingIndex(null);
    setIsAddingNewTable(false);
    setSnackbarInfo({
      open: true,
      message: "Table saved successfully",
      severity: "success",
    });
  };

  const addFieldToScenario = (field) => {
    if (currentlyEditingIndex === null) return;

    setScenarios((prevScenarios) =>
      prevScenarios.map((scenario, index) => {
        if (index === currentlyEditingIndex) {
          if (!scenario.fields.some((f) => f.id === field.id)) {
            return {
              ...scenario,
              fields: [...scenario.fields, field],
            };
          }
        }
        return scenario;
      })
    );
  };

  const editScenario = (index) => {
    setCurrentlyEditingIndex(index);
  };

  const deleteScenario = (index) => {
    const updatedScenarios = [...scenarios];
    updatedScenarios.splice(index, 1);
    setScenarios(updatedScenarios);
    setSnackbarInfo({
      open: true,
      message: "Table deleted successfully",
      severity: "error",
    });
  };

  const handleSnackbarClose = () => {
    setSnackbarInfo({ ...snackbarInfo, open: false });
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        height: "100vh",
        p: 3,
        //backgroundColor: "#f5f5f5",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",

        //border: ".1rem solid #c4c4c4",
        //backgroundImage: "linear-gradient(rgba(151, 71, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(151, 71, 255, 0.05) 1px, transparent 1px)",
        //backgroundSize: "20px 20px",
      }}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        <Grid
          container
          spacing={2}
          sx={{
            flexGrow: 1,
            overflow: "hidden",
            height: "calc(100vh - 100px)",
          }}
        >
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              borderRight: "1px solid #e0e0e0",
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                color: "#9747FF",
                fontWeight: 500,
                mb: 0,
                fontSize: "2rem",
                //borderBottom: "2px solid #9747FF",
                pb: 0,
              }}
            >
              Available Fields
            </Typography>
            <Box
              sx={{
                flexGrow: 1,
                overflowY: "auto",
                pr: 2,
                // borderRight: "1px solid #e0e0e0",
              }}
            >
              {renderAvailableFieldsByType("text")}
              {renderAvailableFieldsByType("dropdown")}
              {renderAvailableFieldsByType("switch")}
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            md={8}
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
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
                  variant="h4"
                  sx={{
                    color: "#9747FF",
                    fontWeight: 500,
                    fontSize: "2rem",
                  }}
                >
                  Create Table
                </Typography>

                <Tooltip
                  title="This section allows you to create and manage tables."
                  placement="top"
                >
                  <InfoIcon
                    sx={{ ml: 1, color: "#9747FF", cursor: "pointer" }}
                  />
                </Tooltip>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Tooltip title="Add New Table" placement="top">
                  <IconButton
                    onClick={handleAddNewTableClick}
                    sx={{
                      color: "#9747ff",
                      bgcolor: "rgba(151, 71, 255, 0.1)",
                      "&:hover": {
                        bgcolor: "rgba(151, 71, 255, 0.2)",
                      },
                    }}
                  >
                    <AddIcon sx={{ fontSize: "1.5rem" }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: "#666",
                mb: 2,
                ml: 0.5,
              }}
            >
              Add Table By Dragging and Dropping Column Fields From Available
              Fields Section
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {scenarios.length === 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    minHeight: "550px",
                    //backgroundColor: "rgba(151, 71, 255, 0.05)",
                    borderRadius: "10px",
                    //border: "2px dashed #9747FF",
                  }}
                >
                  <TableChartIcon
                    sx={{
                      fontSize: 80,
                      color: "transparent",
                      stroke: "#808080",
                      //strokeWidth: 1,
                      mb: 2,
                    }}
                  />
                  <Typography variant="h6" sx={{ mb: 2, color: "#333" }}>
                    No tables created yet
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ mb: 2, color: "#666", textAlign: "center" }}
                  >
                    Click the "+" icon above to create your first table and
                    start organizing your data.
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={addNewScenario}
                    sx={{
                      color: "#9747FF",
                      borderColor: "#9747FF",
                      "&:hover": {
                        borderColor: "#8a3ee0",
                        backgroundColor: "rgba(154, 62, 224, 0.1)",
                      },
                    }}
                  >
                    Create New Table
                  </Button>
                </Box>
              ) : (
                scenarios.map((scenario, index) => (
                  <Paper
                    key={scenario.id}
                    elevation={0}
                    sx={{
                      p: 1,
                      borderRadius: "10px",
                      backgroundColor: "white",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      transition: "box-shadow 0.3s",
                      "&:hover": {
                        boxShadow: "0 6px 8px rgba(0, 0, 0, 0.15)",
                      },
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        //borderBottom: "1px solid #ccc", // Added bottom border
                        pb: 1,
                      }}
                    >
                      {isAddingNewTable && index === 0 ? (
                        <TextField
                          value={newTableName}
                          onChange={(e) => setNewTableName(e.target.value)}
                          placeholder="Enter table name"
                          size="small"
                          fullWidth
                          sx={{
                            mr: 1,
                            width: "30%",
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor: "#9747ff",
                                borderRadius: "8px",
                              },
                              "&:hover fieldset": {
                                borderColor: "#9747ff",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#9747ff",
                              },
                            },
                          }}
                        />
                      ) : (
                        <Typography
                          variant="h5"
                          sx={{ color: "#9747ff", flexGrow: 1 }}
                        >
                          {scenario.name}
                        </Typography>
                      )}

                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Chip
                          icon={
                            scenario.isActive ? (
                              <CheckCircleIcon style={{ color: "#155724" }} />
                            ) : (
                              <CancelIcon style={{ color: "#721c24" }} />
                            )
                          }
                          label={scenario.isActive ? "Active" : "Inactive"}
                          sx={{
                            mr: 1,
                            border: "2px solid #f9f9f9",
                            backgroundColor: scenario.isActive
                              ? "#d4edda"
                              : "#f8d7da",
                            color: scenario.isActive ? "#155724" : "#721c24",
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
                            const updatedScenarios = [...scenarios];
                            updatedScenarios[index].isExpanded =
                              !updatedScenarios[index].isExpanded;
                            setScenarios(updatedScenarios);
                          }}
                        >
                          {scenario.isExpanded ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </Box>
                      </Box>
                    </Box>

                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl) && menuScenarioIndex === index}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={handleEditClick}>Edit</MenuItem>
                      <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
                      <MenuItem onClick={() => toggleScenarioStatus(index)}>
                        {scenario.isActive ? "Deactivate" : "Activate"}
                      </MenuItem>
                    </Menu>
                    {scenario.isExpanded && (
                      <Droppable droppableId={scenario.id}>
                        {(provided) => (
                          <Box
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            {scenario.fields.map((field, fieldIndex) => (
                              <Draggable
                                key={field.id}
                                draggableId={`${scenario.id}-${field.id}`}
                                index={fieldIndex}
                              >
                                {(provided, snapshot) => (
                                  <Box
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    sx={{
                                      mb: 0,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between", // Added this line
                                      p: 0.5,
                                      borderRadius: "5px",
                                      borderBottom: "1px solid #e0e0e0", // Added light divider
                                      transition: "background-color 0.3s",
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <DragIndicatorIcon
                                        sx={{ mr: 1, color: "#9747ff" }}
                                      />
                                      <Typography>{field.name}</Typography>
                                    </Box>
                                    <IconButton
                                      onClick={() =>
                                        removeFieldFromScenario(
                                          index,
                                          fieldIndex
                                        )
                                      }
                                      sx={{ ml: 1 }}
                                    >
                                      <CloseIcon />
                                    </IconButton>
                                  </Box>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </Box>
                        )}
                      </Droppable>
                    )}
                    {(currentlyEditingIndex === index ||
                      (index === 0 && !scenario.isSaved)) && (
                      <Box
                        sx={{
                          mt: 2,
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        {currentlyEditingIndex === index && (
                          <Box
                            sx={{
                              mt: 2,
                              display: "flex",
                              justifyContent: "flex-end",
                            }}
                          >
                            <Button
                              variant="outlined"
                              onClick={handleDeleteClick}
                              sx={{
                                color: "#9747ff",
                                borderColor: "#9747ff",
                                "&:hover": {
                                  borderColor: "#8a3ee0",
                                  backgroundColor: "rgba(151, 71, 255, 0.1)",
                                },
                              }}
                            >
                              Cancle
                            </Button>
                            <Button
                              variant="contained"
                              onClick={() => saveScenario(index)}
                              sx={{
                                color: "#ffffff",
                                backgroundColor: "#9747ff",
                                ml: 0.5,
                                borderColor: "#9747ff",
                                "&:hover": {
                                  backgroundColor: "#8a3ee0",
                                  borderColor: "#8a3ee0",
                                },
                              }}
                            >
                              Add
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

export default MaintainConfiguration;
