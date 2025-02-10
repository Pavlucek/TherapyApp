const { Resource, SharedResource, Patient } = require('../models');

// Tworzenie materiału i opcjonalne udostępnianie go pacjentom
const addMaterial = async (req, res) => {
  const { title, description, url, patient_ids } = req.body;
  const therapist_id = req.user.id;

  console.log('Adding new material:', { title, description, url, therapist_id, patient_ids });

  try {
    // Tworzenie materiału
    const newMaterial = await Resource.create({
      therapist_id,
      title,
      description,
      url,
    });
    console.log('New material created:', newMaterial);

    // Udostępnianie materiału pacjentom
    if (patient_ids && patient_ids.length > 0) {
      const sharedResources = patient_ids.map(patient_id => ({
        patient_id,
        resource_id: newMaterial.id,
      }));
      console.log('Sharing material with patients:', sharedResources);
      await SharedResource.bulkCreate(sharedResources);
    }

    res.status(201).json(newMaterial);
  } catch (error) {
    console.error('Error adding material:', error);
    res.status(500).json({ error: error.message });
  }
};

// Przegląd materiałów – dostępne zarówno dla pacjentów, jak i terapeutów
const getMaterials = async (req, res) => {
  const { role, id: userId } = req.user;

  console.log('Fetching materials for user:', { role, userId });

  try {
    let materials;

    if (role === 'patient') {
      // Pobieranie pacjenta na podstawie user_id
      const patient = await Patient.findOne({ where: { user_id: userId } });
      
      if (!patient) {
        return res.status(400).json({ error: 'Patient not found for this user' });
      }

      const patientId = patient.id; // Poprawne patient_id

      console.log('Fetching materials for patient with patientId:', patientId);

      materials = await SharedResource.findAll({
        where: { patient_id: patientId },
        include: [{
          model: Resource,
        }],
      });

      console.log('Materials for patient:', materials);

    } else if (role === 'therapist') {
      const therapistId = userId;

      console.log('Fetching materials for therapist with therapistId:', therapistId);

      materials = await Resource.findAll({
        where: { therapist_id: therapistId }
      });

      console.log('Materials for therapist:', materials);
    }

    res.status(200).json(materials);
  } catch (error) {
    console.error('Error fetching materials:', error);
    res.status(500).json({ error: error.message });
  }
};

// Udostępnianie istniejącego materiału wybranym pacjentom
const shareMaterial = async (req, res) => {
  const { resource_id, patient_ids } = req.body;

  console.log('Sharing material with patients:', { resource_id, patient_ids });

  try {
    const material = await Resource.findByPk(resource_id);
    if (!material) {
      console.log('Material not found:', resource_id);
      return res.status(404).json({ error: 'Material not found' });
    }

    const sharedResources = patient_ids.map(patient_id => ({
      patient_id,
      resource_id,
    }));
    console.log('Adding shared resources:', sharedResources);
    await SharedResource.bulkCreate(sharedResources);

    res.status(201).json({ message: 'Material shared successfully' });
  } catch (error) {
    console.error('Error sharing material:', error);
    res.status(500).json({ error: error.message });
  }
};

// Usuwanie materiału - dostępne tylko dla terapeutów
const deleteMaterial = async (req, res) => {
  const { resource_id } = req.params;

  console.log('Deleting material:', resource_id);

  try {
    const material = await Resource.findByPk(resource_id);
    if (!material) {
      console.log('Material not found:', resource_id);
      return res.status(404).json({ error: 'Material not found' });
    }

    // Usunięcie powiązań z pacjentami
    console.log('Removing shared resources for material:', resource_id);
    await SharedResource.destroy({ where: { resource_id } });

    // Usunięcie materiału
    await material.destroy();

    res.status(200).json({ message: 'Material deleted successfully' });
  } catch (error) {
    console.error('Error deleting material:', error);
    res.status(500).json({ error: error.message });
  }
};

// Usuwanie dostępu pacjenta do materiału
const removeMaterialForPatient = async (req, res) => {
  const { resource_id, patient_id } = req.body;

  console.log('Removing access to material for patient:', { resource_id, patient_id });

  try {
    const sharedResource = await SharedResource.findOne({
      where: { resource_id, patient_id },
    });

    if (!sharedResource) {
      console.log('Material not found for patient:', { resource_id, patient_id });
      return res.status(404).json({ error: 'Material not found for this patient' });
    }

    await sharedResource.destroy();

    res.status(200).json({ message: 'Material access removed for patient' });
  } catch (error) {
    console.error('Error removing access for patient:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addMaterial,
  getMaterials,
  shareMaterial,
  deleteMaterial,
  removeMaterialForPatient,
};
