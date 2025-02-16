const { Op } = require('sequelize');
const { Tag, Patient } = require('../models');

module.exports = {
  // Tworzenie tagu – pacjent może dodać swój własny tag, ale nie globalny
  createTag: async (req, res) => {
    try {
      const { type, name } = req.body;

      // Pobranie ID pacjenta na podstawie użytkownika
      const patient = await Patient.findOne({ where: { user_id: req.user.id } });

      if (!patient) {
        return res.status(400).json({ error: 'Pacjent nie istnieje lub użytkownik nie jest pacjentem' });
      }

      const patient_id = patient.id; // Prawidłowe ID pacjenta
      console.log(`Creating tag for patient ${patient_id}`);

      // Sprawdzenie, czy pacjent już ma taki tag
      const existingTag = await Tag.findOne({ where: { type, name, patient_id } });

      if (existingTag) {
        return res.status(400).json({ error: 'Masz już taki tag' });
      }

      // Tworzenie nowego tagu (prywatnego dla pacjenta)
      const newTag = await Tag.create({ type, name, patient_id, is_global: false });
      return res.status(201).json(newTag);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },

  // Pobranie wszystkich tagów (globalne + własne pacjenta)
  getAllTags: async (req, res) => {
    try {
      // Sprawdzenie roli użytkownika (czy jest terapeutą)
      if (req.user.role === 'therapist') {
        // Terapeuta widzi WSZYSTKIE tagi
        const tags = await Tag.findAll();
        return res.json(tags);
      }

      // Pobranie ID pacjenta na podstawie użytkownika
      const patient = await Patient.findOne({ where: { user_id: req.user.id } });

      if (!patient) {
        return res.status(400).json({ error: 'Pacjent nie istnieje' });
      }

      const patient_id = patient.id;
      console.log('Pobieranie tagów dla pacjenta:', patient_id);

      const tags = await Tag.findAll({
        where: {
          [Op.or]: [
            { is_global: true }, // Globalne tagi dostępne dla wszystkich
            { patient_id }, // Prywatne tagi danego pacjenta
          ],
        },
      });

      return res.json(tags);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },

  // Pobranie konkretnego tagu (sprawdzenie, czy należy do pacjenta lub jest globalny)
  getTagById: async (req, res) => {
    try {
      const { id } = req.params;

      // Pobranie ID pacjenta
      const patient = await Patient.findOne({ where: { user_id: req.user.id } });
      if (!patient) {
        return res.status(400).json({ error: 'Pacjent nie istnieje' });
      }

      const patient_id = patient.id;
      const tag = await Tag.findOne({
        where: {
          id,
          [Op.or]: [
            { is_global: true },
            { patient_id },
          ],
        },
      });

      if (!tag) {
        return res.status(404).json({ error: 'Nie znaleziono tagu lub nie masz do niego dostępu' });
      }

      return res.json(tag);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },

  // Usunięcie tagu – pacjent może usuwać tylko swoje prywatne tagi
  deleteTag: async (req, res) => {
    try {
      const { id } = req.params;

      // Pobranie ID pacjenta
      const patient = await Patient.findOne({ where: { user_id: req.user.id } });

      if (!patient) {
        return res.status(400).json({ error: 'Pacjent nie istnieje' });
      }

      const patient_id = patient.id;

      // Znalezienie tagu
      const tag = await Tag.findOne({
        where: { id, patient_id, is_global: false }, // Pacjent może usuwać tylko swoje tagi
      });

      if (!tag) {
        return res.status(403).json({ error: 'Nie możesz usunąć tego tagu' });
      }

      await tag.destroy();
      return res.json({ message: 'Tag został usunięty' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
};
