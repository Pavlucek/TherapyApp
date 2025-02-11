export const assignPatient = async (token, therapistId, patientId) => {
    try {
      const response = await fetch('http://localhost:3000/user/assign-patient', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ therapistId, patientId }),
      });
      console.log('[assignPatient] Response status:', response.status);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('[assignPatient] Response error data:', errorData);
        throw new Error(errorData.message || 'Błąd przy przypisywaniu pacjenta');
      }
      return await response.json();
    } catch (error) {
      console.error('[assignPatient] Błąd:', error);
      throw error;
    }
  };
  