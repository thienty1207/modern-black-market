import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';

const TokenDisplay = () => {
  const [token, setToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isSignedIn, getJwtToken, copyTokenToClipboard } = useAuth();

  useEffect(() => {
    const fetchToken = async () => {
      if (isSignedIn) {
        setLoading(true);
        try {
          const jwt = await getJwtToken();
          setToken(jwt);
        } catch (error) {
          console.error('Error fetching token:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setToken(null);
        setLoading(false);
      }
    };

    fetchToken();
  }, [isSignedIn, getJwtToken]);

  const handleCopyToken = async () => {
    const success = await copyTokenToClipboard();
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="p-4 rounded-lg bg-black/40 border border-purple-500/30 shadow-md text-center">
        <p className="text-white">Bạn cần đăng nhập để lấy token JWT</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4 rounded-lg bg-black/40 border border-purple-500/30 shadow-md text-center">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-purple-500/20 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-purple-500/20 rounded w-full"></div>
            <div className="h-4 bg-purple-500/20 rounded w-full"></div>
          </div>
        </div>
        <p className="text-purple-300 mt-2">Đang tải token...</p>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-lg bg-black/40 border border-purple-500/30 shadow-md">
      <h3 className="text-lg font-medium text-purple-300 mb-2">JWT Token của bạn</h3>
      
      <div className="bg-black/60 p-3 rounded border border-purple-500/20 overflow-hidden">
        <div className="max-h-24 overflow-y-auto custom-scrollbar font-mono text-xs text-purple-200 break-all">
          {token}
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-purple-200">
            Sử dụng token này trong Swagger UI để xác thực
          </p>
          <p className="text-xs text-purple-400 mt-1">
            Format: <code className="bg-black/40 px-1 rounded">Bearer {"{token}"}</code>
          </p>
        </div>
        
        <button
          onClick={handleCopyToken}
          className="ml-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm flex items-center transition-colors duration-200"
        >
          {copied ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Đã sao chép
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Sao chép
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default TokenDisplay; 