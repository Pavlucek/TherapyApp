const express = require('express');
const notesController = require('../controllers/notesController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Dodawanie notatek - dostępne tylko dla terapeutów
router.post('/', authMiddleware(['therapist']), notesController.addNote);

// Przegląd notatek - dostępne dla pacjentów i terapeutów
router.get(
  '/:patient_id',
  authMiddleware(['therapist', 'patient']),
  notesController.getNotes,
);

// Aktualizacja notatek - dostępne tylko dla terapeutów
router.put('/:id', authMiddleware(['therapist']), notesController.updateNote);

// Usuwanie notatek - dostępne tylko dla terapeutów
router.delete(
  '/:id',
  authMiddleware(['therapist']),
  notesController.deleteNote,
);

module.exports = router;
