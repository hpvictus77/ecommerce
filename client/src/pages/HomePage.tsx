import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Paper,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ShoppingCart, Star, LocalShipping, Security, Support24 } from '@mui/icons-material';

const HomePage: React.FC = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #232F3E 0%, #37475A 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            Welcome to Amazon Clone
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom sx={{ opacity: 0.9 }}>
            Discover millions of products at unbeatable prices
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.8 }}>
            Fast delivery, secure shopping, and excellent customer service
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={RouterLink}
            to="/products"
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              background: 'linear-gradient(45deg, #FF9900 30%, #FFB84D 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #e88a00 30%, #FF9900 90%)',
              },
            }}
          >
            Start Shopping
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
          Why Choose Us?
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <LocalShipping sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Free Shipping
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Free shipping on orders over $50. Fast and reliable delivery to your doorstep.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Security sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Secure Payment
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your payment information is always secure with our advanced encryption technology.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Support24 sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                24/7 Support
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Our customer support team is available around the clock to help you.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Featured Products Section */}
      <Box sx={{ backgroundColor: 'background.default', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
            Featured Products
          </Typography>
          <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 4 }}>
            Check out our most popular items
          </Typography>
          
          <Grid container spacing={3}>
            {/* Sample Featured Products */}
            {[1, 2, 3, 4].map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      height: 200,
                      backgroundColor: 'grey.200',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ShoppingCart sx={{ fontSize: 60, color: 'grey.400' }} />
                  </CardMedia>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h3" gutterBottom>
                      Sample Product {product}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      This is a sample product description. In a real application, this would contain actual product details.
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Star sx={{ color: 'warning.main', fontSize: 16 }} />
                        <Typography variant="body2" sx={{ ml: 0.5 }}>
                          4.5
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        (123)
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="h6" color="primary">
                        ${(19.99 + product * 10).toFixed(2)}
                      </Typography>
                      <Chip label="Best Seller" size="small" color="primary" />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          <Box textAlign="center" sx={{ mt: 4 }}>
            <Button
              variant="outlined"
              size="large"
              component={RouterLink}
              to="/products"
              sx={{ px: 3 }}
            >
              View All Products
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box sx={{ backgroundColor: 'primary.main', color: 'white', py: 6 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Ready to Start Shopping?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Join millions of satisfied customers and discover amazing deals every day.
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={RouterLink}
            to="/register"
            sx={{
              backgroundColor: 'white',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'grey.100',
              },
            }}
          >
            Create Account
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;