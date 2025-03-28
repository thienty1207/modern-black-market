// Mock product data
export interface Product {
  id: number;
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
  featured?: boolean;
  updatedAt?: string;
  createdAt?: string;
  salesCount?: number;
}

// Mock products data
const products: Product[] = [
  {
    id: 1,
    name: "iPhone 13 Pro",
    price: 999,
    originalPrice: 1099,
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
  {
    id: 2,
    name: "Samsung Galaxy S22 Ultra",
    price: 1199,
    description: "The ultimate combination of the S series and Note series, with built-in S Pen, powerful camera, and long-lasting battery.",
    features: [
      "Dynamic AMOLED 2X display",
      "108MP wide camera",
      "S Pen included",
      "5000mAh battery"
    ],
    specs: {
      display: "6.8-inch Dynamic AMOLED 2X",
      chip: "Snapdragon 8 Gen 1",
      camera: "108MP wide, 12MP ultra-wide",
      battery: "5000mAh",
      storage: "128GB, 256GB, 512GB, 1TB"
    },
    images: [
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1610945264803-c22b62d2a7b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    ],
    category: "phones"
  },
  {
    id: 3,
    name: "Google Pixel 6 Pro",
    price: 899,
    description: "Experience the best of Google with the custom-built Google Tensor processor and advanced camera system.",
    features: [
      "Google Tensor chip",
      "50MP wide camera",
      "Android with Pixel exclusives",
      "4500mAh battery"
    ],
    specs: {
      display: "6.7-inch LTPO OLED",
      chip: "Google Tensor",
      camera: "50MP wide, 12MP ultra-wide",
      battery: "4500mAh",
      storage: "128GB, 256GB, 512GB"
    },
    images: [
      "https://images.unsplash.com/photo-1635870723802-e88d76ae324c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598965402089-897e93a166f2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    ],
    category: "phones"
  },
  {
    id: 4,
    name: "MacBook Pro 16",
    price: 2499,
    description: "Supercharged for pros. The most powerful MacBook Pro ever is here with the blazing-fast M1 Pro or M1 Max chip.",
    features: [
      "Apple M1 Pro or M1 Max chip",
      "Up to 64GB unified memory",
      "Up to 8TB storage",
      "Up to 21 hours battery life"
    ],
    specs: {
      display: "16-inch Liquid Retina XDR",
      chip: "M1 Pro or M1 Max",
      memory: "16GB, 32GB, or 64GB",
      storage: "512GB to 8TB SSD",
      battery: "Up to 21 hours"
    },
    images: [
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    ],
    category: "laptops",
    featured: true
  },
  {
    id: 5,
    name: "Dell XPS 15",
    price: 1799,
    description: "A stunning 15.6-inch InfinityEdge display in a compact form factor powered by 11th Gen Intel Core processors.",
    features: [
      "11th Gen Intel Core processors",
      "NVIDIA GeForce RTX 3050 Ti",
      "15.6-inch 4K UHD+ InfinityEdge display",
      "Up to 16 hours battery life"
    ],
    specs: {
      display: "15.6-inch 4K UHD+",
      processor: "11th Gen Intel Core i7/i9",
      graphics: "NVIDIA GeForce RTX 3050 Ti",
      memory: "16GB, 32GB, or 64GB",
      storage: "512GB to 2TB SSD"
    },
    images: [
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    ],
    category: "laptops"
  },
  {
    id: 6,
    name: "Razer Blade 15",
    price: 1999,
    originalPrice: 2199,
    description: "The world's smallest 15.6-inch gaming laptop with NVIDIA GeForce RTX graphics and 10th Gen Intel Core i7.",
    features: [
      "10th Gen Intel Core i7",
      "NVIDIA GeForce RTX 3080",
      "15.6-inch 360Hz display",
      "Per-key RGB lighting"
    ],
    specs: {
      display: "15.6-inch FHD 360Hz",
      processor: "10th Gen Intel Core i7",
      graphics: "NVIDIA GeForce RTX 3080",
      memory: "16GB or 32GB",
      storage: "1TB SSD"
    },
    images: [
      "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1601406984081-bd6b491c0436?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    ],
    category: "laptops"
  },
  {
    id: 7,
    name: "Sony Alpha a7 IV",
    price: 2499,
    description: "A full-frame hybrid camera with outstanding still image quality and evolved video technology for creators.",
    features: [
      "33MP full-frame Exmor R CMOS sensor",
      "BIONZ XR processor",
      "4K 60p video recording",
      "10-bit 4:2:2 color sampling"
    ],
    specs: {
      sensor: "33MP full-frame Exmor R CMOS",
      processor: "BIONZ XR",
      iso: "100-51,200 (expandable)",
      autofocus: "759-point phase-detection AF",
      stabilization: "5-axis in-body"
    },
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    ],
    category: "cameras",
    featured: true
  },
  {
    id: 8,
    name: "Canon EOS R5",
    price: 3899,
    description: "A revolutionary full-frame mirrorless camera that delivers uncompromising image quality and 8K video recording.",
    features: [
      "45MP full-frame CMOS sensor",
      "DIGIC X processor",
      "8K RAW video recording",
      "5-axis in-body image stabilization"
    ],
    specs: {
      sensor: "45MP full-frame CMOS",
      processor: "DIGIC X",
      iso: "100-51,200 (expandable)",
      autofocus: "Dual Pixel CMOS AF II",
      stabilization: "5-axis in-body"
    },
    images: [
      "https://images.unsplash.com/photo-1581591524425-c7e0978865fc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1491796014055-e6835cdcd4c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    ],
    category: "cameras"
  },
  {
    id: 9,
    name: "Nikon Z6 II",
    price: 1999,
    originalPrice: 2199,
    description: "A versatile full-frame mirrorless camera built for demanding creators with improved speed, power, and low-light performance.",
    features: [
      "24.5MP BSI CMOS sensor",
      "Dual EXPEED 6 processors",
      "4K UHD video at 60p",
      "5-axis in-body image stabilization"
    ],
    specs: {
      sensor: "24.5MP BSI CMOS",
      processor: "Dual EXPEED 6",
      iso: "100-51,200 (expandable)",
      autofocus: "273-point phase-detection AF",
      stabilization: "5-axis in-body"
    },
    images: [
      "https://images.unsplash.com/photo-1584714268709-c3dd9c92b378?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1516724562728-afc824a36e84?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    ],
    category: "cameras"
  }
];

// Constant keys for localStorage
const STORAGE_KEYS = {
  ALL_PRODUCTS: 'all_products',
  CATEGORY_PREFIX: 'category_',
  FEATURED_PRODUCTS: 'featured_products'
};

// Helper - Lưu dữ liệu vào localStorage
const saveToStorage = (key: string, data: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Helper - Lấy dữ liệu từ localStorage
const getFromStorage = <T>(key: string): T | null => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

// Helper - Cung cấp dữ liệu đồng bộ nếu có
const getSyncData = <T>(key: string, fallbackData: T): T => {
  const cachedData = getFromStorage<T>(key);
  if (cachedData) {
    return cachedData;
  }
  
  // Nếu không có dữ liệu cached, lưu dữ liệu fallback và trả về
  saveToStorage(key, fallbackData);
  return fallbackData;
};

// Mock API delay with timeout to prevent hanging
const mockApiDelay = (timeout = 500) => {
  return new Promise<void>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      resolve();
    }, timeout);
    
    // Safety timeout to prevent hanging requests
    const safetyTimeout = setTimeout(() => {
      clearTimeout(timeoutId);
      reject(new Error('API request timed out'));
    }, timeout + 1000);
    
    // Clear safety timeout when regular timeout completes
    setTimeout(() => clearTimeout(safetyTimeout), timeout + 10);
  });
};

// Service functions
export const getProducts = async (): Promise<Product[]> => {
  try {
    // Trả về dữ liệu từ localStorage ngay lập tức nếu có
    const cachedProducts = getFromStorage<Product[]>(STORAGE_KEYS.ALL_PRODUCTS);
    if (cachedProducts) {
      // Vẫn gọi API để cập nhật cache sau đó
      mockApiDelay().then(() => {
        saveToStorage(STORAGE_KEYS.ALL_PRODUCTS, products);
      }).catch(error => {
        console.warn('Background cache update failed:', error);
      });
      
      return cachedProducts;
    }
    
    await mockApiDelay();
    
    // Lưu vào cache và trả về dữ liệu
    saveToStorage(STORAGE_KEYS.ALL_PRODUCTS, products);
    return products;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    
    // Trong trường hợp lỗi, vẫn thử trả về từ localStorage
    const cachedProducts = getFromStorage<Product[]>(STORAGE_KEYS.ALL_PRODUCTS);
    if (cachedProducts) {
      return cachedProducts;
    }
    
    // Nếu không có cache, trả về mảng rỗng để tránh lỗi ứng dụng
    return [];
  }
};

// Hàm đồng bộ để lấy sản phẩm - dùng khi cần kết quả ngay lập tức
export const getProductsSync = (): Product[] => {
  return getSyncData(STORAGE_KEYS.ALL_PRODUCTS, products);
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    // Cache key cho danh mục cụ thể
    const cacheKey = `${STORAGE_KEYS.CATEGORY_PREFIX}${category}`;
    
    // Trả về từ cache nếu có
    const cachedCategoryProducts = getFromStorage<Product[]>(cacheKey);
    if (cachedCategoryProducts) {
      // Vẫn cập nhật cache ngầm
      mockApiDelay().then(() => {
        const filteredProducts = products.filter(product => product.category === category);
        saveToStorage(cacheKey, filteredProducts);
      }).catch(error => {
        console.warn(`Background cache update for category ${category} failed:`, error);
      });
      
      return cachedCategoryProducts;
    }
    
    await mockApiDelay();
    
    const filteredProducts = products.filter(product => product.category === category);
    saveToStorage(cacheKey, filteredProducts);
    return filteredProducts;
  } catch (error) {
    console.error(`Failed to fetch products for category ${category}:`, error);
    
    // Trong trường hợp lỗi, vẫn thử trả về từ localStorage
    const cacheKey = `${STORAGE_KEYS.CATEGORY_PREFIX}${category}`;
    const cachedCategoryProducts = getFromStorage<Product[]>(cacheKey);
    
    if (cachedCategoryProducts) {
      return cachedCategoryProducts;
    }
    
    // Nếu không có cache, trả về tất cả sản phẩm và filter ở client
    const allProducts = getProductsSync();
    return allProducts.filter(product => product.category === category);
  }
};

