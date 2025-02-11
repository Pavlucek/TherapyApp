import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:3000';

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });

    console.log('Response data:', response.data);

    const { token, role, userName } = response.data;

    if (token && role) {
      // ✅ Dekodowanie tokena i logowanie daty wygaśnięcia
      try {
        const decoded = jwtDecode(token);
        const expiryDate = new Date(decoded.exp * 1000); // Konwersja timestamp do daty
        console.log(`✅ Token wygasa: ${expiryDate.toLocaleString()}`);
      } catch (decodeError) {
        console.error('❌ Błąd dekodowania tokena:', decodeError.message);
      }

      return { token, role, userName: userName ?? '' }; // Jeśli undefined/null, ustaw pusty string
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('Login error:', error.message);
    throw new Error('Invalid login credentials');
  }
};


export const register = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/register`, {
    email,
    password,
  });
  return response.data;
};

export const getUserDetails = async (adminToken, userId) => {
  console.log(`Pobieranie danych dla userId: ${userId} z URL: ${API_URL}/user/admin/users/${userId}`);
  const response = await fetch(`${API_URL}/user/admin/users/${userId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${adminToken}`,
      'Content-Type': 'application/json',
    },
  });
  console.log('Status odpowiedzi:', response.status);
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Odpowiedź błędu:', errorText);
    throw new Error('Nie udało się pobrać danych użytkownika');
  }
  const data = await response.json();
  console.log('Otrzymane dane:', data);
  return data;
};


export const updateUserDetailsByAdmin = async (adminToken, userId, userData) => {
  const response = await fetch(`${API_URL}/user/admin/users/${userId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${adminToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    throw new Error('Nie udało się zaktualizować danych użytkownika');
  }
  return response.json();
};

export const logout = async () => {
  await axios.post(`${API_URL}/auth/logout`);
};

export const updateUserDetails = async (token, updatedUser) => {
  try {
    const response = await axios.put(`${API_URL}/user/update`, updatedUser, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to update user details');
    }
  } catch (error) {
    console.error('Update error:', error.message);
    throw new Error('Failed to update user details');
  }
};

// Rejestracja terapeuty – funkcja wywoływana przez administratora
export const registerTherapist = async (adminToken, therapistData) => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/register/therapist`,
      therapistData,
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error registering therapist:', error.message);
    throw error;
  }
};

// Rejestracja pacjenta – funkcja wywoływana przez administratora lub terapeutę
export const registerPatient = async (token, patientData) => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/register/patient`,
      patientData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error registering patient:', error.message);
    throw error;
  }
};
