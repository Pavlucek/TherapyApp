import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const isTokenValid = (token) => {
    if (!token) {return false;}
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch (error) {
      return false;
    }
  };

  const logout = async () => {
    setIsAuthenticated(false);
    setUser(null);
    await AsyncStorage.removeItem('user');
  };

  // The login function now accepts additional fields
  const login = async ({ token, role, userName, patientId, therapistId, patients }) => {
    if (token && role) {
      const userData = { token, role, userName, patientId, therapistId, patients };
      setUser(userData);
      setIsAuthenticated(true);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  useEffect(() => {
    const restoreSession = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (isTokenValid(parsedUser.token)) {
          setUser(parsedUser);
          setIsAuthenticated(true);
        } else {
          logout();
        }
      }
    };

    restoreSession();
  }, []);

  // Check token validity every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (user?.token && !isTokenValid(user.token)) {
        logout();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [user]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
