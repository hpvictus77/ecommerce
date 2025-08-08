import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from '../../types';

interface UiState {
  isLoading: boolean;
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  isFilterDrawerOpen: boolean;
  notifications: Notification[];
  theme: 'light' | 'dark';
  breadcrumbs: Array<{ label: string; path?: string }>;
  pageTitle: string;
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

const initialState: UiState = {
  isLoading: false,
  isMobileMenuOpen: false,
  isSearchOpen: false,
  isFilterDrawerOpen: false,
  notifications: [],
  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
  breadcrumbs: [],
  pageTitle: '',
  seo: {},
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    closeMobileMenu: (state) => {
      state.isMobileMenuOpen = false;
    },
    openMobileMenu: (state) => {
      state.isMobileMenuOpen = true;
    },
    toggleSearch: (state) => {
      state.isSearchOpen = !state.isSearchOpen;
    },
    openSearch: (state) => {
      state.isSearchOpen = true;
    },
    closeSearch: (state) => {
      state.isSearchOpen = false;
    },
    toggleFilterDrawer: (state) => {
      state.isFilterDrawerOpen = !state.isFilterDrawerOpen;
    },
    openFilterDrawer: (state) => {
      state.isFilterDrawerOpen = true;
    },
    closeFilterDrawer: (state) => {
      state.isFilterDrawerOpen = false;
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'createdAt' | 'read'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        read: false,
        createdAt: new Date().toISOString(),
      };
      state.notifications.unshift(notification);
      
      // Keep only last 10 notifications
      if (state.notifications.length > 10) {
        state.notifications = state.notifications.slice(0, 10);
      }
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(
        (notification) => notification.id === action.payload
      );
      if (notification) {
        notification.read = true;
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach((notification) => {
        notification.read = true;
      });
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
    },
    setBreadcrumbs: (state, action: PayloadAction<Array<{ label: string; path?: string }>>) => {
      state.breadcrumbs = action.payload;
    },
    addBreadcrumb: (state, action: PayloadAction<{ label: string; path?: string }>) => {
      state.breadcrumbs.push(action.payload);
    },
    setPageTitle: (state, action: PayloadAction<string>) => {
      state.pageTitle = action.payload;
      document.title = action.payload ? `${action.payload} - Amazon Clone` : 'Amazon Clone';
    },
    setSeo: (state, action: PayloadAction<{
      title?: string;
      description?: string;
      keywords?: string[];
    }>) => {
      state.seo = action.payload;
      
      // Update document head
      if (action.payload.title) {
        document.title = action.payload.title;
      }
      
      if (action.payload.description) {
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
          metaDescription = document.createElement('meta');
          metaDescription.setAttribute('name', 'description');
          document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute('content', action.payload.description);
      }
      
      if (action.payload.keywords) {
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
          metaKeywords = document.createElement('meta');
          metaKeywords.setAttribute('name', 'keywords');
          document.head.appendChild(metaKeywords);
        }
        metaKeywords.setAttribute('content', action.payload.keywords.join(', '));
      }
    },
    showSuccessNotification: (state, action: PayloadAction<string>) => {
      const notification: Notification = {
        id: Date.now().toString(),
        type: 'success',
        title: 'Success',
        message: action.payload,
        read: false,
        createdAt: new Date().toISOString(),
      };
      state.notifications.unshift(notification);
    },
    showErrorNotification: (state, action: PayloadAction<string>) => {
      const notification: Notification = {
        id: Date.now().toString(),
        type: 'error',
        title: 'Error',
        message: action.payload,
        read: false,
        createdAt: new Date().toISOString(),
      };
      state.notifications.unshift(notification);
    },
    showWarningNotification: (state, action: PayloadAction<string>) => {
      const notification: Notification = {
        id: Date.now().toString(),
        type: 'warning',
        title: 'Warning',
        message: action.payload,
        read: false,
        createdAt: new Date().toISOString(),
      };
      state.notifications.unshift(notification);
    },
    showInfoNotification: (state, action: PayloadAction<string>) => {
      const notification: Notification = {
        id: Date.now().toString(),
        type: 'info',
        title: 'Info',
        message: action.payload,
        read: false,
        createdAt: new Date().toISOString(),
      };
      state.notifications.unshift(notification);
    },
  },
});

export const {
  setLoading,
  toggleMobileMenu,
  closeMobileMenu,
  openMobileMenu,
  toggleSearch,
  openSearch,
  closeSearch,
  toggleFilterDrawer,
  openFilterDrawer,
  closeFilterDrawer,
  addNotification,
  removeNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearNotifications,
  setTheme,
  toggleTheme,
  setBreadcrumbs,
  addBreadcrumb,
  setPageTitle,
  setSeo,
  showSuccessNotification,
  showErrorNotification,
  showWarningNotification,
  showInfoNotification,
} = uiSlice.actions;

export default uiSlice.reducer;