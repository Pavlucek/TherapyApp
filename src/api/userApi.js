const API_URL = 'http://localhost:3000/user/all'; // Dla emulatora Androida zmień na 10.0.2.2

export const fetchUsersFromApi = async (token) => {
  try {
    console.log('Wysyłanie żądania do:', API_URL);
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`, // Obsługa autoryzacji
      },
    });
    console.log('Otrzymano odpowiedź o statusie:', response.status);

    if (!response.ok) {
      throw new Error('Błąd pobierania użytkowników');
    }

    const data = await response.json();
    console.log('Dane pobrane:', data);
    return data;
  } catch (error) {
    console.error('Błąd pobierania użytkowników:', error);
    return [];
  }
};
