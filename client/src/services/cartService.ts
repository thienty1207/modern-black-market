import { useState, useCallback, useEffect } from 'react';
import { useApiService } from './apiService';
import { Product } from './productService';

// Khai báo interface phù hợp với server
export interface CartItem {
  id: string;
  product_id: string;
  user_id: string;
  quantity: number;
  created_at?: string;
  updated_at?: string;
  product?: Product;
}

export interface Cart {
  id: string;
  user_id: string;
  items: CartItem[];
  total: number;
  created_at?: string;
  updated_at?: string;
}

// Storage keys for caching
const STORAGE_KEYS = {
  CART: 'cart_data',
  CART_ITEMS: 'cart_items',
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

/**
 * Hook tùy chỉnh để làm việc với giỏ hàng
 */
export const useCart = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const apiService = useApiService();

  // Tải giỏ hàng từ API
  const fetchCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const cartData = await apiService.get<Cart>('/carts/me');
      setCart(cartData);
      setItems(cartData.items || []);
      setError(null);
      
      // Lưu vào cache
      saveToStorage(STORAGE_KEYS.CART, cartData);
      saveToStorage(STORAGE_KEYS.CART_ITEMS, cartData.items || []);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      
      // Sử dụng dữ liệu từ cache nếu có
      const cachedCart = getFromStorage<Cart>(STORAGE_KEYS.CART);
      const cachedItems = getFromStorage<CartItem[]>(STORAGE_KEYS.CART_ITEMS);
      
      if (cachedCart) setCart(cachedCart);
      if (cachedItems) setItems(cachedItems);
    } finally {
      setIsLoading(false);
    }
  }, [apiService]);

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = useCallback(async (productId: string, quantity: number = 1) => {
    setIsLoading(true);
    try {
      const response = await apiService.post<CartItem>('/carts/items', {
        product_id: productId,
        quantity
      });
      
      // Cập nhật state và cache
      await fetchCart();
      return response;
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [apiService, fetchCart]);

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  const updateCartItem = useCallback(async (itemId: string, quantity: number) => {
    setIsLoading(true);
    try {
      const response = await apiService.put<CartItem>(`/carts/items/${itemId}`, {
        quantity
      });
      
      // Cập nhật state và cache
      await fetchCart();
      return response;
    } catch (err) {
      console.error('Error updating cart item:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [apiService, fetchCart]);

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = useCallback(async (itemId: string) => {
    setIsLoading(true);
    try {
      await apiService.del(`/carts/items/${itemId}`);
      
      // Cập nhật state và cache
      await fetchCart();
      return true;
    } catch (err) {
      console.error('Error removing from cart:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [apiService, fetchCart]);

  // Xóa toàn bộ giỏ hàng
  const clearCart = useCallback(async () => {
    setIsLoading(true);
    try {
      await apiService.del('/carts/clear');
      
      // Cập nhật state và cache
      setCart(null);
      setItems([]);
      saveToStorage(STORAGE_KEYS.CART, null);
      saveToStorage(STORAGE_KEYS.CART_ITEMS, []);
      return true;
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [apiService]);

  // Tính tổng số lượng sản phẩm trong giỏ hàng
  const getCartItemsCount = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  // Tính tổng giá trị giỏ hàng
  const getCartTotal = useCallback(() => {
    return cart?.total || 0;
  }, [cart]);

  // Tải giỏ hàng khi component mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return {
    cart,
    items,
    isLoading,
    error,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartItemsCount,
    getCartTotal,
  };
}; 