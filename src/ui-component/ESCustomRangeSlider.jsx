import React, { useState, useMemo } from 'react';
import { Slider, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomSlider = styled(Slider)(({ theme, bubbleSize }) => ({
  color: '#000',
  height: 8,
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-thumb': {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
    '&:before': {
      display: 'none',
    },
  },
  '& .MuiSlider-valueLabel': {
    lineHeight: 1.2,
    fontSize: 12,
    background: 'unset',
    padding: 0,
    width: bubbleSize,
    height: bubbleSize,
    borderRadius: '50% 50% 50% 0',
    backgroundColor: '#000',
    transformOrigin: 'bottom left',
    transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
    '&:before': { display: 'none' },
    '&.MuiSlider-valueLabelOpen': {
      transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
    },
    '& > *': {
      transform: 'rotate(45deg)',
    },
  },
}));

const ESCustomRangeSlider = ({ min, max, initialValue, label }) => {
  const formatNumber = (num) => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const [value, setValue] = useState(initialValue);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const bubbleSize = useMemo(() => {
    const formattedValue = formatNumber(value);
    const length = formattedValue.length;
    return Math.max(8, length * 5); // Base size of 10, increase by 5 for each character
  }, [value]);

  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      {label && (
        <Typography sx={{fontSize:'1rem'}} gutterBottom>{label}</Typography>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography sx={{ mr: 2, color: '#000' }}>{"$"}{formatNumber(min)}</Typography>
        <CustomSlider
          value={value}
          onChange={handleChange}
          valueLabelDisplay="auto"
          min={min}
          max={max}
          bubbleSize={bubbleSize}
        />
        <Typography sx={{ ml: 2, color: '#000' }}>{"$"}{formatNumber(max)}</Typography>
      </Box>
      <Typography 
        variant="h6" 
        sx={{ 
          mt: 2, 
          textAlign: 'center', 
          color: '#000', 
          fontWeight: 'bold' 
        }}
      >
        {"$ "}{formatNumber(value)}
      </Typography>
    </Box>
  );
};

export default ESCustomRangeSlider;