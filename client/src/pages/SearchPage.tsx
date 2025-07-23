import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const SearchPage: React.FC = () => (
  <Container maxWidth="lg" sx={{ py: 4 }}>
    <Typography variant="h4" gutterBottom>Search Results</Typography>
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Typography variant="body1" color="text.secondary">
        Search page will be implemented here.
      </Typography>
    </Box>
  </Container>
);

export default SearchPage;