import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const getAssignedPatients = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/patients/assigned`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('[getAssignedPatients] Odpowiedź:', response.data);
    return response.data;
  } catch (error) {
    console.error('[getAssignedPatients] Błąd:', error.message);
    throw error;
  }
};
