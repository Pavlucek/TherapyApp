const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.put(
  '/update',
  authMiddleware(['therapist', 'patient', 'admin']),
  userController.updateUserDetails,
);
router.put(
  '/change-password',
  authMiddleware(['therapist', 'patient', 'admin']),
  userController.changePassword,
);
router.put(
  '/set-notifications',
  authMiddleware(['therapist', 'patient', 'admin']),
  userController.setNotifications,
);
router.get(
  '/export-journal',
  authMiddleware(['patient']),
  userController.exportJournalData,
);
router.get(
  '/session-history',
  authMiddleware(['therapist', 'patient']),
  userController.getSessionHistory,
);
router.get(
  '/mood-history',
  authMiddleware(['patient']),
  userController.getMoodHistory,
);
router.get(
  '/all',
  authMiddleware(['admin']),
  userController.getAllUsers
);

router.get(
  '/therapists',
  authMiddleware(['admin']),
  userController.getTherapists
);

router.get(
  '/patients',
  authMiddleware(['admin']),
  userController.getPatients
);

router.delete(
  '/admin/users/:userId',
  authMiddleware(['admin']),
  userController.deleteUser
);

// Nowe endpointy dla operacji administracyjnych:
router.get(
  '/admin/users/:userId',
  authMiddleware(['admin']),
  userController.getUserProfileByAdmin
);
router.put(
  '/admin/users/:userId',
  authMiddleware(['admin']),
  userController.updateUserDetailsByAdmin
);

router.put('/assign-patient',
  authMiddleware(['admin']),
  userController.assignPatient);

module.exports = router;
