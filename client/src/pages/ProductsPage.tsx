import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const ProductsPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        All Products
      </Typography>
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="body1" color="text.secondary">
          Products page will be implemented here.
        </Typography>
      </Box>
    </Container>
  );
};

export default ProductsPage;