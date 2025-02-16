// api/sessionsApi.js
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const logRequest = (action, url, data = null) => {
  console.log(`[${action}] Wywołanie endpointu ${url}`);
  if (data) {console.log(`[${action}] Wysłane dane:`, data);}
};

const logResponse = (action, response) => {
  console.log(`[${action}] Odpowiedź:`, response.data);
};

const logError = (action, error) => {
  console.error(`[${action}] Błąd:`, error.message);
};

// API dla sesji
const sessionsApi = {
  // Tworzenie nowej sesji (POST /sessions)
  createSession: async (sessionData, token) => {
    const url = `${API_BASE}/sessions`;
    logRequest('createSession', url, sessionData);
    try {
      const response = await axios.post(url, sessionData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      logResponse('createSession', response);
      return response.data;
    } catch (error) {
      logError('createSession', error);
      throw error;
    }
  },

  // Pobranie wszystkich sesji (GET /sessions)
  getSessions: async (token) => {
    const url = `${API_BASE}/sessions`;
    logRequest('getSessions', url);
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      logResponse('getSessions', response);
      return response.data;
    } catch (error) {
      logError('getSessions', error);
      throw error;
    }
  },

  // Pobranie pojedynczej sesji wraz z dokumentami i materiałami (GET /sessions/:id)
  getSession: async (id, token) => {
    const url = `${API_BASE}/sessions/${id}`;
    logRequest('getSession', url);
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      logResponse('getSession', response);
      return response.data;
    } catch (error) {
      logError('getSession', error);
      throw error;
    }
  },

  // Aktualizacja sesji (PUT /sessions/:id)
  updateSession: async (id, sessionData, token) => {
    const url = `${API_BASE}/sessions/${id}`;
    logRequest('updateSession', url, sessionData);
    try {
      const response = await axios.put(url, sessionData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      logResponse('updateSession', response);
      return response.data;
    } catch (error) {
      logError('updateSession', error);
      throw error;
    }
  },

  // Usunięcie sesji (DELETE /sessions/:id)
  deleteSession: async (id, token) => {
    const url = `${API_BASE}/sessions/${id}`;
    logRequest('deleteSession', url);
    try {
      const response = await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      logResponse('deleteSession', response);
      return response.data;
    } catch (error) {
      logError('deleteSession', error);
      throw error;
    }
  },

  // Dodanie dokumentu do sesji (POST /sessions/:id/documents)
  addDocument: async (id, documentData, token) => {
    const url = `${API_BASE}/sessions/${id}/documents`;
    logRequest('addDocument', url, documentData);
    try {
      const response = await axios.post(url, documentData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      logResponse('addDocument', response);
      return response.data;
    } catch (error) {
      logError('addDocument', error);
      throw error;
    }
  },

  // Pobranie dokumentów przypisanych do sesji (GET /sessions/:id/documents)
  getDocuments: async (id, token) => {
    const url = `${API_BASE}/sessions/${id}/documents`;
    logRequest('getDocuments', url);
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      logResponse('getDocuments', response);
      return response.data;
    } catch (error) {
      logError('getDocuments', error);
      throw error;
    }
  },

  // Przypisanie materiału do sesji (POST /sessions/:id/resources)
  addResource: async (id, resourceData, token) => {
    const url = `${API_BASE}/sessions/${id}/resources`;
    logRequest('addResource', url, resourceData);
    try {
      const response = await axios.post(url, resourceData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      logResponse('addResource', response);
      return response.data;
    } catch (error) {
      logError('addResource', error);
      throw error;
    }
  },

  // Pobranie materiałów przypisanych do sesji (GET /sessions/:id/resources)
  getResources: async (id, token) => {
    const url = `${API_BASE}/sessions/${id}/resources`;
    logRequest('getResources', url);
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      logResponse('getResources', response);
      return response.data;
    } catch (error) {
      logError('getResources', error);
      throw error;
    }
  },
};

export default sessionsApi;
