// controllers/journalEntryController.js
const { JournalEntry, Reflection, Tag } = require('../models');

module.exports = {
  // [1] Tworzenie nowego wpisu
  createJournalEntry: async (req, res) => {
    try {
      // Zakładamy, że w body są: patient_id, date, title, content, mood, tags, itp.
      const newEntry = await JournalEntry.create(req.body);
      return res.status(201).json(newEntry);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: error.message });
    }
  },

  // [2] Pobranie wszystkich wpisów (np. wszystkich w systemie lub filtrowanie po pacjencie)
  getAllJournalEntries: async (req, res) => {
    try {
      // Możesz dodać np. warunek where: { patient_id: req.user.id }
      // jeśli chcesz, żeby pacjent widział tylko swoje wpisy
      const entries = await JournalEntry.findAll({
        include: [
          // dołącz refleksje
          { model: Reflection, as: 'reflections' },
          // dołącz tagi (alias z belongsToMany: 'tagsMany')
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

  // [6] Dodanie refleksji do wpisu
  addReflection: async (req, res) => {
    try {
      const { id } = req.params; // id JournalEntry
      // Znajdź JournalEntry
      const entry = await JournalEntry.findByPk(id);
      if (!entry) {
        return res.status(404).json({ message: 'JournalEntry nie został znaleziony' });
      }

      // W req.body może być np. { content: 'Moja refleksja' }
      // Reflection wymaga foreignKey: entryId
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

  // [7] Pobranie refleksji powiązanych z danym wpisem
  getReflections: async (req, res) => {
    try {
      const { id } = req.params; // id JournalEntry
      // Znajdź JournalEntry z dołączonymi Reflection
      const entry = await JournalEntry.findByPk(id, {
        include: [{ model: Reflection, as: 'reflections' }],
      });
      if (!entry) {
        return res.status(404).json({ message: 'JournalEntry nie został znaleziony' });
      }
      // entry.reflections zawiera tablicę reflection
      return res.json(entry.reflections);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },

  // ------------------------------
  // TAGS (wiele-do-wielu z JournalEntry)
  // ------------------------------

  // [8] Przypisanie istniejącego Tag do wpisu
  addTagToEntry: async (req, res) => {
    try {
      const { id, tagId } = req.params; // id = ID wpisu, tagId = ID tagu
      // Znajdź JournalEntry i Tag
      const entry = await JournalEntry.findByPk(id);
      if (!entry) {
        return res.status(404).json({ message: 'JournalEntry nie został znaleziony' });
      }
      const tag = await Tag.findByPk(tagId);
      if (!tag) {
        return res.status(404).json({ message: 'Tag nie został znaleziony' });
      }

      // Dodaj do relacji
      // alias as: 'tagsMany' => entry.addTagsMany(tag)
      await entry.addTagsMany(tag);
      return res.json({ message: 'Tag został przypisany do wpisu.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },

  // [9] Usunięcie tagu z wpisu
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
};
