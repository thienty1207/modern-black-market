import { useState, useCallback, useEffect } from 'react';
import { useApiService, publicApi } from './apiService';

// Interface định nghĩa model Category
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  image_url?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  children?: Category[];
}

// Response từ API khi lấy danh sách categories
export interface CategoryList {
  items: Category[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// Storage keys cho caching
const STORAGE_KEYS = {
  ALL_CATEGORIES: 'all_categories',
  CATEGORY_DETAIL: 'category_detail_',
};

// Helper functions
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

// Mock categories (fallback khi API không hoạt động)
const mockCategories: Category[] = [
  {
    id: "1",
    name: "Điện thoại",
    slug: "phones",
    description: "Smartphone và điện thoại di động",
    is_active: true,
    image_url: "https://i.pinimg.com/736x/f8/21/d5/f821d500c6b948e4d32bf0e61eea1b48.jpg",
  },
  {
    id: "2",
    name: "Laptop",
    slug: "laptops",
    description: "Laptop và máy tính xách tay",
    is_active: true,
    image_url: "https://i.pinimg.com/736x/6c/f7/d3/6cf7d3c1aefd776a8c3df0612642d8cb.jpg",
  },
  {
    id: "3",
    name: "Máy ảnh",
    slug: "cameras",
    description: "Máy ảnh và thiết bị quay phim",
    is_active: true,
    image_url: "https://i.pinimg.com/736x/24/e6/53/24e653f589559dc34db312464dbb5036.jpg",
  }
];

/**
 * Hook để lấy danh sách tất cả danh mục
 */
export const useCategories = () => {
  const [data, setData] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Gọi API để lấy danh sách danh mục (sử dụng publicApi thay vì apiService)
      const response = await publicApi.get<CategoryList>('/categories');
      setData(response.items);
      setError(null);
      
      // Lưu vào cache
      saveToStorage(STORAGE_KEYS.ALL_CATEGORIES, response.items);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      
      // Sử dụng cache nếu có
      const cachedCategories = getFromStorage<Category[]>(STORAGE_KEYS.ALL_CATEGORIES);
      if (cachedCategories && cachedCategories.length > 0) {
        setData(cachedCategories);
      } else {
        // Dùng dữ liệu mẫu nếu không có cache
        setData(mockCategories);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch };
};

/**
 * Hook để lấy chi tiết một danh mục
 */
export const useCategory = (idOrSlug: string) => {
  const [data, setData] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!idOrSlug) {
      setError(new Error('Category ID or slug is required'));
      return;
    }

    setIsLoading(true);
    try {
      // Kiểm tra xem đầu vào là ID hay slug
      let category: Category;
      if (idOrSlug.match(/^[0-9a-fA-F-]{36}$/)) {
        // Nếu là UUID, gọi API lấy theo ID
        category = await publicApi.get<Category>(`/categories/${idOrSlug}`);
      } else {
        // Nếu là slug, gọi API lấy theo slug
        category = await publicApi.get<Category>(`/categories/slug/${idOrSlug}`);
      }
      
      setData(category);
      setError(null);
      
      // Lưu vào cache
      saveToStorage(`${STORAGE_KEYS.CATEGORY_DETAIL}${idOrSlug}`, category);
    } catch (err) {
      console.error(`Error fetching category (${idOrSlug}):`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
      
      // Sử dụng cache nếu có
      const cachedCategory = getFromStorage<Category>(`${STORAGE_KEYS.CATEGORY_DETAIL}${idOrSlug}`);
      if (cachedCategory) {
        setData(cachedCategory);
      } else {
        // Sử dụng dữ liệu mẫu
        const mockCategory = mockCategories.find(c => 
          c.id === idOrSlug || c.slug === idOrSlug
        );
        if (mockCategory) {
          setData(mockCategory);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [idOrSlug]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch };
};

/**
 * Lấy danh sách danh mục (không sử dụng hook)
 */
export const getCategories = async (): Promise<Category[]> => {
  try {
    // Tạo service API (sử dụng với JWT token)
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No authentication token available');
    }
    
    // Tạm thời bỏ qua việc gọi API thực tế, trả về dữ liệu từ cache hoặc mẫu
    const cachedCategories = getFromStorage<Category[]>(STORAGE_KEYS.ALL_CATEGORIES);
    if (cachedCategories && cachedCategories.length > 0) {
      return cachedCategories;
    }
    
    return mockCategories;
  } catch (error) {
    console.error('Error in getCategories:', error);
    return mockCategories;
  }
};

/**
 * Lấy danh mục theo ID hoặc slug (không sử dụng hook)
 */
export const getCategory = async (idOrSlug: string): Promise<Category | null> => {
  try {
    // Từ cache
    const cachedCategory = getFromStorage<Category>(`${STORAGE_KEYS.CATEGORY_DETAIL}${idOrSlug}`);
    if (cachedCategory) {
      return cachedCategory;
    }
    
    // Từ dữ liệu mẫu
    return mockCategories.find(c => c.id === idOrSlug || c.slug === idOrSlug) || null;
  } catch (error) {
    console.error(`Error in getCategory (${idOrSlug}):`, error);
    return null;
  }
}; 