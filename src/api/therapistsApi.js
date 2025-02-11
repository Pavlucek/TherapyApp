// api/therapistsApi.js

const BASE_URL = 'http://localhost:3000/user'; // Adres Twojego backendu

/**
 * Funkcja pobierająca listę terapeutów.
 * @param {string} token - Token autoryzacyjny użytkownika.
 * @returns {Promise<Array>} Zwraca tablicę obiektów terapeutów.
 * @throws {Error} W przypadku błędu podczas pobierania danych.
 */
export const fetchTherapists = async (token) => {
  try {
    console.log(`[fetchTherapists] Wysyłanie żądania do: ${BASE_URL}/therapists`);
    const response = await fetch(`${BASE_URL}/therapists`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    console.log(`[fetchTherapists] Otrzymano odpowiedź o statusie: ${response.status}`);

    if (!response.ok) {
      throw new Error('Błąd podczas pobierania danych terapeutów');
    }

    const data = await response.json();
    console.log('[fetchTherapists] Dane pobrane:', data);
    return data;
  } catch (error) {
    console.error('[fetchTherapists] Wystąpił błąd:', error);
    throw error;
  }
};
