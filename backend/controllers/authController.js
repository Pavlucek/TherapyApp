const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User, Therapist, Patient} = require('../models');
const config = require('../config/config');
const generateTherapistCode = require('../utils/generateTherapistCode');

// Rejestracja administratora
const registerAdmin = async (req, res) => {
  const {email, password} = req.body;
  try {
    const existingUser = await User.findOne({where: {email}});
    if (existingUser) {
      return res.status(400).json({message: 'Email already in use'});
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      role: 'admin',
    });
    res.status(201).json({message: 'Admin registered successfully', user});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

// Rejestracja terapeuty
const registerTherapist = async (req, res) => {
  const {
    email,
    password,
    name,
    phone,
    address,
    specialization,
    date_of_birth,
    gender,
  } = req.body;
  try {
    const existingUser = await User.findOne({where: {email}});
    if (existingUser) {
      return res.status(400).json({message: 'Email already in use'});
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const therapist_code = generateTherapistCode(); // Wygeneruj unikalny kod
    const user = await User.create({
      email,
      password: hashedPassword,
      role: 'therapist',
      therapist_code,
    });
    await Therapist.create({
      user_id: user.id,
      name,
      phone,
      address,
      specialization,
      date_of_birth,
      gender,
    });
    res
      .status(201)
      .json({message: 'Therapist registered successfully', therapist_code});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

// Rejestracja pacjenta
const registerPatient = async (req, res) => {
  const {
    email,
    password,
    name,
    date_of_birth,
    contact,
    address,
    medical_history,
    gender,
    emergency_contact,
  } = req.body;
  try {
    const existingUser = await User.findOne({where: {email}});
    if (existingUser) {
      return res.status(400).json({message: 'Email already in use'});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Sprawdź poprawność terapeuty
    let therapistId;
    if (req.user.role === 'therapist') {
      therapistId = req.user.id;
    } else {
      therapistId = req.body.therapist_id;
      const therapist = await Therapist.findOne({where: {id: therapistId}});
      if (!therapist) {
        return res.status(400).json({error: 'Invalid therapist ID'});
      }
    }

    const user = await User.create({
      email,
      password: hashedPassword,
      role: 'patient',
    });
    await Patient.create({
      user_id: user.id,
      therapist_id: therapistId,
      name,
      date_of_birth,
      contact,
      address,
      medical_history,
      gender,
      emergency_contact,
    });
    res.status(201).json({
      message: 'Patient registered successfully',
      login: user.email,
      password,
      therapist_code: req.user.therapist_code,
    });
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

// Logowanie użytkownika
const loginUser = async (req, res) => {
  const {email, password} = req.body;
  try {
    const user = await User.findOne({where: {email}});
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({id: user.id, role: user.role}, config.secret, {
        expiresIn: '1h',
      });

      // Pobierz dodatkowe informacje o użytkowniku, np. nazwę
      let userName = '';

      if (user.role === 'therapist') {
        const therapist = await Therapist.findOne({where: {user_id: user.id}});
        if (!therapist) {
          return res.status(404).json({error: 'Therapist record not found'});
        }
        userName = therapist.name;
      } else if (user.role === 'patient') {
        const patient = await Patient.findOne({where: {user_id: user.id}});
        if (!patient) {
          return res.status(404).json({error: 'Patient record not found'});
        }
        userName = patient.name;
      }

      res.json({token, role: user.role, userName});
    } else {
      res.status(401).json({message: 'Invalid credentials'});
    }
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

module.exports = {
  registerAdmin,
  registerTherapist,
  registerPatient,
  loginUser,
};
