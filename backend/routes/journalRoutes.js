// routes/journalEntryRoutes.js
const express = require('express');
const journalEntryController = require('../controllers/journalEntryController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Tworzenie nowego wpisu w dzienniku – dostępne np. dla pacjenta
router.post('/', authMiddleware(['patient']), journalEntryController.createJournalEntry);

// Pobranie wszystkich wpisów – dostępne np. dla pacjenta/terapeuty (zależnie od logiki)
router.get('/', authMiddleware(['patient', 'therapist']), journalEntryController.getAllJournalEntries);

// Pobranie pojedynczego wpisu
router.get('/:id', authMiddleware(['patient', 'therapist']), journalEntryController.getJournalEntryById);

// Aktualizacja wpisu w dzienniku – np. tylko pacjent
router.put('/:id', authMiddleware(['patient']), journalEntryController.updateJournalEntry);

// Usunięcie wpisu w dzienniku – np. tylko pacjent
router.delete('/:id', authMiddleware(['patient']), journalEntryController.deleteJournalEntry);

// ------------------------------
// REFLECTIONS (relacja 1-wiele z JournalEntry)
// ------------------------------

// Dodanie refleksji do wpisu
router.post('/:id/reflections', authMiddleware(['patient']), journalEntryController.addReflection);

// Pobranie refleksji przypisanych do danego wpisu
router.get('/:id/reflections', authMiddleware(['patient', 'therapist']), journalEntryController.getReflections);

// ------------------------------
// TAGS (relacja wiele-do-wielu z JournalEntry)
// ------------------------------

// Przypisanie istniejącego Tag do wpisu
router.post('/:id/tags/:tagId', authMiddleware(['patient']), journalEntryController.addTagToEntry);

// Usunięcie istniejącego Tag z wpisu
router.delete('/:id/tags/:tagId', authMiddleware(['patient']), journalEntryController.removeTagFromEntry);

module.exports = router;
