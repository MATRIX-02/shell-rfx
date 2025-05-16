import React from 'react';
import { Box, Typography, Button, Container, SvgIcon } from '@mui/material';
import { IconHome } from '@tabler/icons-react';
import ErrorGif from "assets/images/Error/Error404.gif"

const Error404 = () => {
  return (
    <Container maxWidth="md">

      <Box sx={{ textAlign: 'center', mt: 10 }}>
        <img src={ErrorGif} alt="Error 404" style={{ width: '100%', margin: '0 auto' }} />
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
          Something is wrong
        </Typography>
        <Typography align="center" paragraph>
          The page you are looking was moved, removed, renamed, or might never exist!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<IconHome />}
          href="/"
          size="large"
        >
          Go to Homepage
        </Button>
      </Box>
    </Container>
  );
};

export default Error404;