import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { IconHome } from '@tabler/icons-react';
import ErrorGif from 'assets/images/Error/Error500.svg';

const Error500 = () => {
  const [textIndex, setTextIndex] = useState(0);
  const [textWidth, setTextWidth] = useState('auto'); // Default width to auto initially
  const textRef = useRef(null);
  const textVariations = ['It appears', 'Unfortunately,', 'Looks like'];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTextIndex((prevIndex) => (prevIndex + 1) % textVariations.length);
    }, 3000); // Change text every 3 seconds

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Update width only after the text is rendered
    if (textRef.current) {
      setTextWidth(`${textRef.current.offsetWidth}px`); // Set width to the actual width of the text
    }
  }, [textIndex]);

  return (
    <Container maxWidth="md">
      <Box sx={{ textAlign: 'center', mt: 10 }}>
        <img src={ErrorGif} alt="Error 500" style={{ width: '60%', margin: '0 auto' }} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h4" component="h2" gutterBottom align="center" color="secondary.dark">
          Internal Server Error
        </Typography>
        <Box sx={{ height: '1.5em', mb: 2, display: 'flex', alignItems: 'center' }}>
          {/* Sliding text */}
          <Box
            sx={{
              height: '1.5em',
              overflow: 'hidden',
              transition: 'width 0.5s ease',
              width: textWidth, // Set the dynamic width based on the current text
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.5s ease',
                transform: `translateY(-${textIndex * 33}%)`,
                width: 'fit-content',
              }}
            >
              {textVariations.map((text, index) => (
                <Typography key={index} sx={{ whiteSpace: 'nowrap', textAlign:"right", lineHeight:"1.5" }} ref={index === textIndex ? textRef : null}>
                  {text}
                </Typography>
              ))}
            </Box>
          </Box>

          {/* Static text */}
          <Typography>&nbsp;the server crashed. Beg your pardon, please try again later.</Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<IconHome />} href="/" size="large">
          Go to Homepage
        </Button>
      </Box>
    </Container>
  );
};

export default Error500;
