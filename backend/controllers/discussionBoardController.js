const {DiscussionBoard, Therapist, Patient, User} = require('../models');

const getAssignedPatients = async (req, res) => {
  try {
    if (req.user.role !== 'therapist') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const therapist = await Therapist.findOne({
      where: { user_id: req.user.id },
    });
    if (!therapist) {
      console.log('Brak terapeuty dla user_id:', req.user.id);
      return res.status(404).json({ message: 'Therapist not found' });
    }

    const therapistId = therapist.id;
    console.log('Therapist ID from DB:', therapistId);

    const patients = await Patient.findAll({
      where: { therapist_id: therapistId },
      include: [{
        model: User,
        attributes: ['email', 'role'],
      }],
      order: [['name', 'ASC']],
    });
    console.log('Znalezione pacjenci:', patients);
    res.json(patients);
  } catch (error) {
    console.error('Błąd w getAssignedPatients:', error);
    res.status(500).json({ error: error.message });
  }
};


const getMessages = async (req, res) => {
  const {patient_id, therapist_id} = req.query;
  try {
    const messages = await DiscussionBoard.findAll({
      where: {patient_id, therapist_id},
      order: [['date', 'ASC']],
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

const addMessage = async (req, res) => {
  const {patient_id, therapist_id, sender, message, attachment} = req.body;
  try {
    const newMessage = await DiscussionBoard.create({
      patient_id,
      therapist_id,
      date: new Date().toISOString(),
      sender,
      message,
      attachment,
    });
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

const deleteMessage = async (req, res) => {
  const {id} = req.params;
  const userId = req.user.id;
  const role = req.user.role;
  try {
    const message = await DiscussionBoard.findByPk(id);

    if (!message) {
      return res.status(404).json({message: 'Message not found'});
    }

    // Check if the user is the author of the message
    if (
      (role === 'therapist' &&
        message.sender === 'therapist' &&
        message.therapist_id === userId) ||
      (role === 'patient' &&
        message.sender === 'patient' &&
        message.patient_id === userId)
    ) {
      await message.destroy();
      res.status(200).json({message: 'Message deleted successfully'});
    } else {
      res
        .status(403)
        .json({message: 'You are not authorized to delete this message'});
    }
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

const editMessage = async (req, res) => {
  const {id} = req.params;
  const {message} = req.body;
  const userId = req.user.id;
  const role = req.user.role;
  try {
    const existingMessage = await DiscussionBoard.findByPk(id);

    if (!existingMessage) {
      return res.status(404).json({message: 'Message not found'});
    }

    // Check if the user is the author of the message
    if (
      (role === 'therapist' &&
        existingMessage.sender === 'therapist' &&
        existingMessage.therapist_id === userId) ||
      (role === 'patient' &&
        existingMessage.sender === 'patient' &&
        existingMessage.patient_id === userId)
    ) {
      existingMessage.message = message;
      await existingMessage.save();
      res
        .status(200)
        .json({message: 'Message edited successfully', existingMessage});
    } else {
      res
        .status(403)
        .json({message: 'You are not authorized to edit this message'});
    }
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

const markAsRead = async (req, res) => {
  const {id} = req.params;
  try {
    const message = await DiscussionBoard.findByPk(id);
    if (!message) {
      return res.status(404).json({message: 'Message not found'});
    }
    message.read = true;
    await message.save();
    res.status(200).json({success: 'Message marked as read', message});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

const getTherapist = async (req, res) => {
  // Możesz pobrać therapist_id z query lub params, np.:
  const therapist_id = req.query.therapist_id;
  if (!therapist_id) {
    return res.status(400).json({ message: 'Brak przekazanego therapist_id' });
  }

  try {
    const therapist = await Therapist.findByPk(therapist_id, {
      attributes: ['id', 'name', 'phone', 'address', 'specialization', 'date_of_birth', 'gender'],
    });
    if (!therapist) {
      return res.status(404).json({ message: 'Terapeuta nie znaleziono' });
    }
    res.json(therapist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getMessages,
  addMessage,
  deleteMessage,
  editMessage,
  markAsRead,
  getTherapist,
  getAssignedPatients,
};
