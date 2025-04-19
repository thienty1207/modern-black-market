import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Clipboard, Check, Copy, ChevronDown, ChevronUp, X } from 'lucide-react';

interface DebugTokenDisplayProps {
  showByDefault?: boolean;
}

const DebugTokenDisplay = ({ showByDefault = false }: DebugTokenDisplayProps) => {
  const { getJwtToken } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(showByDefault);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchToken = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const jwt = await getJwtToken();
      setToken(jwt);
      if (!jwt) {
        setError('Could not retrieve JWT token');
      }
    } catch (err) {
      console.error('Error fetching token:', err);
      setError(err instanceof Error ? err.message : 'Unknown error fetching token');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
    if (!isVisible && !token) {
      fetchToken();
    }
  };

  return (
    <Card className="bg-black/60 border border-purple-500/30 p-4 mb-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Clipboard className="h-4 w-4 mr-2 text-purple-400" />
          <h3 className="text-sm font-medium text-white">JWT Token Debug</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleVisibility}
          className="h-7 p-0 px-2 text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
        >
          {isVisible ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>
      
      {isVisible && (
        <div className="mt-2">
          <div className="flex space-x-2 mb-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchToken}
              className="h-7 px-2 text-xs bg-transparent border-purple-500/40 hover:bg-purple-900/20 text-purple-300"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Refresh Token'}
            </Button>
            
            {token && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={copyToClipboard}
                className="h-7 px-2 text-xs bg-transparent border-purple-500/40 hover:bg-purple-900/20 text-purple-300"
              >
                {isCopied ? (
                  <>
                    <Check className="h-3 w-3 mr-1" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 mr-1" /> Copy
                  </>
                )}
              </Button>
            )}
          </div>
          
          {error && (
            <div className="p-2 bg-red-900/20 border border-red-800/30 rounded text-red-300 text-xs mb-2">
              <X className="inline-block h-3 w-3 mr-1" /> {error}
            </div>
          )}
          
          {token ? (
            <div className="bg-black/70 border border-purple-500/20 rounded p-2 overflow-x-auto max-h-24">
              <pre className="text-xs text-gray-300 whitespace-pre-wrap break-all">{token}</pre>
            </div>
          ) : !isLoading && !error ? (
            <div className="text-xs text-gray-400 italic">
              Click "Refresh Token" to retrieve the JWT token
            </div>
          ) : null}
        </div>
      )}
    </Card>
  );
};

export default DebugTokenDisplay; 