const express = require('express');
const sharedMaterialsController = require('../controllers/sharedMaterialsController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Istniejące trasy
router.post('/', authMiddleware(['therapist']), sharedMaterialsController.addMaterial);
router.get('/', authMiddleware(['therapist', 'patient']), sharedMaterialsController.getMaterials);
router.delete('/:resource_id', authMiddleware(['therapist']), sharedMaterialsController.deleteMaterial);
router.post('/remove', authMiddleware(['therapist']), sharedMaterialsController.removeMaterialForPatient);

// Nowe trasy

// Pobieranie szczegółowych danych materiału (z komentarzami i danymi terapeuty)
router.get('/:id/details', authMiddleware(['therapist', 'patient']), sharedMaterialsController.getMaterialDetails);

// Komentarze
router.post('/:id/comments', authMiddleware(['therapist', 'patient']), sharedMaterialsController.addComment);
router.get('/:id/comments', authMiddleware(['therapist', 'patient']), sharedMaterialsController.getComments);

// Ulubione
router.post('/:id/favorite', authMiddleware(['therapist', 'patient']), sharedMaterialsController.addFavorite);
router.delete('/:id/favorite', authMiddleware(['therapist', 'patient']), sharedMaterialsController.removeFavorite);

module.exports = router;
