import { useState, useEffect } from 'react';
import { fetchUsersFromApi } from '../api/userApi';

const useUsers = (token) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {return;} // Jeśli nie ma tokena, nie pobieramy danych

    const loadUsers = async () => {
      setLoading(true);
      const data = await fetchUsersFromApi(token);
      setUsers(data);
      setLoading(false);
    };

    loadUsers();
  }, [token]);

  return { users, loading };
};

export default useUsers;
