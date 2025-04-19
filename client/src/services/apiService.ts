import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

// Định nghĩa URL cơ sở cho API từ biến môi trường
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const DEBUG_MODE = import.meta.env.VITE_DEBUG_MODE === 'true';

// Tạo instance axios với các cấu hình mặc định
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper để log thông tin debug
const logDebug = (message: string, data?: any) => {
  if (DEBUG_MODE) {
    console.log(`[API] ${message}`, data);
  }
};

/**
 * Tạo một API service với authentication token
 * Đây là một hook custom, sử dụng useAuth từ Clerk để lấy token
 */
export const useApiService = () => {
  const { getToken } = useAuth();

  /**
   * Thực hiện request GET đến API endpoint với JWT authentication
   */
  const get = async <T>(endpoint: string): Promise<T> => {
    try {
      logDebug(`Fetching GET ${endpoint}`);
      const token = await getToken();
      
      if (!token) {
        logDebug('No token available');
        throw new Error('Authentication required');
      }
      
      // Log complete URL being requested for debugging purposes
      const fullUrl = `${API_BASE_URL}${endpoint}`; 
      console.log(`Making authenticated API request to: ${fullUrl}`);
      
      const response = await apiClient.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      logDebug(`GET ${endpoint} successful`, response.data);
      return response.data as T;
    } catch (error) {
      logAndHandleError('GET', endpoint, error);
      
      // Additional detailed error logging
      if (axios.isAxiosError(error)) {
        console.error(`Authenticated API Error Details:`, {
          endpoint: endpoint,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data, 
          message: error.message,
          requestURL: error.config?.url,
          requestMethod: error.config?.method
        });
        
        if (error.response?.status === 404) {
          console.error(`API endpoint not found - check if the endpoint '${endpoint}' exists on the server`);
        } else if (error.response?.status === 401) {
          console.error(`Authentication error - token may be invalid or expired`);
        } else if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
          console.error(`Network error - check if the API server is running at ${API_BASE_URL}`);
        }
      }
      
      throw error;
    }
  };

  /**
   * Thực hiện request POST đến API endpoint với JWT authentication
   */
  const post = async <T>(endpoint: string, data: any): Promise<T> => {
    try {
      logDebug(`Sending POST ${endpoint}`, data);
      const token = await getToken();
      
      if (!token) {
        logDebug('No token available');
        throw new Error('Authentication required');
      }
      
      const response = await apiClient.post(endpoint, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      logDebug(`POST ${endpoint} successful`, response.data);
      return response.data as T;
    } catch (error) {
      logAndHandleError('POST', endpoint, error);
      throw error;
    }
  };

  /**
   * Thực hiện request PUT đến API endpoint với JWT authentication
   */
  const put = async <T>(endpoint: string, data: any): Promise<T> => {
    try {
      logDebug(`Sending PUT ${endpoint}`, data);
      const token = await getToken();
      
      if (!token) {
        logDebug('No token available');
        throw new Error('Authentication required');
      }
      
      const response = await apiClient.put(endpoint, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      logDebug(`PUT ${endpoint} successful`, response.data);
      return response.data as T;
    } catch (error) {
      logAndHandleError('PUT', endpoint, error);
      throw error;
    }
  };

  /**
   * Thực hiện request DELETE đến API endpoint với JWT authentication
   */
  const del = async <T>(endpoint: string): Promise<T> => {
    try {
      logDebug(`Sending DELETE ${endpoint}`);
      const token = await getToken();
      
      if (!token) {
        logDebug('No token available');
        throw new Error('Authentication required');
      }
      
      const response = await apiClient.delete(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      logDebug(`DELETE ${endpoint} successful`, response.data);
      return response.data as T;
    } catch (error) {
      logAndHandleError('DELETE', endpoint, error);
      throw error;
    }
  };

  return {
    get,
    post,
    put,
    del,
  };
};

/**
 * Tạo một non-hook API service cho các component không phải React hoặc nơi không thể sử dụng hooks
 * Lưu ý: Function này cần một token được truyền vào
 */
export const createApiService = (token: string) => {
  /**
   * Thực hiện request GET đến API endpoint với JWT authentication
   */
  const get = async <T>(endpoint: string): Promise<T> => {
    try {
      const response = await apiClient.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data as T;
    } catch (error) {
      console.error('API GET error:', error);
      throw error;
    }
  };

  /**
   * Thực hiện request POST đến API endpoint với JWT authentication
   */
  const post = async <T>(endpoint: string, data: any): Promise<T> => {
    try {
      const response = await apiClient.post(endpoint, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data as T;
    } catch (error) {
      console.error('API POST error:', error);
      throw error;
    }
  };

  /**
   * Thực hiện request PUT đến API endpoint với JWT authentication
   */
  const put = async <T>(endpoint: string, data: any): Promise<T> => {
    try {
      const response = await apiClient.put(endpoint, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data as T;
    } catch (error) {
      console.error('API PUT error:', error);
      throw error;
    }
  };

  /**
   * Thực hiện request DELETE đến API endpoint với JWT authentication
   */
  const del = async <T>(endpoint: string): Promise<T> => {
    try {
      const response = await apiClient.delete(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data as T;
    } catch (error) {
      console.error('API DELETE error:', error);
      throw error;
    }
  };

  return {
    get,
    post,
    put,
    del,
  };
};

/**
 * API cho public endpoints (không yêu cầu xác thực)
 */
export const publicApi = {
  get: async <T>(endpoint: string): Promise<T> => {
    try {
      logDebug(`Fetching public GET ${endpoint}`);
      
      // Log complete URL being requested for debugging purposes
      const fullUrl = `${API_BASE_URL}${endpoint}`; 
      console.log(`Making public API request to: ${fullUrl}`);
      
      const response = await apiClient.get(endpoint);
      logDebug(`Public GET ${endpoint} successful`, response.data);
      return response.data as T;
    } catch (error) {
      logAndHandleError('Public GET', endpoint, error);
      
      // Additional detailed error logging
      if (axios.isAxiosError(error)) {
        console.error(`API Error Details:`, {
          endpoint: endpoint,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data, 
          message: error.message,
          requestURL: error.config?.url,
          requestMethod: error.config?.method
        });
        
        if (error.response?.status === 404) {
          console.error(`API endpoint not found - check if the endpoint '${endpoint}' exists on the server`);
        } else if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
          console.error(`Network error - check if the API server is running at ${API_BASE_URL}`);
        }
      }
      
      throw error;
    }
  },

  post: async <T>(endpoint: string, data: any): Promise<T> => {
    try {
      logDebug(`Sending public POST ${endpoint}`, data);
      const response = await apiClient.post(endpoint, data);
      logDebug(`Public POST ${endpoint} successful`, response.data);
      return response.data as T;
    } catch (error) {
      logAndHandleError('Public POST', endpoint, error);
      throw error;
    }
  },
  
  put: async <T>(endpoint: string, data: any): Promise<T> => {
    try {
      logDebug(`Sending public PUT ${endpoint}`, data);
      const response = await apiClient.put(endpoint, data);
      logDebug(`Public PUT ${endpoint} successful`, response.data);
      return response.data as T;
    } catch (error) {
      logAndHandleError('Public PUT', endpoint, error);
      throw error;
    }
  },
  
  delete: async <T>(endpoint: string): Promise<T> => {
    try {
      logDebug(`Sending public DELETE ${endpoint}`);
      const response = await apiClient.delete(endpoint);
      logDebug(`Public DELETE ${endpoint} successful`, response.data);
      return response.data as T;
    } catch (error) {
      logAndHandleError('Public DELETE', endpoint, error);
      throw error;
    }
  }
};

/**
 * Helper để log và xử lý lỗi API
 */
const logAndHandleError = (method: string, endpoint: string, error: any) => {
  if (axios.isAxiosError(error)) {
    // Chi tiết về lỗi Axios
    const status = error.response?.status;
    const responseData = error.response?.data;
    
    logDebug(`${method} ${endpoint} failed with status ${status}`, {
      data: responseData,
      config: error.config,
    });
    
    // Tùy chỉnh thông báo lỗi dựa trên mã trạng thái
    if (status === 401) {
      console.error('Unauthorized: Please login again');
    } else if (status === 403) {
      console.error('Forbidden: You do not have permission to access this resource');
    } else if (status === 404) {
      console.error(`Resource not found: ${endpoint}`);
    } else if (status === 500) {
      console.error('Server error. Please try again later');
    }
  } else {
    // Lỗi không phải từ Axios
    console.error(`${method} ${endpoint} error:`, error);
  }
}; 