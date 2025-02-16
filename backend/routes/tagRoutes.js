const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');
const authMiddleware = require('../middleware/authMiddleware');

// Pacjent może tworzyć i usuwać TYLKO SWOJE tagi
router.post('/', authMiddleware(['patient']), tagController.createTag);
router.get('/', authMiddleware(['patient', 'therapist']), tagController.getAllTags); // Terapeuta może widzieć wszystko
router.get('/:id', authMiddleware(['patient', 'therapist']), tagController.getTagById);
router.delete('/:id', authMiddleware(['patient']), tagController.deleteTag);

module.exports = router;
