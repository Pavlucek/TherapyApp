const express = require('express');
const sharedMaterialsController = require('../controllers/sharedMaterialsController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Dodawanie materiału - dostępne tylko dla terapeutów
router.post('/', authMiddleware(['therapist']), sharedMaterialsController.addMaterial);

// Pobieranie materiałów - dostępne dla terapeutów i pacjentów
router.get('/', authMiddleware(['therapist', 'patient']), sharedMaterialsController.getMaterials);

// Usuwanie materiału - dostępne tylko dla terapeutów
router.delete('/:id', authMiddleware(['therapist']), sharedMaterialsController.deleteMaterial);

// Usuwanie dostępu pacjenta do materiału - dostępne tylko dla terapeutów
router.post('/remove', authMiddleware(['therapist']), sharedMaterialsController.removeMaterialForPatient);

module.exports = router;
