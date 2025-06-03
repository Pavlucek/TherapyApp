// src/hooks/useUsers.js
import { useState, useEffect, useCallback } from 'react';
import { fetchUsersFromApi } from '../api/userApi';

const useUsers = (token) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = useCallback(async () => {
    if (!token) {
      console.log('Brak tokena – nie pobieram użytkowników');
      return;
    }
    console.log('Rozpoczynam pobieranie użytkowników...');
    setLoading(true);
    try {
      const data = await fetchUsersFromApi(token);
      console.log('Pobrane dane użytkowników:', data);
      setUsers(data);
    } catch (error) {
      console.error('Błąd pobierania użytkowników:', error);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    loadUsers();
  }, [token, loadUsers]);

  return { users, loading, refetch: loadUsers };
};

export default useUsers;
