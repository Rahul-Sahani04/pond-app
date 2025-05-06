import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.31.21:3000/api';
console.log('API_URL:', process.env.EXPO_PUBLIC_API_URL);
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [error, setError] = useState(null);

  // If any error occurs, related to authentication, let the user log in again
  const handleError = (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('Error response:', error.response.data);
      setError(error.response.data.message || 'An error occurred');

      if (error.response.status === 401) {
        // Unauthorized error, clear token and redirect to login
        setUserToken(null);
        AsyncStorage.removeItem('userToken');
      }

      if (error.response.status === 403) {
        // Forbidden error, clear token and redirect to login
        setUserToken(null);
        AsyncStorage.removeItem('userToken');
      }

      if (error.response.status === 500) {
        // Internal server error, clear token and redirect to login
        setUserToken(null);
        AsyncStorage.removeItem('userToken');
      }
      

    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error request:', error.request);
      setError('No response from server');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
      setError(error.message);
    }
  }

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          setUserToken(token);
        }
      } catch (error) {
        console.error('Error checking auth state:', error);
        setError('An error occurred while checking authentication state');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthState();
  }
  , []);

  // Check Errors 
  useEffect(() => {
    if (error) {
      console.error('Authentication error:', error);
      handleError(error);
    }
  }
  , [error]);

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password
      });

      const { token } = response.data;
      
      await AsyncStorage.setItem('userToken', token);
      setUserToken(token);
      console.log('Login successful:', token);
      return true;
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred during login');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name, email, password) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.post(`${API_URL}/signup`, {
        name,
        email,
        password
      });

      return true;
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred during signup');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      setUserToken(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const isLoggedIn = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      setUserToken(token);
      return !!token;
    } catch (error) {
      console.error('Error checking auth state:', error);
      localStorage.removeItem('userToken');
      setUserToken(null);
      setError('An error occurred while checking authentication state');

      return false;
    } finally {
      setIsLoading(false);
    }
  };


  const clearError = () => setError(null);

  return (
    <AuthContext.Provider 
      value={{
        isLoading,
        userToken,
        error,
        login,
        signup,
        logout,
        isLoggedIn,
        clearError,
      }}
    >
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