// Hàm đồng bộ để lấy sản phẩm theo danh mục
export const getProductsByCategorySync = (category: string): Product[] => {
  const cacheKey = `${STORAGE_KEYS.CATEGORY_PREFIX}${category}`;
  const cachedProducts = getFromStorage<Product[]>(cacheKey);
  
  if (cachedProducts) {
    return cachedProducts;
  }
  
  const filteredProducts = products.filter(product => product.category === category);
  saveToStorage(cacheKey, filteredProducts);
  return filteredProducts;
};

export const getProductById = async (id: number): Promise<Product | undefined> => {
  try {
    // Trước tiên kiểm tra nếu tất cả sản phẩm đã được cache
    const allProducts = getProductsSync();
    const foundProduct = allProducts.find(product => product.id === id);
    
    if (foundProduct) {
      return foundProduct;
    }
    
    // Nếu không tìm thấy trong cache, gọi API
    await mockApiDelay();
    return products.find(product => product.id === id);
  } catch (error) {
    console.error(`Failed to fetch product with id ${id}:`, error);
    
    // Cố gắng tìm trong dữ liệu mockup bất kể lỗi
    return products.find(product => product.id === id);
  }
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    // Trả về từ cache nếu có
    const cachedFeaturedProducts = getFromStorage<Product[]>(STORAGE_KEYS.FEATURED_PRODUCTS);
    if (cachedFeaturedProducts) {
      // Vẫn cập nhật cache ngầm
      mockApiDelay().then(() => {
        const featuredProducts = products.filter(product => product.featured);
        saveToStorage(STORAGE_KEYS.FEATURED_PRODUCTS, featuredProducts);
      }).catch(error => {
        console.warn('Background cache update for featured products failed:', error);
      });
      
      return cachedFeaturedProducts;
    }
    
    await mockApiDelay();
    
    const featuredProducts = products.filter(product => product.featured);
    saveToStorage(STORAGE_KEYS.FEATURED_PRODUCTS, featuredProducts);
    return featuredProducts;
  } catch (error) {
    console.error('Failed to fetch featured products:', error);
    
    // Trong trường hợp lỗi, vẫn thử trả về từ localStorage
    const cachedFeaturedProducts = getFromStorage<Product[]>(STORAGE_KEYS.FEATURED_PRODUCTS);
    
    if (cachedFeaturedProducts) {
      return cachedFeaturedProducts;
    }
    
    // Nếu không có cache, trả về từ dữ liệu mockup
    return products.filter(product => product.featured);
  }
};

// Hàm đồng bộ để lấy sản phẩm nổi bật
export const getFeaturedProductsSync = (): Product[] => {
  const cachedProducts = getFromStorage<Product[]>(STORAGE_KEYS.FEATURED_PRODUCTS);
  
  if (cachedProducts) {
    return cachedProducts;
  }
  
  const featuredProducts = products.filter(product => product.featured);
  saveToStorage(STORAGE_KEYS.FEATURED_PRODUCTS, featuredProducts);
  return featuredProducts;
};
