import React, { useState, useCallback, useEffect } from 'react';
import { useApiService } from './apiService';

// Product interface compatible with server schema
export interface Product {
  id: string; // UUID from server
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  features: string[];
  specs: {
    [key: string]: string;
  };
  images: string[];
  category: string;
  category_id?: string; // UUID from server
  featured?: boolean;
  is_active?: boolean;
  slug?: string;
  stock?: number;
  updatedAt?: string;
  createdAt?: string;
  salesCount?: number;
}

// Server response interfaces
export interface ProductList {
  items: Product[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// Currency formatter for VND
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Storage keys for caching
const STORAGE_KEYS = {
  ALL_PRODUCTS: 'all_products',
  FEATURED_PRODUCTS: 'featured_products',
  CATEGORY_PRODUCTS: 'category_products_',
};

// Helper functions for localStorage
const saveToStorage = (key: string, data: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const getFromStorage = <T>(key: string): T | null => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting from localStorage:', error);
    return null;
  }
};

// Helper function to get data from either API or cache
const getSyncData = <T>(key: string, fallbackData: T): T => {
  const data = getFromStorage<T>(key);
  if (data) {
    return data;
  }
  saveToStorage(key, fallbackData);
  return fallbackData;
};

// Mock API delay for development
const mockApiDelay = (timeout = 500) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

// Mock products data as fallback if API fails
const mockProducts: Product[] = [
  // ... all the existing products with id changed to string
  {
    id: "1",
    name: "iPhone 13 Pro",
    price: 999 * 24500,
    originalPrice: 1099 * 24500,
    description: "Experience the ultimate iPhone with our most advanced camera system and stunning Super Retina XDR display with ProMotion.",
    features: [
      "A15 Bionic chip with 5-core GPU",
      "Super Retina XDR display with ProMotion",
      "Pro camera system with new 12MP Telephoto, Wide, and Ultra Wide",
      "Up to 28 hours of video playback"
    ],
    specs: {
      display: "6.1-inch Super Retina XDR",
      chip: "A15 Bionic",
      camera: "Pro 12MP camera system",
      battery: "Up to 28 hours",
      storage: "128GB, 256GB, 512GB, 1TB"
    },
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    ],
    category: "phones",
    featured: true
  },
  // ... keep all other products but change their id to string
  // Keep the same product structure, but truncated for this edit
];

// =====================
// API Connected Functions
// =====================

/**
 * Get all products from API
 */
export const getProducts = async (): Promise<Product[]> => {
  try {
    // Try to get from API first
    const apiService = useApiService();
    const response = await apiService.get<ProductList>('/products');
    const products = response.items;
    
    // Save to cache
    saveToStorage(STORAGE_KEYS.ALL_PRODUCTS, products);
    return products;
  } catch (error) {
    console.error('Failed to fetch products from API:', error);
    
    // Fallback to cache
    const cachedProducts = getFromStorage<Product[]>(STORAGE_KEYS.ALL_PRODUCTS);
    if (cachedProducts) {
      return cachedProducts;
    }
    
    // Last resort, use mock data
    return mockProducts;
  }
};

/**
 * Get products by category from API
 */
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const apiService = useApiService();
    // Use the search parameter for category if the API supports it
    const response = await apiService.get<ProductList>(`/products?category=${category}`);
    const products = response.items;
    
    // Cache by category
    saveToStorage(STORAGE_KEYS.CATEGORY_PRODUCTS + category, products);
    return products;
  } catch (error) {
    console.error(`Failed to fetch products for category ${category}:`, error);
    
    // Fallback to cache
    const cachedProducts = getFromStorage<Product[]>(STORAGE_KEYS.CATEGORY_PRODUCTS + category);
    if (cachedProducts) {
      return cachedProducts;
    }
    
    // Filter mock products as last resort
    return mockProducts.filter(product => product.category === category);
  }
};

/**
 * Get a product by ID from API
 */
export const getProductById = async (id: string): Promise<Product | undefined> => {
  try {
    const apiService = useApiService();
    const product = await apiService.get<Product>(`/products/${id}`);
    return product;
  } catch (error) {
    console.error(`Failed to fetch product with id ${id}:`, error);
    
    // Try to find in cache
    const allProducts = getFromStorage<Product[]>(STORAGE_KEYS.ALL_PRODUCTS);
    if (allProducts) {
      const cachedProduct = allProducts.find(p => p.id === id);
      if (cachedProduct) return cachedProduct;
    }
    
    // Last resort, check mock data
    return mockProducts.find(product => product.id === id);
  }
};

