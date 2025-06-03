// api/patientsApi.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const getAssignedPatients = async (token) => {
  console.log('[getAssignedPatients] Called with token:', token);
  try {
    const response = await axios.get(`${API_URL}/patients/assigned`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('[getAssignedPatients] Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('[getAssignedPatients] Error:', error.message);
    throw error;
  }
};

export const getPatientDetails = async (patientId, token) => {
  console.log('[getPatientDetails] Called with patientId:', patientId, 'and token:', token);
  try {
    const response = await axios.get(`${API_URL}/patients/${patientId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('[getPatientDetails] Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('[getPatientDetails] Error:', error.message);
    throw error;
  }
};

export const getPatientModelInfo = async (patientId, token) => {
  console.log('[getPatientModelInfo] Called with patientId:', patientId, 'and token:', token);
  try {
    const response = await axios.get(`${API_URL}/patients/model/${patientId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('[getPatientModelInfo] Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('[getPatientModelInfo] Error:', error.message);
    throw error;
  }
};

export const getTherapistModelInfo = async (therapistId, token) => {
  console.log('[getPatientModelInfo] Called with therapistId:', therapistId, 'and token:', token);
  try {
    const response = await axios.get(`${API_URL}/patients/model-therapist/${therapistId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('[getPatientModelInfo] Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('[getPatientModelInfo] Error:', error.message);
    throw error;
  }
};
