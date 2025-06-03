const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const authMiddleware = require('../middleware/authMiddleware');

// Endpoint do pobierania pacjentów przypisanych do terapeuty
router.get('/assigned', authMiddleware(['therapist']), patientController.getAssignedPatients);
router.get('/:patientId', authMiddleware(['therapist', 'patient']), patientController.getPatientDetails);
// New route for fetching patient model info
router.get('/model/:patientId', authMiddleware(['therapist', 'patient']), patientController.getPatientModelInfo);
router.get('/model-therapist/:therapistId', authMiddleware(['therapist', 'patient']), patientController.getTherapistModelInfo);

module.exports = router;
