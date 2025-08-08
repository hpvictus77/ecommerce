import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const OrderDetailPage: React.FC = () => (
  <Container maxWidth="lg" sx={{ py: 4 }}>
    <Typography variant="h4" gutterBottom>Order Details</Typography>
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Typography variant="body1" color="text.secondary">
        Order detail page will be implemented here.
      </Typography>
    </Box>
  </Container>
);

export default OrderDetailPage;