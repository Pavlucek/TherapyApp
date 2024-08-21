const {User, Therapist, Patient} = require('../models');
const bcrypt = require('bcrypt');
const {JournalEntry} = require('../models');
const {Parser} = require('json2csv');
const {Session} = require('../models');

const updateUserDetails = async (req, res) => {
  const userId = req.user.id;
  const {
    email,
    name,
    phone,
    address,
    specialization,
    date_of_birth,
    gender,
    contact,
    emergency_contact,
  } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    user.email = email || user.email;

    if (user.role === 'therapist') {
      const therapist = await Therapist.findOne({where: {user_id: userId}});
      therapist.name = name || therapist.name;
      therapist.phone = phone || therapist.phone;
      therapist.address = address || therapist.address;
      therapist.specialization = specialization || therapist.specialization;
      therapist.date_of_birth = date_of_birth || therapist.date_of_birth;
      therapist.gender = gender || therapist.gender;
      await therapist.save();
    } else if (user.role === 'patient') {
      const patient = await Patient.findOne({where: {user_id: userId}});
      patient.name = name || patient.name;
      patient.contact = contact || patient.contact;
      patient.address = address || patient.address;
      patient.date_of_birth = date_of_birth || patient.date_of_birth;
      patient.gender = gender || patient.gender;
      patient.emergency_contact =
        emergency_contact || patient.emergency_contact;
      await patient.save();
    }

    await user.save();
    res.status(200).json({message: 'User details updated successfully', user});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

const changePassword = async (req, res) => {
  const userId = req.user.id;
  const {oldPassword, newPassword} = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({message: 'Old password is incorrect'});
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({message: 'Password changed successfully'});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

const setNotifications = async (req, res) => {
  const userId = req.user.id;
  const {notificationsEnabled} = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    user.notificationsEnabled = notificationsEnabled;
    await user.save();
    res
      .status(200)
      .json({message: 'Notification settings updated successfully'});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

const exportJournalData = async (req, res) => {
  const userId = req.user.id;

  try {
    const entries = await JournalEntry.findAll({where: {patient_id: userId}});

    const fields = [
      'date',
      'time',
      'title',
      'content',
      'mood',
      'tags',
      'category',
      'location',
      'weather',
      'activity',
    ];
    const parser = new Parser({fields});
    const csv = parser.parse(entries);

    res.header('Content-Type', 'text/csv');
    res.attachment('journal_data.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

const getSessionHistory = async (req, res) => {
  const userId = req.user.id;

  try {
    let sessions;
    if (req.user.role === 'patient') {
      sessions = await Session.findAll({where: {patient_id: userId}});
    } else if (req.user.role === 'therapist') {
      sessions = await Session.findAll({where: {therapist_id: userId}});
    }

    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

const getMoodHistory = async (req, res) => {
  const userId = req.user.id;

  try {
    const entries = await JournalEntry.findAll({where: {patient_id: userId}});

    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

module.exports = {
  updateUserDetails,
  changePassword,
  setNotifications,
  exportJournalData,
  getSessionHistory,
  getMoodHistory,
};
