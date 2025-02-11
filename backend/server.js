require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const discussionBoardRoutes = require('./routes/discussionBoardRoutes');
const userRoutes = require('./routes/userRoutes');
const notesRoutes = require('./routes/notesRoutes');
const journalRoutes = require('./routes/journalRoutes');
const StatsRoutes = require('./routes/statsRoutes');
const { sequelize } = require('./models');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);
app.use('/discussion-board', discussionBoardRoutes);
app.use('/user', userRoutes);
app.use('/notes', notesRoutes);
app.use('/journal', journalRoutes);
app.use('/api', StatsRoutes);

// Start the server
app.listen(port, async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    console.log(`Server running on http://localhost:${port}`);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
