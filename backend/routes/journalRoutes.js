const express = require('express');
const journalController = require('../controllers/journalController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Dodawanie wpisów - dostępne tylko dla pacjentów
router.post('/', authMiddleware(['patient']), journalController.addEntry);

// Edytowanie wpisów - dostępne tylko dla pacjentów
router.put('/:id', authMiddleware(['patient']), journalController.updateEntry);

// Usuwanie wpisów - dostępne tylko dla pacjentów
router.delete(
  '/:id',
  authMiddleware(['patient']),
  journalController.deleteEntry,
);

// Przeglądanie wpisów - dostępne dla pacjentów i terapeutów
router.get(
  '/:patient_id',
  authMiddleware(['therapist', 'patient']),
  journalController.getEntries,
);

module.exports = router;