/**
 * Get featured products from API
 */
export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    // Trước tiên kiểm tra cache
    const cachedProducts = getFromStorage<Product[]>(STORAGE_KEYS.FEATURED_PRODUCTS);
    const cacheTime = getFromStorage<number>('featured_products_timestamp');
    const now = Date.now();
    
    // Sử dụng cache nếu có và chưa quá 5 phút
    if (cachedProducts && cacheTime && now - cacheTime < 5 * 60 * 1000) {
      console.log('Using cached featured products');
      return cachedProducts;
    }
    
    // Nếu không có cache hoặc cache đã cũ, gọi API
    const apiService = useApiService();
    const response = await apiService.get<ProductList>('/products?featured=true');
    const featuredProducts = response.items;
    
    // Cache sản phẩm và thời gian
    saveToStorage(STORAGE_KEYS.FEATURED_PRODUCTS, featuredProducts);
    saveToStorage('featured_products_timestamp', now);
    
    return featuredProducts;
  } catch (error) {
    console.error('Failed to fetch featured products:', error);
    
    // Sử dụng cache nếu có, bất kể thời gian
    const cachedProducts = getFromStorage<Product[]>(STORAGE_KEYS.FEATURED_PRODUCTS);
    if (cachedProducts) {
      return cachedProducts;
    }
    
    // Fallback to mock data
    return mockProducts.filter(product => product.featured);
  }
};

// =====================
// Synchronous Versions (for non-hook usage)
// =====================

export const getProductsSync = (): Product[] => {
  return getSyncData(STORAGE_KEYS.ALL_PRODUCTS, mockProducts);
};

export const getProductsByCategorySync = (category: string): Product[] => {
  return getSyncData(
    STORAGE_KEYS.CATEGORY_PRODUCTS + category, 
    mockProducts.filter(product => product.category === category)
  );
};

export const getFeaturedProductsSync = (): Product[] => {
  return getSyncData(
    STORAGE_KEYS.FEATURED_PRODUCTS, 
    mockProducts.filter(product => product.featured)
  );
};

// =====================
// React Hooks
// =====================

/**
 * React hook for getting featured products
 */
