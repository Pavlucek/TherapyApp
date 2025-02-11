// controllers/statsController.js

const { User, Session } = require('../models');

const getStats = async (req, res) => {
  try {
    // Całkowita liczba użytkowników
    const totalUsers = await User.count();

    // Liczba użytkowników o roli 'therapist'
    const totalTherapists = await User.count({ where: { role: 'therapist' } });

    // Liczba użytkowników o roli 'patient'
    const totalPatients = await User.count({ where: { role: 'patient' } });

    // Łączna liczba sesji
    const totalSessions = await Session.count();


    res.status(200).json({
      totalUsers,
      totalTherapists,
      totalPatients,
      totalSessions,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
};

module.exports = { getStats };
