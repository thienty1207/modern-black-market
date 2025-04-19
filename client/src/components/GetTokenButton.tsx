import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';

const GetTokenButton = () => {
  const { getToken } = useAuth();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGetToken = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      
      if (token) {
        // Sao chép token vào clipboard
        await navigator.clipboard.writeText(token);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        
        // Log token vào console để dễ dàng truy cập
        console.log("JWT Token:", token);
      } else {
        console.error("Không thể lấy token");
      }
    } catch (error) {
      console.error("Lỗi khi lấy token:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGetToken}
      disabled={loading}
      className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-md flex items-center transition-colors"
    >
      {loading ? (
        <div className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Đang lấy token...
        </div>
      ) : copied ? (
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          Đã sao chép token
        </div>
      ) : (
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
          </svg>
          Lấy JWT Token
        </div>
      )}
    </button>
  );
};

export default GetTokenButton; 