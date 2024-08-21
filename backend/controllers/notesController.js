const {Note} = require('../models');

const addNote = async (req, res) => {
  const {patient_id, title, content, goals, techniques, priority, attachments} =
    req.body;
  const therapist_id = req.user.id;
  try {
    const newNote = await Note.create({
      patient_id,
      therapist_id,
      date: new Date().toISOString(),
      title,
      content,
      goals,
      techniques,
      priority,
      attachments,
    });
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

const getNotes = async (req, res) => {
  const {patient_id} = req.params;
  try {
    const notes = await Note.findAll({where: {patient_id}});
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

const updateNote = async (req, res) => {
  const {id} = req.params;
  const {title, content, goals, techniques, priority, attachments} = req.body;
  try {
    const note = await Note.findByPk(id);
    if (!note) {
      return res.status(404).json({message: 'Note not found'});
    }
    note.title = title || note.title;
    note.content = content || note.content;
    note.goals = goals || note.goals;
    note.techniques = techniques || note.techniques;
    note.priority = priority || note.priority;
    note.attachments = attachments || note.attachments;
    await note.save();
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

const deleteNote = async (req, res) => {
  const {id} = req.params;
  try {
    const note = await Note.findByPk(id);
    if (!note) {
      return res.status(404).json({message: 'Note not found'});
    }
    await note.destroy();
    res.status(200).json({message: 'Note deleted successfully'});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

module.exports = {
  addNote,
  getNotes,
  updateNote,
  deleteNote,
};
