import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthState } from '../../types';

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      localStorage.setItem('token', action.payload.token);
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = action.payload;
      localStorage.removeItem('token');
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      state.loading = false;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      if (state.user) {
        state.user = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    // Handle token from localStorage on app init
    initializeAuth: (state) => {
      const token = localStorage.getItem('token');
      if (token) {
        state.token = token;
        // User data will be fetched after token validation
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  updateUser,
  setLoading,
  initializeAuth,
} = authSlice.actions;

export default authSlice.reducer;