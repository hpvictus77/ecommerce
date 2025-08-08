import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const WishlistPage: React.FC = () => (
  <Container maxWidth="lg" sx={{ py: 4 }}>
    <Typography variant="h4" gutterBottom>My Wishlist</Typography>
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Typography variant="body1" color="text.secondary">
        Wishlist page will be implemented here.
      </Typography>
    </Box>
  </Container>
);

export default WishlistPage;