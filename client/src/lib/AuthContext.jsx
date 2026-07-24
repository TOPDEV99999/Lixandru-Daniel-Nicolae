import React, { createContext, useState, useContext, useEffect } from 'react';
import { localAPI } from '@/api/localClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false); // Not used in local backend
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [appPublicSettings, setAppPublicSettings] = useState(null); // Not used in local backend

  useEffect(() => {
    checkUserAuth();
  }, []);

  const checkUserAuth = async () => {
    try {
      setIsLoadingAuth(true);
      
      // Check if we have a token
      const hasToken = localAPI.utils.isAuthenticated();
      
      if (!hasToken) {
        setIsAuthenticated(false);
        setIsLoadingAuth(false);
        setAuthChecked(true);
        return;
      }

      // Try to get current user
      try {
        const response = await localAPI.auth.getCurrentUser();
        if (response.user) {
          setUser(response.user);
          setIsAuthenticated(true);
        } else {
          // Token might be invalid
          localAPI.utils.clearUserData();
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Failed to get current user:', error);
        localAPI.utils.clearUserData();
        setIsAuthenticated(false);
      }
      
      setIsLoadingAuth(false);
      setAuthChecked(true);
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
      setAuthChecked(true);
    }
  };

  const login = async (email, password) => {
    setIsLoadingAuth(true);
    setAuthError(null);
    
    try {
      const response = await localAPI.auth.login({ email, password });
      
      if (response.user && response.tokens) {
        localAPI.utils.saveUserData(response.user, response.tokens);
        setUser(response.user);
        setIsAuthenticated(true);
        setAuthError(null);
        return { success: true };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      const errorData = localAPI.utils.handleError(error);
      setAuthError({
        type: 'login_failed',
        message: errorData.message
      });
      return { success: false, error: errorData };
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const register = async (userData) => {
    setIsLoadingAuth(true);
    setAuthError(null);
    
    try {
      const response = await localAPI.auth.register(userData);
      
      if (response.user && response.tokens) {
        localAPI.utils.saveUserData(response.user, response.tokens);
        setUser(response.user);
        setIsAuthenticated(true);
        setAuthError(null);
        return { success: true };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      const errorData = localAPI.utils.handleError(error);
      setAuthError({
        type: 'registration_failed',
        message: errorData.message
      });
      return { success: false, error: errorData };
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const logout = (shouldRedirect = true) => {
    localAPI.auth.logout();
    localAPI.utils.clearUserData();
    setUser(null);
    setIsAuthenticated(false);
    setAuthError(null);
    
    if (shouldRedirect && typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  const navigateToLogin = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      authChecked,
      logout,
      navigateToLogin,
      checkUserAuth,
      checkAppState: checkUserAuth, // Alias for compatibility
      login,
      register
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
