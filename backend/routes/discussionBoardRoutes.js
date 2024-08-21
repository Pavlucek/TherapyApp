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

router.put(
  '/:id/read',
  authMiddleware(['therapist', 'patient']),
  discussionBoardController.markAsRead,
);

module.exports = router;
