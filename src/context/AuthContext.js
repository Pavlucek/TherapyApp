import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode'; // ✅ Poprawiony import

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const restoreSession = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (isTokenValid(parsedUser.token)) {
          setUser(parsedUser);
          setIsAuthenticated(true);
        } else {
          logout(); // ✅ Wylogowanie, jeśli token wygasł
        }
      }
    };

    restoreSession();
  }, []);

  const isTokenValid = (token) => {
    if (!token) {return false;}
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 > Date.now(); // ✅ Sprawdza, czy token jeszcze nie wygasł
    } catch (error) {
      return false;
    }
  };

  // ✅ Sprawdzanie ważności tokena co 10 sekund
  useEffect(() => {
    const interval = setInterval(() => {
      if (user?.token && !isTokenValid(user.token)) {
        logout();
      }
    }, 10000); // Co 10 sekund

    return () => clearInterval(interval);
  }, [user]);

  const login = async ({ token, role, userName }) => {
    if (token && role) {
      const userData = { token, role, userName };
      setUser(userData);
      setIsAuthenticated(true);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const logout = async () => {
    setIsAuthenticated(false);
    setUser(null);
    await AsyncStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
