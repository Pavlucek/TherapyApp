// controllers/sessionController.js
const { Session, SessionDocument, Resource, SessionResource, Patient } = require('../models');

module.exports = {
  // Tworzenie nowej sesji
  createSession: async (req, res) => {
    try {
      const session = await Session.create(req.body);
      res.status(201).json(session);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Pobranie wszystkich sesji wraz z dokumentami i materiałami
  getSessions: async (req, res) => {
    try {
      const sessions = await Session.findAll({
        include: [
          { model: SessionDocument, as: 'documents' },
          { model: Resource, as: 'resources' },
          { model: Patient, attributes: ['name'] },
        ],
      });
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },


  // Pobranie pojedynczej sesji po ID z dokumentami i materiałami
  getSession: async (req, res) => {
    try {
      const session = await Session.findByPk(req.params.id, {
        include: [
          { model: SessionDocument, as: 'documents' },
          { model: Resource, as: 'resources' },
          { model: Patient, attributes: ['name'] }, // Dołączamy model Patient i pobieramy atrybut "name"
        ],
      });
      if (!session) {
        return res.status(404).json({ message: 'Sesja nie została znaleziona' });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },


  // Aktualizacja sesji
  updateSession: async (req, res) => {
    try {
      const session = await Session.findByPk(req.params.id);
      if (!session) {
        return res.status(404).json({ message: 'Sesja nie została znaleziona' });
      }
      await session.update(req.body);
      res.json(session);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Usunięcie sesji
  deleteSession: async (req, res) => {
    try {
      const session = await Session.findByPk(req.params.id);
      if (!session) {
        return res.status(404).json({ message: 'Sesja nie została znaleziona' });
      }
      await session.destroy();
      res.json({ message: 'Sesja została usunięta' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Dodanie dokumentu (np. zadania domowego) do sesji
  addDocument: async (req, res) => {
    try {
      // Oczekujemy, że req.body zawiera m.in. title, content, dueDate, submitted, feedback
      const sessionDocument = await SessionDocument.create({
        session_id: req.params.id,
        ...req.body,
      });
      res.status(201).json(sessionDocument);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Pobranie dokumentów przypisanych do danej sesji
  getDocuments: async (req, res) => {
    try {
      const documents = await SessionDocument.findAll({
        where: { session_id: req.params.id },
      });
      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Przypisanie materiału (Resource) do sesji
  addResource: async (req, res) => {
    try {
      // Oczekujemy, że req.body zawiera resource_id oraz opcjonalnie completed
      const { resource_id, completed } = req.body;
      const sessionResource = await SessionResource.create({
        session_id: req.params.id,
        resource_id,
        completed: completed || false,
      });
      res.status(201).json(sessionResource);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Pobranie materiałów przypisanych do danej sesji
  getResources: async (req, res) => {
    try {
      const session = await Session.findByPk(req.params.id, {
        include: [{ model: Resource, as: 'resources' }],
      });
      if (!session) {
        return res.status(404).json({ message: 'Sesja nie została znaleziona' });
      }
      res.json(session.resources);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
