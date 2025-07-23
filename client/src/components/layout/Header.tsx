import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  InputBase,
  Button,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingCart as CartIcon,
  Menu as MenuIcon,
  AccountCircle,
  Brightness4,
  Brightness7,
  Person,
  ShoppingBag,
  Logout,
  AdminPanelSettings,
  Favorite,
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { toggleTheme, toggleMobileMenu } from '../../store/slices/uiSlice';
import { toggleCartDrawer } from '../../store/slices/cartSlice';
import { logout } from '../../store/slices/authSlice';

const Header: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { cart } = useAppSelector((state) => state.cart);
  const { theme: currentTheme } = useAppSelector((state) => state.ui);

  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleUserMenuClose();
    navigate('/');
  };

  const cartItemCount = cart?.totalItems || 0;

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        backgroundColor: '#232F3E',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <Toolbar sx={{ gap: 2 }}>
        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => dispatch(toggleMobileMenu())}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Logo */}
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold',
            flexShrink: 0,
            '&:hover': {
              opacity: 0.8,
            },
          }}
        >
          Amazon Clone
        </Typography>

        {/* Search Bar */}
        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{
            flexGrow: 1,
            maxWidth: 600,
            mx: 2,
            display: 'flex',
            backgroundColor: 'white',
            borderRadius: 1,
            overflow: 'hidden',
          }}
        >
          <InputBase
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              flex: 1,
              px: 2,
              py: 1,
              fontSize: '0.875rem',
            }}
          />
          <IconButton 
            type="submit" 
            sx={{ 
              p: 1, 
              backgroundColor: '#FF9900',
              borderRadius: 0,
              '&:hover': {
                backgroundColor: '#e88a00',
              },
            }}
          >
            <SearchIcon />
          </IconButton>
        </Box>

        {/* Navigation Links */}
        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              color="inherit"
              component={RouterLink}
              to="/products"
              sx={{ textTransform: 'none' }}
            >
              Products
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/categories"
              sx={{ textTransform: 'none' }}
            >
              Categories
            </Button>
          </Box>
        )}

        {/* Right Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Theme Toggle */}
          <IconButton
            color="inherit"
            onClick={() => dispatch(toggleTheme())}
            title={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} theme`}
          >
            {currentTheme === 'light' ? <Brightness4 /> : <Brightness7 />}
          </IconButton>

          {/* Cart */}
          <IconButton
            color="inherit"
            onClick={() => dispatch(toggleCartDrawer())}
            title="Shopping Cart"
          >
            <Badge badgeContent={cartItemCount} color="error">
              <CartIcon />
            </Badge>
          </IconButton>

          {/* User Menu */}
          {isAuthenticated ? (
            <>
              <IconButton
                color="inherit"
                onClick={handleUserMenuOpen}
                title="Account"
              >
                {user?.avatar ? (
                  <Avatar src={user.avatar} sx={{ width: 32, height: 32 }} />
                ) : (
                  <AccountCircle />
                )}
              </IconButton>
              <Menu
                anchorEl={userMenuAnchor}
                open={Boolean(userMenuAnchor)}
                onClose={handleUserMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {user?.firstName} {user?.lastName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user?.email}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem
                  onClick={() => {
                    navigate('/profile');
                    handleUserMenuClose();
                  }}
                >
                  <Person sx={{ mr: 1 }} />
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate('/orders');
                    handleUserMenuClose();
                  }}
                >
                  <ShoppingBag sx={{ mr: 1 }} />
                  Orders
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate('/wishlist');
                    handleUserMenuClose();
                  }}
                >
                  <Favorite sx={{ mr: 1 }} />
                  Wishlist
                </MenuItem>
                {user?.role === 'admin' && (
                  <>
                    <Divider />
                    <MenuItem
                      onClick={() => {
                        navigate('/admin');
                        handleUserMenuClose();
                      }}
                    >
                      <AdminPanelSettings sx={{ mr: 1 }} />
                      Admin Dashboard
                    </MenuItem>
                  </>
                )}
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                color="inherit"
                component={RouterLink}
                to="/login"
                sx={{ textTransform: 'none' }}
              >
                Sign In
              </Button>
              {!isMobile && (
                <Button
                  variant="outlined"
                  color="inherit"
                  component={RouterLink}
                  to="/register"
                  sx={{ 
                    textTransform: 'none',
                    borderColor: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Sign Up
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;