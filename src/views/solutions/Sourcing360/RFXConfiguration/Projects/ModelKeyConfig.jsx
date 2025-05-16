import React from "react";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Typography,
  Alert,
  Tooltip,
} from "@mui/material";
import {
  Save as SaveIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Edit as EditIcon,
  Key as KeyIcon,
  Info as InfoIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from "@mui/icons-material";
import ESCustomTextField from "ui-component/ESCustomTextField";
import { useDispatch, useSelector } from "react-redux";
import {
  updateModelKey,
  togglePasswordVisibility,
  saveConfiguration,
  startEditing,
  setInitialModels,
  setSelectedCompany,
  setSelectedModel,
} from "store/modules/SolutionSettings/Sourcing360/RFXConfiguration/RFP/Projects/slices/modelKeysSlice";

const AI_COMPANIES = {
  OpenAI: {
    id: "openai",
    logo: "https://img.icons8.com/ios-glyphs/100/chatgpt.png",
    models: [
      { id: "gpt-35", name: "GPT-3.5 Turbo" },
      { id: "gpt-4o", name: "GPT-4o" },
      { id: "gpt-4-mini", name: "GPT-4o Mini" },
    ],
  },
  Anthropic: {
    id: "anthropic",
    logo: "https://img.icons8.com/fluency/100/claude.png",
    models: [
      { id: "claude-sonnet", name: "Claude 3.5 Sonnet" },
      { id: "claude-opus", name: "Claude 3.5 Opus" },
      { id: "claude-haiku", name: "Claude 3.5 Haiku" },
    ],
  },
  Cohere: {
    id: "cohere",
    logo: "https://svgmix.com/uploads/ac0eaa-cohere.svg",
    models: [
      { id: "command-r-plus", name: "Command R Plus" },
      { id: "command-r", name: "Command R" },
    ],
  },
  Groq: {
    id: "groq",
    logo: "https://logowik.com/content/uploads/images/t_groq-ai8121.logowik.com.webp",
    models: [
      { id: "llama-70b", name: "LLaMA 3.1 70B" },
      { id: "llama-8b", name: "LLaMA 3.1 8B" },
      { id: "mixtral", name: "Mixtral 8x7B 32768" },
    ],
  },
  Gemini: {
    id: "gemini",
    logo: "https://pngimagesfree.com/wp-content/uploads/Gemini-Ai-Logo-SVG-Vector--1007x1024.png",
    models: [
      { id: "gemini-15-pro", name: "Gemini 1.5 Pro" },
      { id: "gemini-10-pro", name: "Gemini 1.0 Pro" },
    ],
  },
};

const CompanyOverview = ({ company, selectedModel, onModelSelect }) => (
  <Box
    sx={{
      p: 4,
      bgcolor: "grey.50",
      borderRadius: 2,
      mb: 3,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 4,
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        flex: 1,
      }}
    >
      <Box
        component="img"
        src={company.logo}
        alt={`${company.id} logo`}
        sx={{
          width: 80,
          height: 80,
          objectFit: "contain",
          p: 1,
          borderRadius: 2,
          bgcolor: "white",
        }}
      />
      <Box>
        <Typography variant="h5" sx={{ mb: 1, color: "common.black" }}>
          {Object.keys(AI_COMPANIES).find(
            (key) => AI_COMPANIES[key].id === company.id
          )}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Configure API keys for advanced language models
        </Typography>
      </Box>
    </Box>

    <Box sx={{ minWidth: 200 }}>
      <FormControl fullWidth size="small">
        <Select
          value={selectedModel || company.models[0].id}
          onChange={onModelSelect}
          IconComponent={KeyboardArrowDownIcon}
          sx={{
            bgcolor: "white",
            "& .MuiSelect-select": {
              display: "flex",
              alignItems: "center",
              gap: 1,
            },
          }}
        >
          {company.models.map((model) => (
            <MenuItem key={model.id} value={model.id}>
              {model.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  </Box>
);

const ModelCard = ({
  model,
  companyLogo,
  modelKey,
  showPassword,
  onKeyChange,
  onToggleVisibility,
  onSave,
  onEdit,
}) => (
  <Box
    sx={{
      p: 3,
      borderRadius: 2,
      bgcolor: "grey.50",
      transition: "all 0.3s ease",
      "&:hover": {
        bgcolor: "grey.100",
      },
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        mb: 2,
      }}
    >
      <Box
        component="img"
        src={companyLogo}
        alt={`Model logo`}
        sx={{
          width: 40,
          height: 40,
          objectFit: "contain",
          p: 0.5,
          borderRadius: 1,
          bgcolor: "white",
        }}
      />
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" sx={{ color: "common.black", mb: 0.5 }}>
          {model.name}
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          AI Language Model
        </Typography>
      </Box>
      <Tooltip title="Learn more about this model" placement="top">
        <IconButton size="small" sx={{ color: "primary.main" }}>
          <InfoIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>

    <Box sx={{ position: "relative", mb: 2 }}>
      <ESCustomTextField
        placeholder={`Enter API Key for ${model.name}`}
        value={modelKey?.value || ""}
        onChange={(e) => onKeyChange(model.id, e)}
        type={showPassword ? "text" : "password"}
        readOnly={!modelKey?.isEditing}
        fullWidth
        sx={{
          "& .MuiOutlinedInput-root": {
            bgcolor: "white",
          },
        }}
      />
      <IconButton
        onClick={() => onToggleVisibility(model.id)}
        sx={{
          position: "absolute",
          right: "8px",
          top: "50%",
          transform: "translateY(-50%)",
          color: "text.secondary",
        }}
      >
        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
      </IconButton>
    </Box>

    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
      {modelKey?.isEditing ? (
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={() => onSave(model.id)}
          disabled={!modelKey?.value}
        >
          Save Key
        </Button>
      ) : (
        <Button
          onClick={() => onEdit(model.id)}
          startIcon={<EditIcon />}
          variant="contained"
          size="medium"
        >
          Edit Key
        </Button>
      )}
    </Box>
  </Box>
);

const EmptyState = () => (
  <Box
    sx={{
      p: 4,
      // bgcolor: "grey.50",
      borderRadius: 2,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      border: "2px solid #E0E0E0",
      borderStyle: "dashed",
    }}
  >
    <KeyIcon sx={{ fontSize: 60, color: "text.disabled", mb: 2 }} />
    <Typography variant="h6" sx={{ color: "text.primary", mb: 1 }}>
      No Company Selected
    </Typography>
    <Typography variant="body2" sx={{ color: "text.secondary" }}>
      Please select an AI company from the dropdown above to configure model API
      keys.
    </Typography>
  </Box>
);

function ModelKeyConfig() {
  const dispatch = useDispatch();
  const savedKeys = useSelector(
    (state) => state.rfxConfiguration.modelKeys.savedKeys
  );
  const isEditing = useSelector(
    (state) => state.rfxConfiguration.modelKeys.isEditing
  );
  const modelKeys = useSelector(
    (state) => state.rfxConfiguration.modelKeys.modelKeys
  );
  const showPasswords = useSelector(
    (state) => state.rfxConfiguration.modelKeys.showPasswords
  );
  const selectedCompany = useSelector(
    (state) => state.rfxConfiguration.modelKeys.selectedCompany
  );
  const selectedModel = useSelector(
    (state) => state.rfxConfiguration.modelKeys.selectedModel
  );

  const handleCompanySelect = (event) => {
    const companyId = event.target.value;
    dispatch(setSelectedCompany(companyId));

    const company = Object.values(AI_COMPANIES).find((c) => c.id === companyId);
    if (company) {
      dispatch(setInitialModels(company.models));
      dispatch(setSelectedModel(company.models[0].id));
    }
  };

  const handleModelSelect = (event) => {
    dispatch(setSelectedModel(event.target.value));
  };

  const handleKeyChange = (modelId, event) => {
    dispatch(updateModelKey({ modelId, value: event.target.value }));
  };

  const handleToggleVisibility = (modelId) => {
    dispatch(togglePasswordVisibility(modelId));
  };

  const handleSave = (modelId) => {
    dispatch(saveConfiguration(modelId));
  };

  const handleEdit = (modelId) => {
    dispatch(startEditing(modelId));
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
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <KeyIcon />
            <Typography
              variant="h4"
              sx={{ color: "common.black", fontWeight: "medium" }}
            >
              LLM Model Activation
            </Typography>
          </Box>

          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              mb: 3,
              textAlign: "justify",
            }}
          >
            Configure API keys for different AI models. These keys allow your
            application to interact with various AI services securely. All keys
            are encrypted before storage.
          </Typography>

          <Alert severity="info" sx={{ mb: 3 }}>
            Your API keys are encrypted and stored securely. Never share your
            API keys or expose them in client-side code.
          </Alert>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <Select
              value={selectedCompany || ""}
              onChange={handleCompanySelect}
              displayEmpty
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: 300,
                  },
                },
              }}
              renderValue={(value) => {
                if (!value) return "Select AI Company";
                const company = Object.entries(AI_COMPANIES).find(
                  ([_, c]) => c.id === value
                );
                return company ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      component="img"
                      src={company[1].logo}
                      alt={`${company[0]} logo`}
                      sx={{ width: 24, height: 24, objectFit: "contain" }}
                    />
                    <Typography>{company[0]}</Typography>
                  </Box>
                ) : (
                  "Select AI Company"
                );
              }}
            >
              {Object.entries(AI_COMPANIES).map(([name, company]) => (
                <MenuItem key={company.id} value={company.id}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      component="img"
                      src={company.logo}
                      alt={`${name} logo`}
                      sx={{ width: 24, height: 24, objectFit: "contain" }}
                    />
                    <Typography>{name}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {isEditing && selectedCompany && (
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={!Object.values(modelKeys).some((key) => key)}
            >
              Save Keys
            </Button>
          )}

          {/* {!isEditing && selectedCompany && (
            <Button
              onClick={handleEdit}
              startIcon={<EditIcon />}
              variant="contained"
              size="medium"
            >
              Edit Configuration
            </Button>
          )} */}
        </Box>

        <Box>
          {!selectedCompany ? (
            <EmptyState />
          ) : (
            <>
              <CompanyOverview
                company={
                  AI_COMPANIES[
                    Object.keys(AI_COMPANIES).find(
                      (key) => AI_COMPANIES[key].id === selectedCompany
                    )
                  ]
                }
                selectedModel={selectedModel}
                onModelSelect={handleModelSelect}
              />

              {selectedModel && (
                <ModelCard
                  model={AI_COMPANIES[
                    Object.keys(AI_COMPANIES).find(
                      (key) => AI_COMPANIES[key].id === selectedCompany
                    )
                  ].models.find((m) => m.id === selectedModel)}
                  companyLogo={
                    AI_COMPANIES[
                      Object.keys(AI_COMPANIES).find(
                        (key) => AI_COMPANIES[key].id === selectedCompany
                      )
                    ].logo
                  }
                  modelKey={modelKeys[selectedModel]}
                  showPassword={showPasswords[selectedModel]}
                  onKeyChange={handleKeyChange}
                  onToggleVisibility={handleToggleVisibility}
                  onSave={handleSave}
                  onEdit={handleEdit}
                />
              )}
            </>
          )}
        </Box>
      </Box>
    </Paper>
  );
}

export default ModelKeyConfig;
