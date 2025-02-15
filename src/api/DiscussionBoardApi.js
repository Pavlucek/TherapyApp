import axios from 'axios';

const API_URL = 'http://localhost:3000';

// Pobiera wiadomości na podstawie patient_id i therapist_id
export const getMessages = async (token, patientId, therapistId) => {
  console.log(`[getMessages] Called with token: ${token}, patientId: ${patientId}, therapistId: ${therapistId}`);
  try {
    const response = await axios.get(`${API_URL}/discussion-board`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        patient_id: patientId,
        therapist_id: therapistId,
      },
    });
    console.log('[getMessages] Successfully fetched messages:', response.data);
    return response.data;
  } catch (error) {
    console.error('[getMessages] Error fetching messages:', error.message);
    throw error;
  }
};

// Dodaje nową wiadomość
export const addMessage = async (token, { patient_id, therapist_id, sender, message, attachment }) => {
  console.log(`[addMessage] Called with token: ${token}, payload: { patient_id: ${patient_id}, therapist_id: ${therapist_id}, sender: ${sender}, message: ${message}, attachment: ${attachment} }`);
  try {
    const response = await axios.post(
      `${API_URL}/discussion-board`,
      { patient_id, therapist_id, sender, message, attachment },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log('[addMessage] Message added successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('[addMessage] Error adding message:', error.message);
    throw error;
  }
};

// Usuwa wiadomość o podanym id
export const deleteMessage = async (token, id) => {
  console.log(`[deleteMessage] Called with token: ${token}, message id: ${id}`);
  try {
    const response = await axios.delete(`${API_URL}/discussion-board/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('[deleteMessage] Message deleted successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('[deleteMessage] Error deleting message:', error.message);
    throw error;
  }
};

// Edytuje wiadomość (zmienia treść) dla podanego id
export const editMessage = async (token, id, message) => {
  console.log(`[editMessage] Called with token: ${token}, message id: ${id}, new message: ${message}`);
  try {
    const response = await axios.put(
      `${API_URL}/discussion-board/${id}`,
      { message },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log('[editMessage] Message edited successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('[editMessage] Error editing message:', error.message);
    throw error;
  }
};

// Oznacza wiadomość jako przeczytaną (markAsRead)
export const markAsRead = async (token, id) => {
  console.log(`[markAsRead] Called with token: ${token}, message id: ${id}`);
  try {
    const response = await axios.put(
      `${API_URL}/discussion-board/${id}/read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log('[markAsRead] Message marked as read:', response.data);
    return response.data;
  } catch (error) {
    console.error('[markAsRead] Error marking message as read:', error.message);
    throw error;
  }
};

export const getTherapist = async (token, therapistId) => {
    console.log(`[getTherapist] Called with token: ${token}, therapistId: ${therapistId}`);
    try {
      const response = await axios.get(`${API_URL}/discussion-board/therapist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          therapist_id: therapistId,
        },
      });
      console.log('[getTherapist] Successfully fetched therapist details:', response.data);
      return response.data;
    } catch (error) {
      console.error('[getTherapist] Error fetching therapist details:', error.message);
      throw error;
    }
  };
