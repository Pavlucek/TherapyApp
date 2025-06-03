import axios from 'axios';

const API_URL = 'http://localhost:3000/journal';

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

// 🟢 Pobranie wszystkich wpisów dziennika pacjenta
export const getJournalEntries = async (token) => {
  const url = API_URL;
  logRequest('getJournalEntries', url);
  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    logResponse('getJournalEntries', response);
    return response.data;
  } catch (error) {
    logError('getJournalEntries', error);
    throw error;
  }
};

// 🟢 Pobranie pojedynczego wpisu
export const getJournalEntryById = async (token, id) => {
  const url = `${API_URL}/${id}`;
  logRequest('getJournalEntryById', url);
  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    logResponse('getJournalEntryById', response);
    return response.data;
  } catch (error) {
    logError('getJournalEntryById', error);
    throw error;
  }
};

// 🟢 Dodanie nowego wpisu
export const createJournalEntry = async (token, entryData) => {
  const url = API_URL;
  logRequest('createJournalEntry', url, entryData);
  try {
    const response = await axios.post(url, entryData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    logResponse('createJournalEntry', response);
    return response.data;
  } catch (error) {
    logError('createJournalEntry', error);
    throw error;
  }
};

// 🟢 Aktualizacja wpisu
export const updateJournalEntry = async (token, id, updatedData) => {
  const url = `${API_URL}/${id}`;
  logRequest('updateJournalEntry', url, updatedData);
  try {
    const response = await axios.put(url, updatedData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    logResponse('updateJournalEntry', response);
    return response.data;
  } catch (error) {
    logError('updateJournalEntry', error);
    throw error;
  }
};

// 🟢 Usunięcie wpisu
export const deleteJournalEntry = async (token, id) => {
  const url = `${API_URL}/${id}`;
  logRequest('deleteJournalEntry', url);
  try {
    const response = await axios.delete(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    logResponse('deleteJournalEntry', response);
    return response.data;
  } catch (error) {
    logError('deleteJournalEntry', error);
    throw error;
  }
};

// --------------------
// REFLEKSJE
// --------------------

// 🟢 Dodanie refleksji do wpisu
export const addReflection = async (token, entryId, reflectionData) => {
  const url = `${API_URL}/${entryId}/reflections`;
  logRequest('addReflection', url, reflectionData);
  try {
    const response = await axios.post(url, reflectionData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    logResponse('addReflection', response);
    return response.data;
  } catch (error) {
    logError('addReflection', error);
    throw error;
  }
};

// 🟢 Pobranie refleksji przypisanych do wpisu
export const getReflections = async (token, entryId) => {
  const url = `${API_URL}/${entryId}/reflections`;
  logRequest('getReflections', url);
  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    logResponse('getReflections', response);
    return response.data;
  } catch (error) {
    logError('getReflections', error);
    throw error;
  }
};

// --------------------
// TAGI (przypisywanie do wpisów)
// --------------------

// 🟢 Przypisanie tagu do wpisu
export const addTagToEntry = async (token, entryId, tagId) => {
  const url = `${API_URL}/${entryId}/tags/${tagId}`;
  logRequest('addTagToEntry', url);
  try {
    const response = await axios.post(url, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    logResponse('addTagToEntry', response);
    return response.data;
  } catch (error) {
    logError('addTagToEntry', error);
    throw error;
  }
};

// 🟢 Usunięcie tagu z wpisu
export const removeTagFromEntry = async (token, entryId, tagId) => {
  const url = `${API_URL}/${entryId}/tags/${tagId}`;
  logRequest('removeTagFromEntry', url);
  try {
    const response = await axios.delete(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    logResponse('removeTagFromEntry', response);
    return response.data;
  } catch (error) {
    logError('removeTagFromEntry', error);
    throw error;
  }
};

export const getSharedJournalEntriesForPatient = async (patientId, token) => {
  const url = `${API_URL}/patient/${patientId}/shared`;
  logRequest('getSharedJournalEntriesForPatient', url);
  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    logResponse('getSharedJournalEntriesForPatient', response);
    return response.data;
  } catch (error) {
    logError('getSharedJournalEntriesForPatient', error);
    throw error;
  }
};
