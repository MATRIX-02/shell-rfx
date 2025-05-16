// src/components/rfx-configuration/goods/GoodsConfig.jsx
import React from 'react';
import { Box, Paper, Typography, Divider } from '@mui/material';

const ConfigSection = ({ title, children }) => (
  <Paper sx={{ p: 3, mb: 3 }}>
    <Typography variant="h4" sx={{ color: 'common.black', fontWeight: 'medium' }}>
      {title}
    </Typography>
    <Divider sx={{ my: 2 }} />
    {children}
  </Paper>
);

const GoodsConfig = () => {
  return (
    <Box>
      <ConfigSection title="Document Type">
        {/* Content will be added later */}
      </ConfigSection>

      <ConfigSection title="Upload File Settings">
        {/* Content will be added later */}
      </ConfigSection>

      <ConfigSection title="Define & Activate Fields">
        {/* Content will be added later */}
      </ConfigSection>

      <ConfigSection title="Data Validation">
        {/* Content will be added later */}
      </ConfigSection>

      <ConfigSection title="Number Schema">
        {/* Content will be added later */}
      </ConfigSection>

      <ConfigSection title="Email Summarise">
        {/* Content will be added later */}
      </ConfigSection>

      <ConfigSection title="Models Key Configuration">
        {/* Content will be added later */}
      </ConfigSection>

      <ConfigSection title="LLM Configuration">
        {/* Content will be added later */}
      </ConfigSection>
    </Box>
  );
};

export default GoodsConfig;