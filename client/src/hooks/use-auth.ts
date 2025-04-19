import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';
import { useApiService } from '@/services/apiService';
import { useUserService, User } from '@/services/userService';
import { useState, useEffect, useCallback } from 'react';

const DEBUG_MODE = import.meta.env.VITE_DEBUG_MODE === 'true';

/**
 * Hook tùy chỉnh kết hợp xác thực Clerk và dữ liệu người dùng từ backend API
 */
export function useAuth() {
  const { isSignedIn, isLoaded, user } = useUser();
  const { getToken } = useClerkAuth();
  const api = useApiService();
  const { 
    getCurrentUser, 
    syncUserWithBackend,
    isLoading: isLoadingUserService,
    error: userServiceError 
  } = useUserService();
  
  const [backendUser, setBackendUser] = useState<User | null>(null);
  const [isLoadingBackendUser, setIsLoadingBackendUser] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'failed'>('idle');

  // Helper for debug logging
  const logDebug = (...args: any[]) => {
    if (DEBUG_MODE) {
      console.log('[Auth Debug]', ...args);
    }
  };

  // Fetch the user data from the backend
  const fetchBackendUser = useCallback(async () => {
    if (!isSignedIn || !isLoaded) {
      logDebug('Not signed in or not loaded yet, skipping backend fetch');
      return;
    }

    logDebug('Fetching backend user data');
    setIsLoadingBackendUser(true);
    setError(null);

    try {
      const userData = await getCurrentUser();
      logDebug('Backend user data:', userData);
      setBackendUser(userData);
      return userData;
    } catch (err) {
      logDebug('Error fetching backend user:', err);
      setError(err instanceof Error ? err.message : 'Error fetching user data');
      return null;
    } finally {
      setIsLoadingBackendUser(false);
    }
  }, [isSignedIn, isLoaded, getCurrentUser]);

  // Sync user data from Clerk to backend
  const syncUserWithBackendHandler = useCallback(async () => {
    if (!isSignedIn || !isLoaded || !user) {
      logDebug('Not signed in, loaded, or no user data, skipping sync');
      return null;
    }

    logDebug('Syncing user data with backend');
    setSyncStatus('syncing');

    try {
      const syncedUser = await syncUserWithBackend();
      if (syncedUser) {
        logDebug('User synced successfully', syncedUser);
        setBackendUser(syncedUser);
        setSyncStatus('synced');
        return syncedUser;
      } else {
        logDebug('Sync failed - no user returned');
        setSyncStatus('failed');
        setError('Failed to sync user data with backend');
        return null;
      }
    } catch (err) {
      logDebug('Error syncing user with backend:', err);
      setSyncStatus('failed');
      setError(err instanceof Error ? err.message : 'Error syncing user data');
      return null;
    }
  }, [isSignedIn, isLoaded, user, syncUserWithBackend]);

  // Fetch backend user whenever user signs in or user info changes
  useEffect(() => {
    if (isSignedIn && isLoaded && user) {
      logDebug('User signed in or info changed, fetching backend user');
      fetchBackendUser().then((fetchedUser) => {
        if (!fetchedUser) {
          logDebug('No user found in backend, will attempt to sync');
          syncUserWithBackendHandler();
        } else {
          // Kiểm tra xem thông tin có thay đổi không và đồng bộ lại nếu cần
          const needsSync = fetchedUser &&
            (fetchedUser.first_name !== user.firstName ||
             fetchedUser.last_name !== user.lastName);
          
          if (needsSync) {
            logDebug('User info changed in Clerk, syncing with backend');
            syncUserWithBackendHandler();
          } else {
            logDebug('User found in backend, sync not needed');
            setSyncStatus('synced');
          }
        }
      });
    } else {
      logDebug('User not signed in or not loaded, clearing backend user');
      setBackendUser(null);
      setSyncStatus('idle');
    }
  }, [isSignedIn, isLoaded, user?.firstName, user?.lastName, fetchBackendUser, syncUserWithBackendHandler]);

  // Check if user is synced with backend
  const isSyncedWithBackend = useCallback(() => {
    return syncStatus === 'synced' && backendUser !== null;
  }, [syncStatus, backendUser]);

  // Get JWT token for API calls
  const getJwtToken = useCallback(async (): Promise<string | null> => {
    if (!isSignedIn) {
      logDebug('Not signed in, cannot get token');
      return null;
    }
    
    try {
      const token = await getToken();
      logDebug('Retrieved JWT token');
      return token;
    } catch (err) {
      logDebug('Error getting JWT token:', err);
      setError(err instanceof Error ? err.message : 'Error getting authentication token');
      return null;
    }
  }, [isSignedIn, getToken]);

  // Copy token to clipboard (useful for debugging)
  const copyTokenToClipboard = useCallback(async (): Promise<boolean> => {
    const token = await getJwtToken();
    if (token) {
      await navigator.clipboard.writeText(token);
      logDebug('Token copied to clipboard');
      return true;
    }
    return false;
  }, [getJwtToken]);

  // Get combined user info from Clerk and backend
  const getUserInfo = useCallback(() => {
    if (!isSignedIn || !user) {
      return null;
    }

    return {
      // Clerk user data
      clerkId: user.id,
      email: user.primaryEmailAddress?.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      
      // Backend user data (if available)
      ...(backendUser && {
        id: backendUser.id,
        backendEmail: backendUser.email,
        backendFirstName: backendUser.first_name,
        backendLastName: backendUser.last_name,
        createdAt: backendUser.created_at,
        updatedAt: backendUser.updated_at,
      }),
    };
  }, [isSignedIn, user, backendUser]);

  return {
    isSignedIn,
    isLoaded,
    isLoadingBackendUser: isLoadingBackendUser || isLoadingUserService,
    backendUser,
    error: error || userServiceError,
    syncStatus,
    fetchBackendUser,
    syncUserWithBackend: syncUserWithBackendHandler,
    isSyncedWithBackend,
    getJwtToken,
    copyTokenToClipboard,
    getUserInfo,
  };
} 