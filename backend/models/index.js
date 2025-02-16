// models/index.js
const { Sequelize, DataTypes } = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

// Inicjalizacja Sequelize z konfiguracją
const sequelize = new Sequelize({
  dialect: config.dialect,
  storage: config.storage,
  logging: false,
});

// Import modeli (bez definicji asocjacji w plikach modeli!)
const User = require('./user')(sequelize, DataTypes);
const Therapist = require('./therapist')(sequelize, DataTypes);
const Patient = require('./patient')(sequelize, DataTypes);
const Session = require('./session')(sequelize, DataTypes);
const Resource = require('./resource')(sequelize, DataTypes);
const Note = require('./note')(sequelize, DataTypes);
const MedicalHistory = require('./medicalHistory')(sequelize, DataTypes);
const DiscussionBoard = require('./discussionBoard')(sequelize, DataTypes);
const CommentMaterials = require('./CommentMaterials')(sequelize, DataTypes);
const FavoriteMaterials = require('./FavoriteMaterials')(sequelize, DataTypes);
const SharedResource = require('./SharedResource')(sequelize, DataTypes);
const SessionDocument = require('./SessionDocument')(sequelize, DataTypes);
const SessionResource = require('./SessionResource')(sequelize, DataTypes);

// Nowe modele JournalEntry, Tag, JournalEntryTag i Reflection
const JournalEntry = require('./journalEntry')(sequelize, DataTypes);
const Tag = require('./tag')(sequelize, DataTypes);
const JournalEntryTag = require('./journalEntryTag')(sequelize, DataTypes);
const Reflection = require('./reflection')(sequelize, DataTypes);

// ================================
// Definiowanie ASOCJACJI W TYM PLIKU
// ================================

// 1. User i modele powiązane
User.hasOne(Therapist, { foreignKey: 'user_id' });
User.hasOne(Patient, { foreignKey: 'user_id' });
User.hasMany(CommentMaterials, { foreignKey: 'user_id' });
CommentMaterials.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(FavoriteMaterials, { foreignKey: 'user_id' });
FavoriteMaterials.belongsTo(User, { foreignKey: 'user_id' });

// 2. Relacje terapeuta-pacjent
Therapist.hasMany(Patient, { foreignKey: 'therapist_id' });
Patient.belongsTo(Therapist, { foreignKey: 'therapist_id' });

// 3. Session
Patient.hasMany(Session, { foreignKey: 'patient_id' });
Therapist.hasMany(Session, { foreignKey: 'therapist_id' });

// 4. Resource i powiązane modele
Therapist.hasMany(Resource, { foreignKey: 'therapist_id' });
Resource.belongsTo(Therapist, { foreignKey: 'therapist_id' });
Resource.hasMany(CommentMaterials, { foreignKey: 'resource_id' });
CommentMaterials.belongsTo(Resource, { foreignKey: 'resource_id' });
Resource.hasMany(FavoriteMaterials, { foreignKey: 'resource_id' });
FavoriteMaterials.belongsTo(Resource, { foreignKey: 'resource_id' });

// 5. Note, JournalEntry, MedicalHistory
Patient.hasMany(Note, { foreignKey: 'patient_id' });
Therapist.hasMany(Note, { foreignKey: 'therapist_id' });
Patient.hasMany(JournalEntry, { foreignKey: 'patient_id' });
JournalEntry.belongsTo(Patient, { foreignKey: 'patient_id' });
Patient.hasMany(MedicalHistory, { foreignKey: 'patient_id' });
Therapist.hasMany(MedicalHistory, { foreignKey: 'therapist_id' });

// 6. DiscussionBoard
Patient.hasMany(DiscussionBoard, { foreignKey: 'patient_id' });
Therapist.hasMany(DiscussionBoard, { foreignKey: 'therapist_id' });

// 7. SharedResource (pacjent ↔ resource)
Patient.hasMany(SharedResource, { foreignKey: 'patient_id' });
Resource.hasMany(SharedResource, { foreignKey: 'resource_id' });
SharedResource.belongsTo(Patient, { foreignKey: 'patient_id' });
SharedResource.belongsTo(Resource, { foreignKey: 'resource_id' });

// 8. SessionDocument (1-wiele)
Session.hasMany(SessionDocument, { foreignKey: 'session_id', as: 'documents' });
SessionDocument.belongsTo(Session, { foreignKey: 'session_id', as: 'session' });

// 9. SessionResource (wiele do wielu)
Session.belongsToMany(Resource, {
  through: SessionResource,
  foreignKey: 'session_id',
  as: 'resources',
});
Resource.belongsToMany(Session, {
  through: SessionResource,
  foreignKey: 'resource_id',
  as: 'sessions',
});

// ================================
// NOWE RELACJE (JournalEntry, Tag, JournalEntryTag, Reflection)
// ================================

// a) Relacja wiele-do-wielu: JournalEntry ↔ Tag (przez JournalEntryTag)
JournalEntry.belongsToMany(Tag, {
  through: JournalEntryTag,
  foreignKey: 'journalEntryId',
  otherKey: 'tagId',
  as: 'tagsMany', // alias, np. entry.getTagsMany()
});
Tag.belongsToMany(JournalEntry, {
  through: JournalEntryTag,
  foreignKey: 'tagId',
  otherKey: 'journalEntryId',
  as: 'entries', // alias, np. tag.getEntries()
});

// b) Relacja 1-wiele: JournalEntry ↔ Reflection
// Reflection ma foreignKey `entryId` => odwołuje się do JournalEntry
JournalEntry.hasMany(Reflection, {
  foreignKey: 'entryId',
  as: 'reflections',
});
Reflection.belongsTo(JournalEntry, {
  foreignKey: 'entryId',
  as: 'journalEntry',
});

// ================================
// Eksport obiektów
// ================================
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
  SharedResource,
  SessionDocument,
  SessionResource,
  Tag,
  JournalEntryTag,
  Reflection,
};
