import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const NotFoundPage: React.FC = () => (
  <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
    <Typography variant="h1" component="h1" sx={{ fontSize: '6rem', fontWeight: 'bold', mb: 2 }}>
      404
    </Typography>
    <Typography variant="h4" gutterBottom>
      Page Not Found
    </Typography>
    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
      The page you're looking for doesn't exist.
    </Typography>
    <Button 
      variant="contained" 
      component={RouterLink} 
      to="/" 
      size="large"
    >
      Go Home
    </Button>
  </Container>
);

export default NotFoundPage;