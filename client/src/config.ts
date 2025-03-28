/**
 * Cấu hình toàn cục cho ứng dụng
 */

// API endpoints
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 10000, // 10 seconds
  RETRY_COUNT: 2,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
};

// API Endpoints
export const API_ENDPOINTS = {
  PRODUCTS: {
    GET_ALL: '/products',
    GET_BY_ID: (id: number | string) => `/products/${id}`,
    GET_BY_CATEGORY: (category: string) => `/products/category/${category}`,
    GET_FEATURED: '/products/featured',
  },
  CATEGORIES: {
    GET_ALL: '/categories',
  },
  CART: {
    GET: '/cart',
    ADD: '/cart/add',
    REMOVE: '/cart/remove',
    UPDATE: '/cart/update',
  },
  USER: {
    PROFILE: '/user/profile',
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
  },
  ORDERS: {
    GET_ALL: '/orders',
    GET_BY_ID: (id: number | string) => `/orders/${id}`,
    CREATE: '/orders',
  },
};

// Frontend routes (cho trang tương ứng)
export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (id: number | string) => `/product/${id}`,
  CATEGORY: (category: string) => `/products/${category}`,
  CART: '/cart',
  CHECKOUT: '/checkout',
  USER: {
    PROFILE: '/user',
    ORDERS: '/user/orders',
    SETTINGS: '/user/settings',
    WISHLIST: '/wishlist',
  },
  SEARCH: '/search',
  ORDER: (id: number | string) => `/order/${id}`,
};

// Cấu hình Animation
export const ANIMATION_CONFIG = {
  DURATION: {
    FAST: 0.2,
    NORMAL: 0.5,
    SLOW: 0.8,
  },
  VARIANTS: {
    FADE_IN: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    FADE_UP: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    },
    SCALE_IN: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 },
    },
  },
};

// UI Config
export const UI_CONFIG = {
  BREAKPOINTS: {
    MOBILE: 768,
    TABLET: 1024,
    DESKTOP: 1280,
  },
  THEME: {
    DARK: 'dark',
    LIGHT: 'light',
  },
};

export default {
  API_CONFIG,
  API_ENDPOINTS,
  ROUTES,
  ANIMATION_CONFIG,
  UI_CONFIG,
}; 