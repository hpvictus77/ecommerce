import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const ProductDetailPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Product Details</Typography>
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="body1" color="text.secondary">
          Product detail page will be implemented here.
        </Typography>
      </Box>
    </Container>
  );
};

export default ProductDetailPage;