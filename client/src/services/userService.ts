import { useState } from 'react';
import { useApiService } from '@/services/apiService';
import { useAuth } from '@/hooks/use-auth';
import { useUser } from '@clerk/clerk-react';

// Định nghĩa kiểu dữ liệu cho User
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  created_at: string;
  updated_at?: string;
}

// Hook tùy chỉnh để sử dụng User API
export function useUserService() {
  const { get, post, put } = useApiService();
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Lấy thông tin user hiện tại từ API backend
   */
  const getCurrentUser = async (): Promise<User | null> => {
    if (!isSignedIn) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await get<User>('/users/me');
      return response;
    } catch (err) {
      console.error('Error fetching current user:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Cập nhật thông tin user
   */
  const updateUser = async (userData: Partial<User>): Promise<User | null> => {
    if (!isSignedIn) return null;
    
    const currentUser = await getCurrentUser();
    if (!currentUser) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await put<User>(`/users/${currentUser.id}`, userData);
      return response;
    } catch (err) {
      console.error('Error updating user:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Lấy token JWT hiện tại từ Clerk
   * Sử dụng khi cần token trực tiếp, ví dụ như để hiển thị trong Swagger UI
   */
  const getJwtToken = async (): Promise<string | null> => {
    try {
      if (!isSignedIn) return null;
      return await getToken();
    } catch (err) {
      console.error('Error getting JWT token:', err);
      return null;
    }
  };

  /**
   * Kiểm tra xem người dùng đã đăng nhập hay chưa và trả về thông tin cơ bản
   */
  const getUserInfo = () => {
    if (!isSignedIn || !user) return null;
    
    return {
      id: user.id,
      email: user.primaryEmailAddress?.emailAddress || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      imageUrl: user.imageUrl || '',
    };
  };

  const syncUserWithBackend = async (): Promise<User | null> => {
    if (!isSignedIn || !user) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Prepare user data for sync - không còn dùng profile_image_url
      const userData = {
        first_name: user.firstName || '',
        last_name: user.lastName || '',
      };
      
      // Call the sync endpoint
      const response = await post<User>('/users/sync', userData);
      return response;
    } catch (err) {
      console.error('Error syncing user with backend:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred during sync');
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getCurrentUser,
    syncUserWithBackend,
    updateUser,
    getJwtToken,
    getUserInfo,
    isLoading,
    error,
  };
}

/**
 * Component để hiển thị Token
 */
export function useTokenDisplay() {
  const { getJwtToken } = useUserService();
  const [token, setToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchAndDisplayToken = async () => {
    const jwt = await getJwtToken();
    setToken(jwt);
  };

  const copyToClipboard = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return {
    token,
    fetchAndDisplayToken,
    copyToClipboard,
    copied,
  };
} 