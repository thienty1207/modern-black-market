import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Cập nhật state để lần render tiếp theo sẽ hiển thị UI fallback
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // UI mặc định cho lỗi
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-black text-white">
          <h1 className="text-3xl font-bold mb-4 text-red-500">Có lỗi xảy ra</h1>
          <p className="mb-6 text-center max-w-lg">
            Đã xảy ra lỗi trong quá trình tải ứng dụng. Vui lòng thử làm mới trang.
          </p>
          <div className="bg-gray-800 p-4 rounded-md overflow-auto max-w-full text-sm mb-6">
            <pre>{this.state.error?.toString()}</pre>
          </div>
          <button
            className="px-4 py-2 bg-accent text-black font-semibold rounded-md hover:bg-accent/80"
            onClick={() => window.location.reload()}
          >
            Làm mới trang
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 