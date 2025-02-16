import axios from 'axios';

const API_URL = 'http://localhost:3000/tags'; // Adres backendu

const logRequest = (action, url, data = null) => {
  console.log(`[${action}] Wywołanie endpointu ${url}`);
  if (data) {
    console.log(`[${action}] Wysłane dane:`, data);
  }
};

const logResponse = (action, response) => {
  console.log(`[${action}] Odpowiedź:`, response.data);
};

const logError = (action, error) => {
  console.error(`[${action}] Błąd:`, error.message);
};

// Pobranie wszystkich tagów (globalne + pacjenta)
export const getTags = async (token) => {
  const url = API_URL;
  logRequest('getTags', url);
  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    logResponse('getTags', response);
    return response.data;
  } catch (error) {
    logError('getTags', error);
    throw error;
  }
};

// Tworzenie nowego tagu (prywatnego)
export const createTag = async (token, tagData) => {
  const url = API_URL;
  logRequest('createTag', url, tagData);
  try {
    const response = await axios.post(url, tagData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    logResponse('createTag', response);
    return response.data;
  } catch (error) {
    logError('createTag', error);
    throw error;
  }
};

// Usuwanie tagu (tylko własne tagi)
export const deleteTag = async (token, tagId) => {
  const url = `${API_URL}/${tagId}`;
  logRequest('deleteTag', url);
  try {
    const response = await axios.delete(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    logResponse('deleteTag', response);
    return response.data;
  } catch (error) {
    logError('deleteTag', error);
    throw error;
  }
};
