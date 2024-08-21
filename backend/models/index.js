const {Sequelize, DataTypes} = require('sequelize');
const config = require('../config/config');

const sequelize = new Sequelize(config.db);

const User = require('./user')(sequelize, DataTypes);
const Therapist = require('./therapist')(sequelize, DataTypes);
const Patient = require('./patient')(sequelize, DataTypes);
const Session = require('./session')(sequelize, DataTypes);
const Resource = require('./resource')(sequelize, DataTypes);
const Note = require('./note')(sequelize, DataTypes);
const JournalEntry = require('./journalEntry')(sequelize, DataTypes);
const MedicalHistory = require('./medicalHistory')(sequelize, DataTypes);
const DiscussionBoard = require('./discussionBoard')(sequelize, DataTypes);

// Define associations
User.hasOne(Therapist, {foreignKey: 'user_id'});
User.hasOne(Patient, {foreignKey: 'user_id'});
Therapist.hasMany(Patient, {foreignKey: 'therapist_id'});
Patient.hasMany(Session, {foreignKey: 'patient_id'});
Therapist.hasMany(Session, {foreignKey: 'therapist_id'});
Therapist.hasMany(Resource, {foreignKey: 'therapist_id'});
Patient.hasMany(Note, {foreignKey: 'patient_id'});
Therapist.hasMany(Note, {foreignKey: 'therapist_id'});
Patient.hasMany(JournalEntry, {foreignKey: 'patient_id'});
Patient.hasMany(MedicalHistory, {foreignKey: 'patient_id'});
Therapist.hasMany(MedicalHistory, {foreignKey: 'therapist_id'});
Patient.hasMany(DiscussionBoard, {foreignKey: 'patient_id'});
Therapist.hasMany(DiscussionBoard, {foreignKey: 'therapist_id'});

sequelize.sync();

module.exports = {
  sequelize,
  User,
  Therapist,
  Patient,
  Session,
  Resource,
  Note,
  JournalEntry,
  MedicalHistory,
  DiscussionBoard,
};
