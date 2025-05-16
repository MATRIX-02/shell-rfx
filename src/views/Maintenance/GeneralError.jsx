import React, { useState } from 'react';
import { Box, Typography, Button, Container, Collapse } from '@mui/material';
import ErrorGif from 'assets/images/Error/GeneralError.gif'; 

const GeneralError = ({ errorMessage, errorDetails }) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(prevState => !prevState);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 3,
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <img
            src={ErrorGif}
            alt="Error Robot"
            style={{ width: '200px', height: 'auto', mixBlendMode: 'multiply' }}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'center', sm: 'flex-start' },
            justifyContent: 'center',
            textAlign: { xs: 'center', sm: 'left' },
          }}
        >
          <Typography variant="h4" component="h1" color="error" gutterBottom>
            Oops! Something went wrong.
          </Typography>

          <Typography variant="body1" color="textSecondary" gutterBottom>
            {errorMessage || 'An unexpected error has occurred. Please try again later.'}
          </Typography>

          <Button
            variant="text"
            color="primary"
            onClick={toggleDetails}
            sx={{ textTransform: 'none', mb: 2 }}
          >
            {showDetails ? 'Less Details' : 'More Details'}
          </Button>

          <Button
            variant="contained"
            color="primary"
            href="/"
            sx={{ mt: 2 }}
          >
            Go Back to Homepage
          </Button>
        </Box>
      </Box>

      <Collapse in={showDetails} timeout="auto" unmountOnExit>
        <Box
          sx={{
            backgroundColor: 'rgba(255,0,0,0.05)',
            borderRadius: 1,
            padding: 2,
            mt: 3,
            width: '100%',
            transition: 'height 0.3s ease',
          }}
        >
          <Typography variant="body2" color="textSecondary">
            {errorDetails || 'No additional details available for this error.'}
          </Typography>
        </Box>
      </Collapse>
    </Container>
  );
};

export default GeneralError;