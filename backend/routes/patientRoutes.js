const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const authMiddleware = require('../middleware/authMiddleware');

// Endpoint do pobierania pacjentów przypisanych do terapeuty
router.get('/assigned', authMiddleware(['therapist']), patientController.getAssignedPatients);

module.exports = router;
