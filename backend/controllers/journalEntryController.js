const { JournalEntry, Reflection, Tag } = require('../models');

module.exports = {
  // [1] Tworzenie nowego wpisu
  createJournalEntry: async (req, res) => {
    try {
      const newEntry = await JournalEntry.create(req.body);
      return res.status(201).json(newEntry);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: error.message });
    }
  },

  // [2] Pobranie wszystkich wpisów
  getAllJournalEntries: async (req, res) => {
    try {
      const entries = await JournalEntry.findAll({
        include: [
          { model: Reflection, as: 'reflections' },
          { model: Tag, as: 'tagsMany', through: { attributes: [] } },
        ],
      });
      return res.json(entries);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },

  // [3] Pobranie pojedynczego wpisu
  getJournalEntryById: async (req, res) => {
    try {
      const { id } = req.params;
      const entry = await JournalEntry.findByPk(id, {
        include: [
          { model: Reflection, as: 'reflections' },
          { model: Tag, as: 'tagsMany', through: { attributes: [] } },
        ],
      });
      if (!entry) {
        return res.status(404).json({ message: 'JournalEntry nie został znaleziony' });
      }
      return res.json(entry);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },

  // [4] Aktualizacja wpisu
  updateJournalEntry: async (req, res) => {
    try {
      const { id } = req.params;
      const entry = await JournalEntry.findByPk(id);
      if (!entry) {
        return res.status(404).json({ message: 'JournalEntry nie został znaleziony' });
      }
      await entry.update(req.body);
      return res.json(entry);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: error.message });
    }
  },

  // [5] Usunięcie wpisu
  deleteJournalEntry: async (req, res) => {
    try {
      const { id } = req.params;
      const entry = await JournalEntry.findByPk(id);
      if (!entry) {
        return res.status(404).json({ message: 'JournalEntry nie został znaleziony' });
      }
      await entry.destroy();
      return res.json({ message: 'Wpis został usunięty' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },

  // ------------------------------
  // REFLECTIONS (1-wiele z JournalEntry)
  // ------------------------------

  addReflection: async (req, res) => {
    try {
      const { id } = req.params;
      const entry = await JournalEntry.findByPk(id);
      if (!entry) {
        return res.status(404).json({ message: 'JournalEntry nie został znaleziony' });
      }
      const reflectionData = {
        ...req.body,
        entryId: entry.id,
      };
      const newReflection = await Reflection.create(reflectionData);
      return res.status(201).json(newReflection);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: error.message });
    }
  },

  getReflections: async (req, res) => {
    try {
      const { id } = req.params;
      const entry = await JournalEntry.findByPk(id, {
        include: [{ model: Reflection, as: 'reflections' }],
      });
      if (!entry) {
        return res.status(404).json({ message: 'JournalEntry nie został znaleziony' });
      }
      return res.json(entry.reflections);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },

  // ------------------------------
  // TAGS (wiele-do-wielu z JournalEntry)
  // ------------------------------

  addTagToEntry: async (req, res) => {
    try {
      const { id, tagId } = req.params;
      const entry = await JournalEntry.findByPk(id);
      if (!entry) {
        return res.status(404).json({ message: 'JournalEntry nie został znaleziony' });
      }
      const tag = await Tag.findByPk(tagId);
      if (!tag) {
        return res.status(404).json({ message: 'Tag nie został znaleziony' });
      }
      await entry.addTagsMany(tag);
      return res.json({ message: 'Tag został przypisany do wpisu.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },

  removeTagFromEntry: async (req, res) => {
    try {
      const { id, tagId } = req.params;
      const entry = await JournalEntry.findByPk(id);
      if (!entry) {
        return res.status(404).json({ message: 'JournalEntry nie został znaleziony' });
      }
      const tag = await Tag.findByPk(tagId);
      if (!tag) {
        return res.status(404).json({ message: 'Tag nie został znaleziony' });
      }
      await entry.removeTagsMany(tag);
      return res.json({ message: 'Tag został usunięty z wpisu.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },

  // ------------------------------
  // NOWY ENDPOINT: Udostępnione wpisy dziennika dla pacjenta
  // ------------------------------
  getSharedJournalEntriesForPatient: async (req, res) => {
    console.log('[getSharedJournalEntriesForPatient] Rozpoczęcie pobierania udostępnionych wpisów dla pacjenta.');
    try {
      const { patientId } = req.params;
      console.log('[getSharedJournalEntriesForPatient] Otrzymany patientId:', patientId);

      const sharedEntries = await JournalEntry.findAll({
        where: {
          patient_id: patientId,
          shared: true,
        },
        include: [
          { model: Reflection, as: 'reflections' },
          { model: Tag, as: 'tagsMany', through: { attributes: [] } },
        ],
        order: [['date', 'DESC']],
      });

      console.log('[getSharedJournalEntriesForPatient] Znaleziono wpisów:', sharedEntries.length);

      if (!sharedEntries || sharedEntries.length === 0) {
        console.log('[getSharedJournalEntriesForPatient] Brak udostępnionych wpisów dla pacjenta o id:', patientId);
        return res.status(404).json({ message: 'Brak udostępnionych wpisów dla tego pacjenta.' });
      }

      console.log('[getSharedJournalEntriesForPatient] Zwracam udostępnione wpisy.');
      return res.json(sharedEntries);
    } catch (error) {
      console.error('[getSharedJournalEntriesForPatient] Błąd podczas pobierania:', error.message);
      return res.status(500).json({ error: error.message });
    }
  },
};