export const useFeaturedProducts = () => {
  const [data, setData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const apiService = useApiService();
  
  // Thêm flag để kiểm soát việc fetch dữ liệu
  const [shouldFetch, setShouldFetch] = useState(true);

  const fetchData = useCallback(async () => {
    // Chỉ fetch dữ liệu khi cần thiết
    if (!shouldFetch) return;
    
    setIsLoading(true);
    try {
      // Kiểm tra cache trước
      const cachedProducts = getFromStorage<Product[]>(STORAGE_KEYS.FEATURED_PRODUCTS);
      const cacheTime = getFromStorage<number>('featured_products_timestamp');
      const now = Date.now();
      
      // Nếu có cache và chưa quá 5 phút, sử dụng cache
      if (cachedProducts && cachedProducts.length > 0 && cacheTime && now - cacheTime < 5 * 60 * 1000) {
        console.log('Using cached data in hook');
        setData(cachedProducts);
        setError(null);
        setShouldFetch(false);
        setIsLoading(false);
        return;
      }
      
      // Nếu không có cache hoặc cache đã cũ, gọi API
      const response = await apiService.get<ProductList>('/products?featured=true');
      setData(response.items);
      setError(null);
      
      // Cập nhật cache và timestamp
      saveToStorage(STORAGE_KEYS.FEATURED_PRODUCTS, response.items);
      saveToStorage('featured_products_timestamp', now);
      
      // Đặt shouldFetch thành false để tránh fetch liên tục
      setShouldFetch(false);
    } catch (err) {
      console.error('Error in useFeaturedProducts:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      
      // Fallback to cache
      const cachedProducts = getFromStorage<Product[]>(STORAGE_KEYS.FEATURED_PRODUCTS);
      if (cachedProducts && cachedProducts.length > 0) {
        setData(cachedProducts);
      } else {
        // Last resort, use mock data
        setData(mockProducts.filter(product => product.featured));
      }
      
      // Đặt shouldFetch thành false ngay cả khi có lỗi
      setShouldFetch(false);
    } finally {
      setIsLoading(false);
    }
  }, [apiService, shouldFetch]);

  useEffect(() => {
    fetchData();
    
    // Chỉ fetch lại dữ liệu sau mỗi 5 phút
    const intervalId = setInterval(() => {
      setShouldFetch(true);
    }, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [fetchData]);

  const refetch = useCallback(() => {
    setShouldFetch(true);
    return fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch };
};

/**
 * React hook for getting all products
 */
export const useProducts = () => {
  const [data, setData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const apiService = useApiService();
  const [shouldFetch, setShouldFetch] = useState(true);

  const fetchData = useCallback(async () => {
    if (!shouldFetch) return;
    
    setIsLoading(true);
    try {
      // Kiểm tra cache trước
      const cachedProducts = getFromStorage<Product[]>(STORAGE_KEYS.ALL_PRODUCTS);
      const cacheTime = getFromStorage<number>('all_products_timestamp');
      const now = Date.now();
      
      // Nếu có cache và chưa quá 5 phút, sử dụng cache
      if (cachedProducts && cachedProducts.length > 0 && cacheTime && now - cacheTime < 5 * 60 * 1000) {
        console.log('Using cached all products');
        setData(cachedProducts);
        setError(null);
        setShouldFetch(false);
        setIsLoading(false);
        return;
      }
      
      // Nếu không có cache hoặc cache đã cũ, gọi API
      const response = await apiService.get<ProductList>('/products');
      setData(response.items);
      setError(null);
      
      // Cập nhật cache và timestamp
      saveToStorage(STORAGE_KEYS.ALL_PRODUCTS, response.items);
      saveToStorage('all_products_timestamp', now);
      setShouldFetch(false);
    } catch (err) {
      console.error('Error in useProducts:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      
      // Fallback to cache
      const cachedProducts = getFromStorage<Product[]>(STORAGE_KEYS.ALL_PRODUCTS);
      if (cachedProducts && cachedProducts.length > 0) {
        setData(cachedProducts);
      } else {
        // Last resort, use mock data
        setData(mockProducts);
      }
      setShouldFetch(false);
    } finally {
      setIsLoading(false);
    }
  }, [apiService, shouldFetch]);

  useEffect(() => {
    fetchData();
    
    // Chỉ fetch lại dữ liệu sau mỗi 5 phút
    const intervalId = setInterval(() => {
      setShouldFetch(true);
    }, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [fetchData]);

  const refetch = useCallback(() => {
    setShouldFetch(true);
    return fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch };
};

/**
 * React hook for getting products by category
 */
export const useProductsByCategory = (category: string) => {
  const [data, setData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const apiService = useApiService();
  const [shouldFetch, setShouldFetch] = useState(true);
  const cacheKey = `${STORAGE_KEYS.CATEGORY_PRODUCTS}${category}`;
  const timestampKey = `category_${category}_timestamp`;

  const fetchData = useCallback(async () => {
    if (!shouldFetch) return;
    
    setIsLoading(true);
    try {
      // Kiểm tra cache trước
      const cachedProducts = getFromStorage<Product[]>(cacheKey);
      const cacheTime = getFromStorage<number>(timestampKey);
      const now = Date.now();
      
      // Nếu có cache và chưa quá 5 phút, sử dụng cache
      if (cachedProducts && cachedProducts.length > 0 && cacheTime && now - cacheTime < 5 * 60 * 1000) {
        console.log(`Using cached products for category ${category}`);
        setData(cachedProducts);
        setError(null);
        setShouldFetch(false);
        setIsLoading(false);
        return;
      }
      
      // Nếu không có cache hoặc cache đã cũ, gọi API
      const response = await apiService.get<ProductList>(`/products?category=${category}`);
      setData(response.items);
      setError(null);
      
      // Cập nhật cache và timestamp
      saveToStorage(cacheKey, response.items);
      saveToStorage(timestampKey, now);
      setShouldFetch(false);
    } catch (err) {
      console.error(`Error in useProductsByCategory for ${category}:`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
      
      // Fallback to cache
      const cachedProducts = getFromStorage<Product[]>(cacheKey);
      if (cachedProducts && cachedProducts.length > 0) {
        setData(cachedProducts);
      } else {
        // Last resort, use mock data
        setData(mockProducts.filter(p => p.category === category));
      }
      setShouldFetch(false);
    } finally {
      setIsLoading(false);
    }
  }, [apiService, category, cacheKey, timestampKey, shouldFetch]);

  useEffect(() => {
    // Reset shouldFetch when category changes
    setShouldFetch(true);
    fetchData();
    
    // Chỉ fetch lại dữ liệu sau mỗi 5 phút
    const intervalId = setInterval(() => {
      setShouldFetch(true);
    }, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [fetchData, category]);

  const refetch = useCallback(() => {
    setShouldFetch(true);
    return fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch };
};
