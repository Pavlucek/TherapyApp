import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    
    console.log('Response data:', response.data);

    const { token, role, userName } = response.data;

    // Poprawiony warunek, który nie wymaga userName
    if (token && role) {
      return { token, role, userName: userName ?? "" }; // Jeśli undefined/null, ustaw pusty string
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
