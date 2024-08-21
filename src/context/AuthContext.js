import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const restoreSession = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
    };

    restoreSession();
  }, []);

  const login = async ({token, role, userName}) => {
    if (token && role) {
      setIsAuthenticated(true);
      const userData = {token, role, userName};
      setUser(userData);
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

  const updateUser = async updatedUser => {
    setUser(updatedUser);
    await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{isAuthenticated, user, login, logout, updateUser}}>
      {children}
    </AuthContext.Provider>
  );
};
