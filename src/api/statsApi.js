// src/api/statsApi.js

export const fetchStats = async (token) => {
    try {
      const response = await fetch('http://localhost:3000/api/stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Błąd przy pobieraniu statystyk');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('[fetchStats] Błąd:', error);
      throw error;
    }
  };
  