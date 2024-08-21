const {JournalEntry} = require('../models');
const multer = require('multer');
const upload = multer({storage: multer.memoryStorage()});

const addEntry = async (req, res) => {
  const {
    patient_id,
    date,
    time,
    title,
    content,
    mood,
    tags,
    category,
    location,
    weather,
    activity,
  } = req.body;
  let image = null;
  let audio = null;

  if (req.files) {
    if (req.files.image) {
      image = req.files.image[0].buffer;
    }
    if (req.files.audio) {
      audio = req.files.audio[0].buffer;
    }
  }

  try {
    const newEntry = await JournalEntry.create({
      patient_id,
      date,
      time,
      title,
      content,
      mood,
      tags,
      image,
      audio,
      category,
      location,
      weather,
      activity,
    });
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

const updateEntry = async (req, res) => {
  const {id} = req.params;
  const {
    date,
    time,
    title,
    content,
    mood,
    tags,
    category,
    location,
    weather,
    activity,
  } = req.body;
  let image = null;
  let audio = null;

  if (req.files) {
    if (req.files.image) {
      image = req.files.image[0].buffer;
    }
    if (req.files.audio) {
      audio = req.files.audio[0].buffer;
    }
  }

  try {
    const entry = await JournalEntry.findByPk(id);
    if (!entry) {
      return res.status(404).json({message: 'Entry not found'});
    }
    entry.date = date || entry.date;
    entry.time = time || entry.time;
    entry.title = title || entry.title;
    entry.content = content || entry.content;
    entry.mood = mood || entry.mood;
    entry.tags = tags || entry.tags;
    entry.image = image || entry.image;
    entry.audio = audio || entry.audio;
    entry.category = category || entry.category;
    entry.location = location || entry.location;
    entry.weather = weather || entry.weather;
    entry.activity = activity || entry.activity;
    await entry.save();
    res.status(200).json(entry);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

const deleteEntry = async (req, res) => {
  const {id} = req.params;
  try {
    const entry = await JournalEntry.findByPk(id);
    if (!entry) {
      return res.status(404).json({message: 'Entry not found'});
    }
    await entry.destroy();
    res.status(200).json({message: 'Entry deleted successfully'});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

const getEntries = async (req, res) => {
  const {patient_id} = req.params;
  try {
    const entries = await JournalEntry.findAll({where: {patient_id}});
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

module.exports = {
  addEntry: [upload.fields([{name: 'image'}, {name: 'audio'}]), addEntry],
  updateEntry: [upload.fields([{name: 'image'}, {name: 'audio'}]), updateEntry],
  deleteEntry,
  getEntries,
};
