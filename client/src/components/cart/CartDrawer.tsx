import React from 'react';
import { Drawer, Typography, Box } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { closeCartDrawer } from '../../store/slices/cartSlice';

const CartDrawer: React.FC = () => {
  const { isDrawerOpen } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  return (
    <Drawer
      anchor="right"
      open={isDrawerOpen}
      onClose={() => dispatch(closeCartDrawer())}
    >
      <Box sx={{ width: 350, p: 2 }}>
        <Typography variant="h6">Shopping Cart</Typography>
        <Typography variant="body2" color="text.secondary">
          Cart functionality will be implemented here.
        </Typography>
      </Box>
    </Drawer>
  );
};

export default CartDrawer;