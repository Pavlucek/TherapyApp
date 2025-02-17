const { Patient, Therapist, User } = require('../models');

const getAssignedPatients = async (req, res) => {
  try {
    // Upewnij się, że tylko terapeuta może pobierać listę pacjentów
    if (req.user.role !== 'therapist') {
      return res.status(403).json({ message: 'Brak uprawnień.' });
    }

    // Znajdź rekord terapeuty powiązany z zalogowanym użytkownikiem
    const therapist = await Therapist.findOne({ where: { user_id: req.user.id } });
    if (!therapist) {
      return res.status(404).json({ message: 'Terapeuta nie został znaleziony.' });
    }

    // Pobierz pacjentów przypisanych do tego terapeuty
    const patients = await Patient.findAll({
      where: { therapist_id: therapist.id },
      // Jeśli chcesz pobrać dodatkowe dane użytkownika powiązanego z pacjentem:
      include: [{ model: User, attributes: ['email'] }],
    });

    res.json(patients);
  } catch (error) {
    console.error('[getAssignedPatients] Błąd:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAssignedPatients };
