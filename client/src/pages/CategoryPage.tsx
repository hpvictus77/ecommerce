import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const CategoryPage: React.FC = () => (
  <Container maxWidth="lg" sx={{ py: 4 }}>
    <Typography variant="h4" gutterBottom>Category</Typography>
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Typography variant="body1" color="text.secondary">
        Category page will be implemented here.
      </Typography>
    </Box>
  </Container>
);

export default CategoryPage;