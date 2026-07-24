import React, { createContext, useContext, useState, useEffect } from 'react';
import { localAPI } from '../api/localClient';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedUser = localAPI.utils.getCurrentUser();
        const hasToken = localAPI.utils.isAuthenticated();

        if (savedUser && hasToken) {
          setUser(savedUser);
          setIsAuthenticated(true);
          
          // Optionally validate token with backend
          try {
            await localAPI.auth.getCurrentUser();
          } catch (e) {
            // Token might be invalid, clear auth state
            logout();
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await localAPI.auth.login({ email, password });
      
      if (response.user && response.tokens) {
        // Save user data and tokens
        localAPI.utils.saveUserData(response.user, response.tokens);
        
        setUser(response.user);
        setIsAuthenticated(true);
        setError(null);
        
        return { success: true, data: response };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      const errorData = localAPI.utils.handleError(err);
      setError(errorData.message);
      return { success: false, error: errorData };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await localAPI.auth.register(userData);
      
      if (response.user && response.tokens) {
        // Save user data and tokens
        localAPI.utils.saveUserData(response.user, response.tokens);
        
        setUser(response.user);
        setIsAuthenticated(true);
        setError(null);
        
        return { success: true, data: response };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      const errorData = localAPI.utils.handleError(err);
      setError(errorData.message);
      return { success: false, error: errorData };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localAPI.auth.logout();
    localAPI.utils.clearUserData();
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  const updateProfile = async (userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await localAPI.auth.updateProfile(userData);
      
      if (response.user) {
        // Update user data in localStorage and state
        const updatedUser = { ...user, ...response.user };
        localAPI.utils.saveUserData(updatedUser, {});
        setUser(updatedUser);
        
        return { success: true, data: response };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      const errorData = localAPI.utils.handleError(err);
      setError(errorData.message);
      return { success: false, error: errorData };
    } finally {
      setIsLoading(false);
    }
  };

  const checkAuth = () => {
    const hasToken = localAPI.utils.isAuthenticated();
    const savedUser = localAPI.utils.getCurrentUser();
    
    setIsAuthenticated(hasToken && !!savedUser);
    return hasToken && !!savedUser;
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    checkAuth,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};