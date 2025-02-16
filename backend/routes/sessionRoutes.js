// routes/sessionRoutes.js
const express = require('express');
const sessionController = require('../controllers/sessionController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Przykładowo, tylko terapeuci mogą tworzyć nowe sesje
router.post('/', authMiddleware(['therapist']), sessionController.createSession);

// Przegląd sesji - dostępne dla terapeutów i pacjentów
router.get('/', authMiddleware(['therapist', 'patient']), sessionController.getSessions);

// Pobranie szczegółów sesji wraz z dokumentami i materiałami - dostępne dla terapeutów i pacjentów
router.get('/:id', authMiddleware(['therapist', 'patient']), sessionController.getSession);

// Aktualizacja sesji - dostępne tylko dla terapeutów
router.put('/:id', authMiddleware(['therapist']), sessionController.updateSession);

// Usunięcie sesji - dostępne tylko dla terapeutów
router.delete('/:id', authMiddleware(['therapist']), sessionController.deleteSession);

// Dodanie dokumentu (np. zadania domowego) do sesji - dostępne tylko dla terapeutów
router.post('/:id/documents', authMiddleware(['therapist']), sessionController.addDocument);

// Pobranie dokumentów przypisanych do danej sesji - dostępne dla terapeutów i pacjentów
router.get('/:id/documents', authMiddleware(['therapist', 'patient']), sessionController.getDocuments);

// Przypisanie materiału do sesji - dostępne tylko dla terapeutów
router.post('/:id/resources', authMiddleware(['therapist']), sessionController.addResource);

// Pobranie materiałów przypisanych do danej sesji - dostępne dla terapeutów i pacjentów
router.get('/:id/resources', authMiddleware(['therapist', 'patient']), sessionController.getResources);

module.exports = router;
