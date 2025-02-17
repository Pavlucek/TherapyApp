const express = require('express');
const discussionBoardController = require('../controllers/discussionBoardController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get(
  '/',
  authMiddleware(['therapist', 'patient']),
  discussionBoardController.getMessages,
);
router.post(
  '/',
  authMiddleware(['therapist', 'patient']),
  discussionBoardController.addMessage,
);
router.delete(
  '/:id',
  authMiddleware(['therapist', 'patient']),
  discussionBoardController.deleteMessage,
);

router.put(
  '/:id',
  authMiddleware(['therapist', 'patient']),
  discussionBoardController.editMessage,
);

router.get(
  '/assigned',
  authMiddleware(['therapist']),
  discussionBoardController.getAssignedPatients,
);

router.put(
  '/:id/read',
  authMiddleware(['therapist', 'patient']),
  discussionBoardController.markAsRead,
);

router.get(
  '/therapist',
  authMiddleware(['therapist', 'patient']),
  discussionBoardController.getTherapist, // upewnij się, że ta funkcja jest zaimplementowana w kontrolerze
);

module.exports = router;
