// User types
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'customer' | 'admin';
  addresses: Address[];
  wishlist: string[];
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  _id?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

// Product types
export interface Product {
  _id: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  comparePrice?: number;
  cost?: number;
  sku?: string;
  barcode?: string;
  category: Category;
  subcategory?: Category;
  brand?: string;
  images: string[];
  variants: ProductVariant[];
  tags: string[];
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  inventory: {
    stock: number;
    lowStockThreshold: number;
    trackQuantity: boolean;
  };
  status: 'active' | 'inactive' | 'archived';
  featured: boolean;
  onSale: boolean;
  saleStartDate?: string;
  saleEndDate?: string;
  seo?: {
    title: string;
    description: string;
    keywords: string[];
  };
  ratings: {
    average: number;
    count: number;
  };
  reviews: Review[];
  vendor?: string;
  shipping?: {
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    shippingClass: string;
  };
  discountPercentage?: number;
  inStock?: boolean;
  isLowStock?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  _id?: string;
  size?: string;
  color?: string;
  sku?: string;
  price?: number;
  stock: number;
  images?: string[];
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: string;
  level: number;
  path: string;
  isActive: boolean;
  sortOrder: number;
  children?: Category[];
  productCount?: number;
  seo?: {
    title: string;
    description: string;
    keywords: string[];
  };
  attributes: CategoryAttribute[];
  createdAt: string;
  updatedAt: string;
}

export interface CategoryAttribute {
  name: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'boolean';
  options?: string[];
  required: boolean;
}

// Review types
export interface Review {
  _id: string;
  user: User;
  rating: number;
  comment: string;
  helpful: number;
  createdAt: string;
  updatedAt: string;
}

// Cart types
export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
  variant?: {
    size?: string;
    color?: string;
    sku?: string;
  };
  price: number;
  addedAt: string;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  appliedCoupon?: {
    code: string;
    discount: number;
    discountType: 'percentage' | 'fixed';
  };
  estimatedTax: number;
  estimatedShipping: number;
  estimatedTotal: number;
  createdAt: string;
  updatedAt: string;
}

// Order types
export interface OrderItem {
  _id: string;
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant?: {
    size?: string;
    color?: string;
    sku?: string;
  };
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: User;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  billingAddress: ShippingAddress;
  paymentMethod: {
    type: 'card' | 'paypal' | 'apple_pay' | 'google_pay';
    last4?: string;
    brand?: string;
  };
  paymentResult?: {
    id: string;
    status: string;
    update_time: string;
    email_address: string;
  };
  pricing: {
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
    total: number;
  };
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' | 'failed';
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  shippingDetails?: {
    carrier: string;
    trackingNumber: string;
    estimatedDelivery: string;
    shippedAt: string;
  };
  notes?: string;
  cancellationReason?: string;
  refundAmount?: number;
  refundReason?: string;
  refundedAt?: string;
  couponCode?: string;
  currency: string;
  statusHistory: {
    status: string;
    date: string;
    note?: string;
    updatedBy?: string;
  }[];
  totalItems?: number;
  totalWeight?: number;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
  pagination?: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Filter and search types
export interface ProductFilters {
  category?: string;
  subcategory?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  onSale?: boolean;
  featured?: boolean;
  tags?: string[];
  sortBy?: 'name' | 'price' | 'rating' | 'newest' | 'oldest';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  search?: string;
}

// UI types
export interface MenuItem {
  id: string;
  label: string;
  path?: string;
  children?: MenuItem[];
  icon?: string;
}

export interface Breadcrumb {
  label: string;
  path?: string;
}

// Payment types
export interface PaymentIntent {
  clientSecret: string;
  amount: number;
  currency: string;
}

// Analytics types
export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  averageOrderValue: number;
  conversionRate: number;
  topProducts: Product[];
  recentOrders: Order[];
  salesChart: {
    date: string;
    sales: number;
    orders: number;
  }[];
}

// Notification types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}