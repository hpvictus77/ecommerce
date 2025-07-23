import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const OrdersPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>My Orders</Typography>
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="body1" color="text.secondary">
          Orders page will be implemented here.
        </Typography>
      </Box>
    </Container>
  );
};

export default OrdersPage;