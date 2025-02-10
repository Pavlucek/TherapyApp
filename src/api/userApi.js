const API_URL = 'http://localhost:3000/user/all'; // Zmień na 10.0.2.2 dla emulatora Androida

export const fetchUsersFromApi = async (token) => {
  try {
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`, // Obsługa autoryzacji
      },
    });

    if (!response.ok) {
      throw new Error('Błąd pobierania użytkowników');
    }

    return await response.json();
  } catch (error) {
    console.error('Błąd pobierania użytkowników:', error);
    return [];
  }
};
