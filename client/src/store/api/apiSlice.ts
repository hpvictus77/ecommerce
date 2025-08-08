import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';
import { ApiResponse } from '../../types';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);
  
  if (result.error && result.error.status === 401) {
    // Token expired, logout user
    api.dispatch({ type: 'auth/logout' });
  }
  
  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'User',
    'Product',
    'Category',
    'Cart',
    'Order',
    'Review',
    'Admin'
  ],
  endpoints: () => ({}),
});

// Export hooks for usage in functional components
export const {
  // Auth endpoints will be injected here
  // Product endpoints will be injected here
  // Cart endpoints will be injected here
  // Order endpoints will be injected here
} = api;