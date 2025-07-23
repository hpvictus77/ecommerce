import React from 'react';
import { Box, Container, Typography, Link, Grid } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#232F3E',
        color: 'white',
        py: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>
              Amazon Clone
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Your one-stop shop for everything you need.
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>
              Customer Service
            </Typography>
            <Link href="#" color="inherit" underline="hover" display="block">
              Help Center
            </Link>
            <Link href="#" color="inherit" underline="hover" display="block">
              Returns
            </Link>
            <Link href="#" color="inherit" underline="hover" display="block">
              Contact Us
            </Link>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>
              About
            </Typography>
            <Link href="#" color="inherit" underline="hover" display="block">
              About Us
            </Link>
            <Link href="#" color="inherit" underline="hover" display="block">
              Careers
            </Link>
            <Link href="#" color="inherit" underline="hover" display="block">
              Privacy Policy
            </Link>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>
              Connect
            </Typography>
            <Link href="#" color="inherit" underline="hover" display="block">
              Facebook
            </Link>
            <Link href="#" color="inherit" underline="hover" display="block">
              Twitter
            </Link>
            <Link href="#" color="inherit" underline="hover" display="block">
              Instagram
            </Link>
          </Grid>
        </Grid>
        <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          <Typography variant="body2" textAlign="center" sx={{ opacity: 0.8 }}>
            © 2024 Amazon Clone. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;