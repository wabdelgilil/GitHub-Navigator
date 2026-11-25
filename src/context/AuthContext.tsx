import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { githubClient } from '../lib/api/github-client';
import { tokenStorage } from '../lib/storage/token-storage';
import { GitHubRateLimit, GitHubUser } from '../types/github';

interface AuthContextType {
  token: string | null;
  user: GitHubUser | null;
  rateLimit: GitHubRateLimit | null;
  isLoading: boolean;
  error: string | null;
  setToken: (token: string) => Promise<boolean>;
  logout: () => void;
  refreshRateLimit: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(tokenStorage.getToken());
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [rateLimit, setRateLimit] = useState<GitHubRateLimit | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserAndQuota = useCallback(async (authToken: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const [userData, rateData] = await Promise.all([
        githubClient.getAuthenticatedUser(authToken),
        githubClient.getRateLimit(authToken),
      ]);
      setUser(userData);
      setRateLimit(rateData);
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication verification failed';
      setError(message);
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchUserAndQuota(token);
    } else {
      setIsLoading(false);
    }
  }, [token, fetchUserAndQuota]);

  const handleSetToken = async (newToken: string): Promise<boolean> => {
    tokenStorage.setToken(newToken);
    setTokenState(newToken);
    return fetchUserAndQuota(newToken);
  };

  const handleLogout = () => {
    tokenStorage.clearToken();
    setTokenState(null);
    setUser(null);
    setRateLimit(null);
    setError(null);
  };

  const handleRefreshRateLimit = async () => {
    if (!token) return;
    try {
      const rateData = await githubClient.getRateLimit(token);
      setRateLimit(rateData);
    } catch {
      // Ignore background refresh failure
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        rateLimit,
        isLoading,
        error,
        setToken: handleSetToken,
        logout: handleLogout,
        refreshRateLimit: handleRefreshRateLimit,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
