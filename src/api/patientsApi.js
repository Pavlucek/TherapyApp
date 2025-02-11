// src/api/patientsApi.js
export const getPatients = async (token) => {
    try {
      const response = await fetch('http://localhost:3000/user/patients', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Błąd przy pobieraniu pacjentów');
      }
      return await response.json();
    } catch (error) {
      console.error('[getPatients] Błąd:', error);
      throw error;
    }
  };
