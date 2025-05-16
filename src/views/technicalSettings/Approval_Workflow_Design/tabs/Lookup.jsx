import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Typography, Paper } from "@mui/material";
import ESCustomDropdown from "ui-component/ESCustomDropdown";
import { selectEndpoint } from "store/reducer/ApprovalReducer";
import RuleIcon from "@mui/icons-material/Rule";
const Lookup = () => {
  const dispatch = useDispatch();
  const columns = useSelector((state) => state.approvalReducer.columns);
  const isActiveColumns = columns.filter((column) => column.isActive);
  const selectedEndpoints = useSelector(
    (state) => state.approvalReducer.selectedEndpoints
  );
  // Sample endpoints for the dropdown
  const endpoints = [
    { value: "Endpoint A", label: "Endpoint A" },
    { value: "Endpoint B", label: "Endpoint B" },
    { value: "Endpoint C", label: "Endpoint C" },
    { value: "Endpoint D", label: "Endpoint D" },
  ];

  const handleEndpointChange = (columnName, selectedOption) => {
    dispatch(
      selectEndpoint(columnName, selectedOption ? selectedOption.value : null)
    );
  };

  return (
    <Box sx={{ width: "100%", padding: 4 }}>
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h3" sx={{ marginBottom: 2, color: "#9747ff" }}>
          Lookup Fields
        </Typography>
        <Typography variant="body1" sx={{ color: "#666666" }}>
          Review and configure endpoints for your lookup fields.
        </Typography>
      </Box>
      <Paper elevation={isActiveColumns.length > 0 ? 3 : 0} sx={{ p: 2 }}>
        {isActiveColumns.length > 0 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              p: 2,
              borderBottom: "2px solid #9747ff",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ width: "30%", fontWeight: "bold", color: "#9747ff" }}
            >
              Field Label
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                width: "30%",
                fontWeight: "bold",
                color: "#9747ff",
                marginLeft: "110px",
              }}
            >
              Field Name
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                width: "40%",
                fontWeight: "bold",
                color: "#9747ff",
                marginLeft: "250px",
              }}
            >
              Endpoints
            </Typography>
          </Box>
        )}

        {isActiveColumns.map((column, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              p: 2,
              borderBottom:
                index < columns.length - 1 ? "1px solid #e0e0e0" : "none",
              "&:hover": {
                backgroundColor: "#f9f4ff",
                transition: "background-color 0.3s",
              },
            }}
          >
            <Typography variant="body1" sx={{ width: "30%", color: "#000000" }}>
              {column.label}
            </Typography>
            <Typography variant="body1" sx={{ width: "30%", color: "#000000" }}>
              {column.name}
            </Typography>
            <Box sx={{ width: "40%" }}>
              <ESCustomDropdown
                options={endpoints}
                value={endpoints.find(
                  (endpoint) =>
                    endpoint.value === selectedEndpoints[column.name]
                )}
                onChange={(selectedOption) =>
                  handleEndpointChange(column.name, selectedOption)
                }
                placeholder="Select an endpoint..."
                isClearable={true}
                width="350px"
                height="40px"
              />
            </Box>
          </Box>
        ))}
        {isActiveColumns.length <= 0 && (
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
              Set Fields Active in Add field tab to review and configure
              endpoints
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Lookup;
