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

    // Destructure additional fields from the response
    const { token, role, userName, patientId, therapistId, patients } = response.data;

    if (token && role) {
      try {
        const decoded = jwtDecode(token);
        const expiryDate = new Date(decoded.exp * 1000);
        console.log(`Token expires: ${expiryDate.toLocaleString()}`);
      } catch (decodeError) {
        console.error('Error decoding token:', decodeError.message);
      }

      // Return the complete user data
      return { token, role, userName: userName ?? '', patientId, therapistId, patients };
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
  console.log(`Fetching user details for userId: ${userId} from ${API_URL}/user/admin/users/${userId}`);
  const response = await fetch(`${API_URL}/user/admin/users/${userId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${adminToken}`,
      'Content-Type': 'application/json',
    },
  });
  console.log('Response status:', response.status);
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error response:', errorText);
    throw new Error('Failed to fetch user details');
  }
  const data = await response.json();
  console.log('Received data:', data);
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
    throw new Error('Failed to update user details');
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

export const changePassword = async (token, oldPassword, newPassword) => {
  try {
    const response = await axios.put(
      `${API_URL}/user/change-password`,
      { oldPassword, newPassword },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to change password');
    }
  } catch (error) {
    console.error('Error changing password:', error.message);
    throw new Error(error.response?.data?.message || 'Failed to change password');
  }
};
