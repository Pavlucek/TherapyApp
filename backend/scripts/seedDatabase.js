const bcrypt = require('bcrypt');
const {
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
  SharedResource
} = require('../models');

const saltRounds = 10;

const seedDatabase = async () => {
  try {
    // Wyłącz klucze obce przed resetowaniem tabel
    await sequelize.query('PRAGMA foreign_keys = OFF');

    // Zresetuj bazę danych
    await sequelize.sync({ force: true });
    console.log('Database reset successfully.');

    // Włącz klucze obce po resetowaniu tabel
    await sequelize.query('PRAGMA foreign_keys = ON');

    // Haszowanie haseł
    const hashedPassword = await bcrypt.hash('password', saltRounds);
    console.log('Passwords hashed successfully.');

    // Dodaj przykładowych użytkowników
    const users = await Promise.all([
      User.create({
        email: 'therapist@example.com',
        password: hashedPassword,
        role: 'therapist',
        therapist_code: 'TH123'
      }),
      User.create({
        email: 'patient@example.com',
        password: hashedPassword,
        role: 'patient'
      }),
      User.create({
        email: 'patient2@example.com',
        password: hashedPassword,
        role: 'patient'
      }),
      User.create({
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin'
      })
    ]);
    console.log('Users created successfully:', users.map(u => u.id));

    // Dodaj terapeutów
    const therapists = await Promise.all([
      Therapist.create({
        user_id: users[0].id,
        name: 'Dr. Smith',
        phone: '123-456-7890',
        address: '123 Main St',
        specialization: 'Cognitive Behavioral Therapy',
        date_of_birth: '1980-01-01',
        gender: 'Male'
      })
    ]);
    console.log('Therapists created successfully:', therapists.map(t => t.id));

    // Dodaj pacjentów
    const patients = await Promise.all([
      Patient.create({
        user_id: users[1].id,
        therapist_id: therapists[0].id,
        name: 'Jane Doe',
        date_of_birth: '1990-05-15',
        contact: 'jane.doe@example.com',
        address: '456 Elm St',
        medical_history: 'No significant history',
        gender: 'Female',
        emergency_contact: 'John Doe - 789-456-1230',
        journal_access: true
      }),
      Patient.create({
        user_id: users[2].id,
        therapist_id: therapists[0].id,
        name: 'John Smith',
        date_of_birth: '1985-03-20',
        contact: 'john.smith@example.com',
        address: '789 Pine St',
        medical_history: 'History of anxiety',
        gender: 'Male',
        emergency_contact: 'Mary Smith - 789-123-4560',
        journal_access: true
      })
    ]);
    console.log('Patients created successfully:', patients.map(p => p.id));

    // Dodaj sesje
    try {
      const sessions = await Promise.all([
        Session.create({
          patient_id: patients[0].id,
          therapist_id: therapists[0].id,
          date: '2024-09-10',
          notes: 'Initial assessment session'
        }),
        Session.create({
          patient_id: patients[1].id,
          therapist_id: therapists[0].id,
          date: '2024-09-11',
          notes: 'Follow-up session on anxiety management'
        })
      ]);
      console.log('Sessions created successfully:', sessions.map(s => s.id));
    } catch (error) {
      console.error('Error creating sessions:', error);
    }

    // Dodaj zasoby
    const resources = await Promise.all([
      Resource.create({
        therapist_id: therapists[0].id,
        title: 'CBT Workbook',
        description: 'A workbook for cognitive behavioral therapy exercises.',
        url: 'http://example.com/cbt-workbook'
      }),
      Resource.create({
        therapist_id: therapists[0].id,
        title: 'Mindfulness Guide',
        description: 'A guide to mindfulness and stress reduction techniques.',
        url: 'http://example.com/mindfulness-guide'
      })
    ]);
    console.log('Resources created successfully:', resources.map(r => r.id));

    // Dodaj współdzielone materiały
    try {
      await SharedResource.bulkCreate([
        {
          patient_id: patients[0].id,
          resource_id: resources[0].id
        },
        {
          patient_id: patients[0].id,
          resource_id: resources[1].id
        }
      ]);
      console.log('Shared resources created successfully.');
    } catch (error) {
      console.error('Error creating shared resources:', error);
    }

    // Dodaj notatki
    try {
      await Promise.all([
        Note.create({
          patient_id: patients[0].id,
          therapist_id: therapists[0].id,
          date: '2024-09-10',
          title: 'Session Notes',
          content: 'Notes from the initial assessment session.',
          goals: 'Establish treatment goals',
          techniques: 'CBT techniques',
          priority: 1,
          attachments: null
        }),
        Note.create({
          patient_id: patients[1].id,
          therapist_id: therapists[0].id,
          date: '2024-09-11',
          title: 'Anxiety Management Follow-up',
          content: 'Discussion on progress with anxiety management.',
          goals: 'Continue with mindfulness exercises',
          techniques: 'Mindfulness and relaxation techniques',
          priority: 2,
          attachments: null
        })
      ]);
      console.log('Notes created successfully.');
    } catch (error) {
      console.error('Error creating notes:', error);
    }

    // Dodaj wpisy dziennika
    try {
      await Promise.all([
        JournalEntry.create({
          patient_id: patients[0].id,
          date: '2024-09-10',
          time: '08:00',
          title: 'Daily Mood',
          content: 'Feeling good about the session.',
          mood: 5,
          tags: 'mood',
          image: null,
          audio: null,
          category: 'Mood',
          location: 'Home',
          weather: 'Sunny',
          activity: 'Jogging'
        }),
        JournalEntry.create({
          patient_id: patients[1].id,
          date: '2024-09-11',
          time: '10:00',
          title: 'Anxiety Levels',
          content: 'Feeling anxious in the morning but improved after relaxation exercises.',
          mood: 3,
          tags: 'anxiety',
          image: null,
          audio: null,
          category: 'Mood',
          location: 'Office',
          weather: 'Cloudy',
          activity: 'Work'
        })
      ]);
      console.log('Journal entries created successfully.');
    } catch (error) {
      console.error('Error creating journal entries:', error);
    }

    // Dodaj historię medyczną
    try {
      await MedicalHistory.create({
        patient_id: patients[0].id,
        therapist_id: therapists[0].id,
        date: '2024-09-10',
        physical_health: 'Good',
        chronic_diseases: 'None',
        allergies: 'None',
        medications: 'None',
        surgical_history: 'None',
        family_medical_history: 'No significant history',
        current_symptoms: 'None',
        lifestyle: 'Active',
        psychological_history: 'No significant history'
      });
      console.log('Medical history created successfully.');
    } catch (error) {
      console.error('Error creating medical history:', error);
    }

    // Dodaj dyskusje
    try {
      await Promise.all([
        DiscussionBoard.create({
          patient_id: patients[0].id,
          therapist_id: therapists[0].id,
          date: '2024-09-10',
          sender: 'Patient',
          message: 'Hello, I would like to discuss my progress.',
          attachment: null,
          read: false
        }),
        DiscussionBoard.create({
          patient_id: patients[1].id,
          therapist_id: therapists[0].id,
          date: '2024-09-11',
          sender: 'Therapist',
          message: 'How are you feeling after the last session?',
          attachment: null,
          read: false
        })
      ]);
      console.log('Discussion board entries created successfully.');
    } catch (error) {
      console.error('Error creating discussion board entries:', error);
    }

    console.log('Database seeded successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

seedDatabase();
