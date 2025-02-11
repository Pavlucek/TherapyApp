// routes/statsRoutes.js

const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/statsController');

// Endpoint GET /api/stats – zwraca statystyki
router.get('/stats', getStats);

module.exports = router;
