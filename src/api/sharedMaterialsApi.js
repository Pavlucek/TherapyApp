// sharedMaterialsApi.js
import axios from 'axios';

const API_URL = 'http://localhost:3000'; // lub inny adres Twojego backendu

// Pobieranie materiałów (dostępne dla pacjentów i terapeutów)
export const getMaterials = async (token) => {
  console.log('[getMaterials] Wywołanie endpointu GET /materials');
  try {
    const response = await axios.get(`${API_URL}/materials`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('[getMaterials] Odpowiedź:', response.data);
    return response.data;
  } catch (error) {
    console.error('[getMaterials] Error:', error.message);
    throw error;
  }
};

// Dodawanie nowego materiału (tylko terapeuta)
export const addMaterial = async (token, materialData) => {
  console.log('[addMaterial] Wywołanie endpointu POST /materials z danymi:', materialData);
  try {
    const response = await axios.post(`${API_URL}/materials`, materialData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('[addMaterial] Odpowiedź:', response.data);
    return response.data;
  } catch (error) {
    console.error('[addMaterial] Error:', error.message);
    throw error;
  }
};

// Pobieranie szczegółowych danych materiału (z komentarzami i danymi terapeuty)
export const getMaterialDetails = async (token, resourceId) => {
  console.log(`[getMaterialDetails] Wywołanie endpointu GET /materials/${resourceId}/details`);
  try {
    const response = await axios.get(`${API_URL}/materials/${resourceId}/details`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('[getMaterialDetails] Odpowiedź:', response.data);
    return response.data;
  } catch (error) {
    console.error('[getMaterialDetails] Error:', error.message);
    throw error;
  }
};

// Dodawanie komentarza do materiału
export const addComment = async (token, resourceId, content) => {
  console.log(`[addComment] Wywołanie endpointu POST /materials/${resourceId}/comments z treścią: ${content}`);
  try {
    const response = await axios.post(
      `${API_URL}/materials/${resourceId}/comments`,
      { content },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log('[addComment] Odpowiedź:', response.data);
    return response.data;
  } catch (error) {
    console.error('[addComment] Error:', error.message);
    throw error;
  }
};

// Pobieranie komentarzy do materiału
export const getComments = async (token, resourceId) => {
  console.log(`[getComments] Wywołanie endpointu GET /materials/${resourceId}/comments`);
  try {
    const response = await axios.get(`${API_URL}/materials/${resourceId}/comments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('[getComments] Odpowiedź:', response.data);
    return response.data;
  } catch (error) {
    console.error('[getComments] Error:', error.message);
    throw error;
  }
};

// Dodawanie materiału do ulubionych
export const addFavorite = async (token, resourceId) => {
  console.log(`[addFavorite] Wywołanie endpointu POST /materials/${resourceId}/favorite`);
  try {
    const response = await axios.post(`${API_URL}/materials/${resourceId}/favorite`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('[addFavorite] Odpowiedź:', response.data);
    return response.data;
  } catch (error) {
    console.error('[addFavorite] Error:', error.message);
    throw error;
  }
};

// Usuwanie materiału z ulubionych
export const removeFavorite = async (token, resourceId) => {
  console.log(`[removeFavorite] Wywołanie endpointu DELETE /materials/${resourceId}/favorite`);
  try {
    const response = await axios.delete(`${API_URL}/materials/${resourceId}/favorite`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('[removeFavorite] Odpowiedź:', response.data);
    return response.data;
  } catch (error) {
    console.error('[removeFavorite] Error:', error.message);
    throw error;
  }
};

// Udostępnianie materiału pacjentom (tylko terapeuta)
export const shareMaterial = async (token, resource_id, patient_ids) => {
  console.log('[shareMaterial] Wywołanie endpointu POST /materials/remove z danymi:', { resource_id, patient_ids });
  try {
    const response = await axios.post(
      `${API_URL}/materials/remove`,
      { resource_id, patient_ids },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log('[shareMaterial] Odpowiedź:', response.data);
    return response.data;
  } catch (error) {
    console.error('[shareMaterial] Error:', error.message);
    throw error;
  }
};
