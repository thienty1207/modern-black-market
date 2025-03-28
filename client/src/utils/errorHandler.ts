import { toast } from 'sonner';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import React from 'react';

/**
 * Các loại lỗi phổ biến trong ứng dụng
 */
export enum ErrorType {
  NETWORK = 'network',
  AUTH = 'auth',
  SERVER = 'server',
  VALIDATION = 'validation',
  NOT_FOUND = 'not_found',
  UNKNOWN = 'unknown',
}

/**
 * Interface cho cấu trúc lỗi tiêu chuẩn
 */
export interface AppError {
  type: ErrorType;
  message: string;
  details?: string;
  code?: string | number;
  retry?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Phân loại lỗi dựa trên thông tin được cung cấp
 * @param error - Lỗi gốc
 * @returns Loại lỗi
 */
export function classifyError(error: unknown): ErrorType {
  if (error instanceof Error) {
    if (error.message.includes('network') || error.message.includes('fetch') || error.message.includes('connection')) {
      return ErrorType.NETWORK;
    }
    if (error.message.includes('unauthorized') || error.message.includes('forbidden') || error.message.includes('authentication')) {
      return ErrorType.AUTH;
    }
    if (error.message.includes('not found') || error.message.includes('404')) {
      return ErrorType.NOT_FOUND;
    }
    if (error.message.includes('validation') || error.message.includes('invalid')) {
      return ErrorType.VALIDATION;
    }
    if (error.message.includes('server') || error.message.includes('500')) {
      return ErrorType.SERVER;
    }
  }
  return ErrorType.UNKNOWN;
}

/**
 * Tạo thông báo lỗi dựa trên thông tin được cung cấp
 * @param error - Lỗi gốc
 * @returns Đối tượng AppError chuẩn
 */
export function createAppError(error: unknown): AppError {
  const errorType = classifyError(error);
  
  // Lấy thông báo lỗi cụ thể
  let message = 'Đã xảy ra lỗi không xác định';
  let details = '';
  
  if (error instanceof Error) {
    message = error.message;
    details = error.stack || '';
  } else if (typeof error === 'string') {
    message = error;
  } else if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    message = error.message;
  }
  
  // Tùy chỉnh thông báo dựa trên loại lỗi
  switch (errorType) {
    case ErrorType.NETWORK:
      message = 'Không thể kết nối đến máy chủ';
      details = 'Vui lòng kiểm tra kết nối internet của bạn và thử lại';
      break;
    case ErrorType.AUTH:
      message = 'Lỗi xác thực';
      details = 'Vui lòng đăng nhập lại để tiếp tục';
      break;
    case ErrorType.SERVER:
      message = 'Lỗi máy chủ';
      details = 'Máy chủ đang gặp vấn đề, vui lòng thử lại sau';
      break;
    case ErrorType.NOT_FOUND:
      message = 'Không tìm thấy dữ liệu';
      details = 'Dữ liệu bạn yêu cầu không tồn tại hoặc đã bị xóa';
      break;
    case ErrorType.VALIDATION:
      message = 'Dữ liệu không hợp lệ';
      details = 'Vui lòng kiểm tra lại thông tin đã nhập';
      break;
  }
  
  return {
    type: errorType,
    message,
    details,
  };
}

/**
 * Hiển thị thông báo lỗi sử dụng sonner
 * @param error - Lỗi cần hiển thị
 * @param title - Tiêu đề của thông báo (tùy chọn)
 */
export function showErrorToast(error: unknown, title?: string) {
  const appError = error instanceof Object && 'type' in error 
    ? error as AppError 
    : createAppError(error);
  
  const errorTitle = title || 'Đã xảy ra lỗi';
  
  // Sử dụng tên icon thay vì JSX để tránh lỗi
  let iconName: string;
  switch (appError.type) {
    case ErrorType.NETWORK:
    case ErrorType.SERVER:
      iconName = 'alert-triangle';
      break;
    case ErrorType.AUTH:
    case ErrorType.VALIDATION:
      iconName = 'info';
      break;
    default:
      iconName = 'alert-circle';
  }
  
  toast.error(errorTitle, {
    description: appError.message,
    // Không sử dụng JSX trực tiếp
    // icon sẽ được sonner xử lý với tên icon được cung cấp
    // hoặc không cần cung cấp icon, toast sẽ sử dụng icon mặc định
    duration: 5000,
    action: appError.action || (appError.retry ? {
      label: 'Thử lại',
      onClick: appError.retry,
    } : undefined),
  });
}

/**
 * Hiển thị thông báo thành công
 * @param message - Nội dung thông báo
 * @param title - Tiêu đề thông báo (tùy chọn)
 */
export function showSuccessToast(message: string, title: string = 'Thành công') {
  toast.success(title, {
    description: message,
  });
}

/**
 * Xử lý lỗi trong hàm async
 * @param promise - Promise cần xử lý
 * @param errorHandler - Hàm xử lý lỗi tùy chỉnh (tùy chọn)
 * @returns Kết quả của promise hoặc null nếu có lỗi
 */
export async function handleAsyncError<T>(
  promise: Promise<T>,
  errorHandler?: (error: AppError) => void
): Promise<T | null> {
  try {
    return await promise;
  } catch (error) {
    const appError = createAppError(error);
    
    // Hiển thị thông báo lỗi mặc định
    showErrorToast(appError);
    
    // Gọi handler tùy chỉnh nếu được cung cấp
    if (errorHandler) {
      errorHandler(appError);
    }
    
    // Ghi log lỗi
    console.error('Error caught by handleAsyncError:', appError);
    
    return null;
  }
} 