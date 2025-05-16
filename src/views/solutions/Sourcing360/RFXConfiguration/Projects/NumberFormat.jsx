import React, { useState } from "react";
import {
  Divider,
  Paper,
  Typography,
  FormControlLabel,
  Radio,
  RadioGroup,
  Box,
  IconButton,
  Button,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import { Save, Edit, Edit2, Hash } from "lucide-react";
import ESCustomTextField from "ui-component/ESCustomTextField";
import { useDispatch, useSelector } from "react-redux";
import {
  setNumberingType,
  setStartingNumber,
  saveSettings,
  startEditing,
} from "store/modules/SolutionSettings/Sourcing360/RFXConfiguration/RFP/Projects/slices/numberFormatSlice";
import {
  selectNumberingType,
  selectStartingNumber,
  selectIsEditing,
  selectSavedSettings,
} from "store/modules/SolutionSettings/Sourcing360/RFXConfiguration/RFP/Projects//selectors/numberFormatSelectors";

const EmptyNumberSchema = () => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      py: 6,
      px: 3,
      borderRadius: 1,
      bgcolor: "grey.50",
      border: "2px dashed",
      borderColor: "grey.200",
      minHeight: 200,
      width: "100%",
    }}
  >
    <Box
      sx={{
        bgcolor: "rgba(151, 71, 255, 0.1)",
        p: 2,
        borderRadius: "50%",
        mb: 2,
      }}
    >
      {/* <Numbers size={32} color="#9747ff" /> */}
    </Box>

    <Typography
      variant="h6"
      sx={{
        color: "text.primary",
        mb: 1,
        fontWeight: 500,
      }}
    >
      No Number Schema Set
    </Typography>

    <Typography
      variant="body2"
      sx={{
        color: "text.secondary",
        textAlign: "center",
        maxWidth: 300,
        mb: 1,
      }}
    >
      Choose between auto incremental or manual numbering for your RFP
      documents.
    </Typography>
  </Box>
);

const NumberFormat = () => {
  const dispatch = useDispatch();
  const numberingType = useSelector(selectNumberingType);
  const startingNumber = useSelector(selectStartingNumber);
  const isEditing = useSelector(selectIsEditing);
  const savedSettings = useSelector(selectSavedSettings);

  const handleSave = () => {
    dispatch(saveSettings());
  };

  const handleEdit = () => {
    dispatch(startEditing());
  };

  return (
    <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "300px 1fr",
          gap: 7,
        }}
      >
        {/* Left Section - Heading and Description */}
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Hash size={24} />
            <Typography
              variant="h4"
              sx={{ color: "common.black", fontWeight: "medium" }}
            >
              Number Schema
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              mb: 2,
              textAlign: "justify",
            }}
          >
            Configure how your RFP documents will be numbered. Choose between
            automatic incremental numbering with a custom starting point or
            manual numbering based on your needs.
          </Typography>
        </Box>

        {/* Right Section - Main Content */}
        <Box>
          {isEditing ? (
            <Box>
              <RadioGroup
                value={numberingType}
                onChange={(e) => dispatch(setNumberingType(e.target.value))}
                sx={{ mb: 3, display: "flex" }}
              >
                <FormControlLabel
                  value="auto"
                  control={
                    <Radio
                      sx={{
                        "&.Mui-checked": {
                          color: "primary.main",
                        },
                      }}
                    />
                  }
                  label="Auto Incremental Numbering"
                  sx={{ mb: 1 }}
                />
                <FormControlLabel
                  value="manual"
                  control={
                    <Radio
                      sx={{
                        "&.Mui-checked": {
                          color: "primary.main",
                        },
                      }}
                    />
                  }
                  label="Manual Numbering"
                />
              </RadioGroup>

              {numberingType === "auto" && (
                <Box sx={{ mb: 4 }}>
                  <ESCustomTextField
                    label="Enter Starting Number"
                    value={startingNumber}
                    onChange={(e) =>
                      dispatch(setStartingNumber(e.target.value))
                    }
                    type="number"
                    required
                    width="100%"
                    height="40px"
                  />
                </Box>
              )}

              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  startIcon={<Save size={18} />}
                  onClick={handleSave}
                  disabled={numberingType === "auto" && !startingNumber}
                >
                  Save Schema
                </Button>
              </Box>
            </Box>
          ) : savedSettings ? (
            <Box>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  startIcon={<Edit2 size={20} />}
                  onClick={handleEdit}
                >
                  Edit Schema
                </Button>
              </Box>
              {/* <Box sx={{ mt: 2 }}>
								<Typography variant="body1" sx={{ mb: 1 }}>
									<strong>Numbering Type:</strong>{" "}
									{savedSettings?.numberingType === "auto"
										? "Auto Incremental"
										: "Manual"}
								</Typography>
								{savedSettings?.numberingType === "auto" && (
									<Typography variant="body1">
										<strong>Starting Number:</strong>{" "}
										{savedSettings?.startingNumber}
									</Typography>
								)}
							</Box> */}
              <Card sx={{ maxWidth: 400, width: "100%" }}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary" sx={{fontWeight:'medium'}}>
                      Numbering Type
                    </Typography>
                    <Chip
                      label={
                        savedSettings?.numberingType === "auto"
                          ? "Auto Incremental"
                          : "Manual"
                      }
                      color="primary"
                      variant="outlined"
                      size="small"
					  sx={{p:1,pt:1.2}}
                    />
                  </Box>

                  {savedSettings?.numberingType === "auto" && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary" sx={{fontWeight:'medium'}}>
                          Starting Number
                        </Typography>
                        <Chip
                          label={savedSettings?.startingNumber}
                          color="secondary"
                          variant="outlined"
                          size="small"
						  sx={{p:1,pt:1.2}}
                        />
                      </Box>
                    </>
                  )}
                </CardContent>
              </Card>
            </Box>
          ) : (
            <EmptyNumberSchema />
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default NumberFormat;
