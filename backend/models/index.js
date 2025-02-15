const { Sequelize, DataTypes } = require('sequelize');
const env = process.env.NODE_ENV || 'development';
// Load the configuration for the current environment
const config = require('../config/config')[env];

// Create a new Sequelize instance using the configuration properties
const sequelize = new Sequelize({
  dialect: config.dialect,
  storage: config.storage,
  logging: false, // set to console.log if you want to see SQL logs
});

// Import models
const User = require('./user')(sequelize, DataTypes);
const Therapist = require('./therapist')(sequelize, DataTypes);
const Patient = require('./patient')(sequelize, DataTypes);
const Session = require('./session')(sequelize, DataTypes);
const Resource = require('./resource')(sequelize, DataTypes);
const Note = require('./note')(sequelize, DataTypes);
const JournalEntry = require('./journalEntry')(sequelize, DataTypes);
const MedicalHistory = require('./medicalHistory')(sequelize, DataTypes);
const DiscussionBoard = require('./discussionBoard')(sequelize, DataTypes);
const CommentMaterials = require('./CommentMaterials')(sequelize, DataTypes);
const FavoriteMaterials = require('./FavoriteMaterials')(sequelize, DataTypes);
const SharedResource = require('./SharedResource')(sequelize, DataTypes); // Dodany model SharedResource

// Define associations

// User i związane modele
User.hasOne(Therapist, { foreignKey: 'user_id' });
User.hasOne(Patient, { foreignKey: 'user_id' });
User.hasMany(CommentMaterials, { foreignKey: 'user_id' });
CommentMaterials.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(FavoriteMaterials, { foreignKey: 'user_id' });
FavoriteMaterials.belongsTo(User, { foreignKey: 'user_id' });

// Relacje terapeuta-pacjent
Therapist.hasMany(Patient, { foreignKey: 'therapist_id' });
Patient.belongsTo(Therapist, { foreignKey: 'therapist_id' });

// Session
Patient.hasMany(Session, { foreignKey: 'patient_id' });
Therapist.hasMany(Session, { foreignKey: 'therapist_id' });

// Resource i powiązane modele
Therapist.hasMany(Resource, { foreignKey: 'therapist_id' });
Resource.belongsTo(Therapist, { foreignKey: 'therapist_id' });
Resource.hasMany(CommentMaterials, { foreignKey: 'resource_id' });
CommentMaterials.belongsTo(Resource, { foreignKey: 'resource_id' });
Resource.hasMany(FavoriteMaterials, { foreignKey: 'resource_id' });
FavoriteMaterials.belongsTo(Resource, { foreignKey: 'resource_id' });

// Note, JournalEntry, MedicalHistory
Patient.hasMany(Note, { foreignKey: 'patient_id' });
Therapist.hasMany(Note, { foreignKey: 'therapist_id' });
Patient.hasMany(JournalEntry, { foreignKey: 'patient_id' });
Patient.hasMany(MedicalHistory, { foreignKey: 'patient_id' });
Therapist.hasMany(MedicalHistory, { foreignKey: 'therapist_id' });

// DiscussionBoard
Patient.hasMany(DiscussionBoard, { foreignKey: 'patient_id' });
Therapist.hasMany(DiscussionBoard, { foreignKey: 'therapist_id' });

// SharedResource - powiązanie materiału (Resource) z pacjentem
Patient.hasMany(SharedResource, { foreignKey: 'patient_id' });
Resource.hasMany(SharedResource, { foreignKey: 'resource_id' });
SharedResource.belongsTo(Patient, { foreignKey: 'patient_id' });
SharedResource.belongsTo(Resource, { foreignKey: 'resource_id' });

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
  CommentMaterials,
  FavoriteMaterials,
  SharedResource, // Eksportujemy model SharedResource
};
