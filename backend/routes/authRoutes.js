const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Admin registers admin (for initial setup only)
router.post('/register/admin', authController.registerAdmin);

// Admin registers therapist
router.post(
  '/register/therapist',
  authMiddleware(['admin']),
  authController.registerTherapist,
);

// Admin or Therapist registers patient
router.post(
  '/register/patient',
  authMiddleware(['admin', 'therapist']),
  authController.registerPatient,
);

// Login user (admin, therapist, patient)
router.post('/login', authController.loginUser);

module.exports = router;
