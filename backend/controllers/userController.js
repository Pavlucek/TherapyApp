const {User, Therapist, Patient} = require('../models');
const bcrypt = require('bcrypt');
const {JournalEntry} = require('../models');
const {Parser} = require('json2csv');
const {Session} = require('../models');

const getUserProfileByAdmin = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Brak uprawnień' });
  }
  const userId = req.params.userId;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    let profileData = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    if (user.role === 'therapist') {
      const therapist = await Therapist.findOne({ where: { user_id: userId } });
      profileData = {
        ...profileData,
        phone: therapist ? therapist.phone : '',
        address: therapist ? therapist.address : '',
        specialization: therapist ? therapist.specialization : '',
        date_of_birth: therapist ? therapist.date_of_birth : '',
        gender: therapist ? therapist.gender : '',
      };
    } else if (user.role === 'patient') {
      const patient = await Patient.findOne({ where: { user_id: userId } });
      profileData = {
        ...profileData,
        name: patient ? patient.name : '',
        contact: patient ? patient.contact : '',
        address: patient ? patient.address : '',
        date_of_birth: patient ? patient.date_of_birth : '',
        gender: patient ? patient.gender : '',
        emergency_contact: patient ? patient.emergency_contact : '',
      };
    }
    return res.status(200).json(profileData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


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

const updateUserDetailsByAdmin = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Brak uprawnień' });
  }

  const userId = req.params.userId;
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
      return res.status(404).json({ message: 'User not found' });
    }

    user.email = email || user.email;

    if (user.role === 'therapist') {
      const therapist = await Therapist.findOne({ where: { user_id: userId } });
      if (!therapist) {
        return res.status(404).json({ message: 'Therapist record not found' });
      }
      therapist.name = name || therapist.name;
      therapist.phone = phone || therapist.phone;
      therapist.address = address || therapist.address;
      therapist.specialization = specialization || therapist.specialization;
      therapist.date_of_birth = date_of_birth || therapist.date_of_birth;
      therapist.gender = gender || therapist.gender;
      await therapist.save();
    } else if (user.role === 'patient') {
      let patient = await Patient.findOne({ where: { user_id: userId } });
      if (!patient) {
        // Opcjonalnie: utwórz nowy rekord, jeśli go nie ma
        patient = await Patient.create({
          user_id: userId,
          name: name || '',
          contact: contact || '',
          address: address || '',
          date_of_birth: date_of_birth || '',
          gender: gender || '',
          emergency_contact: emergency_contact || '',
          journal_access: false, // lub inna domyślna wartość
        });
      } else {
        patient.name = name || patient.name;
        patient.contact = contact || patient.contact;
        patient.address = address || patient.address;
        patient.date_of_birth = date_of_birth || patient.date_of_birth;
        patient.gender = gender || patient.gender;
        patient.emergency_contact = emergency_contact || patient.emergency_contact;
        await patient.save();
      }
    }

    await user.save();
    return res.status(200).json({ message: 'User details updated successfully', user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
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

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'role'], // Pobieramy podstawowe dane użytkownika
      include: [
        {
          model: Patient,
          attributes: ['name'],
          required: false, // Użytkownik może nie mieć powiązanego rekordu w Patient
        },
        {
          model: Therapist,
          attributes: ['name'],
          required: false, // Użytkownik może nie mieć powiązanego rekordu w Therapist
        },
      ],
    });

    res.status(200).json(users);
  } catch (error) {
    console.error('Błąd pobierania użytkowników:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
};

module.exports = { getAllUsers };


const getTherapists = async (req, res) => {
  try {
    const therapists = await User.findAll({
      where: { role: 'therapist' },
      attributes: ['id', 'email', 'role'],
      include: [{
        model: Therapist,
        include: [{ model: Patient, as: 'Patients' }],
      }],
    });
    res.status(200).json(therapists);
  } catch (error) {
    console.error('Błąd pobierania terapeutów:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
};


const getPatients = async (req, res) => {
  try {
    const patients = await User.findAll({
      where: { role: 'patient' },
      attributes: ['id', 'email', 'role'], // podstawowe pola z modelu User
      include: [{
        model: Patient,
      }],
    });
    res.status(200).json(patients);
  } catch (error) {
    console.error('Błąd pobierania pacjentów:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
};

// controllers/assignmentController.js
const assignPatient = async (req, res) => {
  const { therapistId, patientId } = req.body;
  console.log('assignPatient - odebrane dane:', { therapistId, patientId }); // Log danych z żądania
  try {
    // Znajdź pacjenta
    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      console.error('Nie znaleziono pacjenta o id:', patientId);
      return res.status(404).json({ message: 'Nie znaleziono pacjenta' });
    }
    // Znajdź terapeutę
    const therapist = await Therapist.findByPk(therapistId);
    if (!therapist) {
      console.error('Nie znaleziono terapeuty o id:', therapistId);
      return res.status(404).json({ message: 'Nie znaleziono terapeuty' });
    }
    // Aktualizuj rekord pacjenta
    patient.therapist_id = therapistId;
    await patient.save();

    res.status(200).json({ message: 'Pacjent został przypisany pomyślnie', patient });
  } catch (error) {
    console.error('Błąd przy przypisywaniu pacjenta:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
};


const deleteUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    // Znajdź użytkownika po ID
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Opcjonalnie: jeśli użytkownik ma powiązane rekordy (np. Patient lub Therapist), można je usunąć lub zaktualizować.
    // Dla przykładu, jeśli rola to 'patient', usuń powiązany rekord z modelu Patient:
    if (user.role === 'patient') {
      await Patient.destroy({ where: { user_id: userId } });
    }
    if (user.role === 'therapist') {
      await Therapist.destroy({ where: { user_id: userId } });
    }

    // Usuń użytkownika
    await user.destroy();

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  updateUserDetails,
  changePassword,
  setNotifications,
  exportJournalData,
  getSessionHistory,
  getMoodHistory,
  getAllUsers,
  updateUserDetailsByAdmin,
  getUserProfileByAdmin,
  getTherapists,
  assignPatient,
  getPatients,
  deleteUser,
};
