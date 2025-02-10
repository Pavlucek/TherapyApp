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


module.exports = router;
