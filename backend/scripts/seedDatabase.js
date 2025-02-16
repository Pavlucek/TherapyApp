// scripts/seedDatabase.js
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
  CommentMaterials,
  FavoriteMaterials,
  SharedResource,
  SessionDocument,
  SessionResource,
  Tag,
  JournalEntryTag,
  Reflection,
} = require('../models');

// Funkcja tworząca użytkownika, gdzie hasło to część emaila przed '@'
const createUser = async (userData) => {
  const localPart = userData.email.split('@')[0];
  const hashedPassword = await bcrypt.hash(localPart, saltRounds);
  return User.create({ ...userData, password: hashedPassword });
};

const seedDatabase = async () => {
  try {
    // Wyłącz klucze obce (SQLite)
    await sequelize.query('PRAGMA foreign_keys = OFF');

    // Zresetuj bazę danych
    await sequelize.sync({ force: true });
    console.log('Baza danych została zresetowana.');

    // Włącz klucze obce
    await sequelize.query('PRAGMA foreign_keys = ON');

    // Tworzenie użytkowników – hasło = część emaila przed '@'
    const users = await Promise.all([
      createUser({
        email: 'terapeuta1@przyklad.pl',
        role: 'therapist',
        therapist_code: 'TH001',
      }),
      createUser({
        email: 'terapeuta2@przyklad.pl',
        role: 'therapist',
        therapist_code: 'TH002',
      }),
      createUser({
        email: 'pacjent1@przyklad.pl',
        role: 'patient',
      }),
      createUser({
        email: 'pacjent2@przyklad.pl',
        role: 'patient',
      }),
      createUser({
        email: 'pacjent3@przyklad.pl',
        role: 'patient',
      }),
      createUser({
        email: 'admin@przyklad.pl',
        role: 'admin',
      }),
    ]);
    console.log('Użytkownicy utworzeni:', users.map(u => u.id));

    // Tworzenie terapeutów
    const terapeuci = await Promise.all([
      Therapist.create({
        user_id: users[0].id,
        name: 'Dr. Kowalski',
        phone: '111-222-333',
        address: 'ul. Warszawska 1, Warszawa',
        specialization: 'Psychoterapia poznawczo-behawioralna',
        date_of_birth: '1975-04-10',
        gender: 'Mężczyzna',
      }),
      Therapist.create({
        user_id: users[1].id,
        name: 'Dr. Nowak',
        phone: '444-555-666',
        address: 'ul. Krakowska 5, Kraków',
        specialization: 'Psychoterapia Gestalt',
        date_of_birth: '1980-08-15',
        gender: 'Kobieta',
      }),
    ]);
    console.log('Terapeuci utworzeni:', terapeuci.map(t => t.id));

    // Tworzenie pacjentów
    const pacjenci = await Promise.all([
      Patient.create({
        user_id: users[2].id,
        therapist_id: terapeuci[0].id,
        name: 'Anna Kowalczyk',
        date_of_birth: '1992-06-12',
        contact: 'anna.kowalczyk@przyklad.pl',
        address: 'ul. Lipowa 3, Warszawa',
        medical_history: 'Brak poważniejszych schorzeń',
        gender: 'Kobieta',
        emergency_contact: 'Michał Kowalczyk - 123-456-789',
        journal_access: true,
      }),
      Patient.create({
        user_id: users[3].id,
        therapist_id: terapeuci[0].id,
        name: 'Marek Wiśniewski',
        date_of_birth: '1988-11-22',
        contact: 'marek.wisniewski@przyklad.pl',
        address: 'ul. Ogrodowa 7, Poznań',
        medical_history: 'Historia lęków',
        gender: 'Mężczyzna',
        emergency_contact: 'Ewa Wiśniewska - 987-654-321',
        journal_access: true,
      }),
      Patient.create({
        user_id: users[4].id,
        therapist_id: terapeuci[1].id,
        name: 'Katarzyna Lewandowska',
        date_of_birth: '1995-03-30',
        contact: 'kasia.lewandowska@przyklad.pl',
        address: 'ul. Słoneczna 10, Gdańsk',
        medical_history: 'Problemy z niskim poczuciem własnej wartości',
        gender: 'Kobieta',
        emergency_contact: 'Piotr Lewandowski - 555-666-777',
        journal_access: true,
      }),
    ]);
    console.log('Pacjenci utworzeni:', pacjenci.map(p => p.id));

    // Tworzenie sesji (kilka sesji dla każdego pacjenta)
    const sesje = await Promise.all([
      // Sesje dla Anny Kowalczyk (pacjent1)
      Session.create({
        patient_id: pacjenci[0].id,
        therapist_id: terapeuci[0].id,
        date: '2024-10-01',
        startTime: '09:00',
        endTime: '10:00',
        notes: 'Pierwsza sesja zapoznawcza',
      }),
      Session.create({
        patient_id: pacjenci[0].id,
        therapist_id: terapeuci[0].id,
        date: '2024-10-08',
        startTime: '09:00',
        endTime: '10:00',
        notes: 'Druga sesja follow-up',
      }),

      // Sesje dla Marka Wiśniewskiego (pacjent2)
      Session.create({
        patient_id: pacjenci[1].id,
        therapist_id: terapeuci[0].id,
        date: '2024-10-02',
        startTime: '11:00',
        endTime: '12:00',
        notes: 'Sesja dotycząca lęków',
      }),
      Session.create({
        patient_id: pacjenci[1].id,
        therapist_id: terapeuci[0].id,
        date: '2024-10-09',
        startTime: '11:00',
        endTime: '12:00',
        notes: 'Sesja pogłębiająca temat lęków',
      }),

      // Sesje dla Katarzyny Lewandowskiej (pacjentka3)
      Session.create({
        patient_id: pacjenci[2].id,
        therapist_id: terapeuci[1].id,
        date: '2024-10-03',
        startTime: '14:00',
        endTime: '15:00',
        notes: 'Sesja wsparcia emocjonalnego',
      }),
      Session.create({
        patient_id: pacjenci[2].id,
        therapist_id: terapeuci[1].id,
        date: '2024-10-10',
        startTime: '14:00',
        endTime: '15:00',
        notes: 'Sesja pogłębiona, omówiono strategie radzenia sobie',
      }),
    ]);
    console.log('Sesje utworzone:', sesje.map(s => s.id));

    // Tworzenie zasobów (przynajmniej 5)
    const zasoby = await Promise.all([
      Resource.create({
        therapist_id: terapeuci[0].id,
        title: 'Poradnik CBT',
        description: 'Poradnik do ćwiczeń z terapii poznawczo-behawioralnej.',
        url: 'http://przyklad.pl/cbt',
      }),
      Resource.create({
        therapist_id: terapeuci[0].id,
        title: 'Przewodnik Mindfulness',
        description: 'Instrukcje relaksacyjne i medytacyjne.',
        url: 'http://przyklad.pl/mindfulness',
      }),
      Resource.create({
        therapist_id: terapeuci[1].id,
        title: 'Artykuł o stresie',
        description: 'Jak radzić sobie ze stresem dnia codziennego.',
        url: 'http://przyklad.pl/stres',
      }),
      Resource.create({
        therapist_id: terapeuci[1].id,
        title: 'Techniki relaksacyjne',
        description: 'Ćwiczenia oddechowe i relaksacyjne.',
        url: 'http://przyklad.pl/relaks',
      }),
      Resource.create({
        therapist_id: terapeuci[0].id,
        title: 'Dziennik uczuć',
        description: 'Narzędzie do monitorowania emocji.',
        url: 'http://przyklad.pl/dziennik',
      }),
      // Dodatkowy materiał
      Resource.create({
        therapist_id: terapeuci[1].id,
        title: 'Artykuł o samoakceptacji',
        description: 'Porady, jak budować poczucie własnej wartości.',
        url: 'http://przyklad.pl/samoakceptacja',
      }),
    ]);
    console.log('Zasoby utworzone:', zasoby.map(r => r.id));

    // Tworzenie współdzielonych zasobów - przypisanie kilku materiałów dla każdego pacjenta
    await Promise.all([
      // Dla Anny Kowalczyk
      SharedResource.create({ patient_id: pacjenci[0].id, resource_id: zasoby[0].id }),
      SharedResource.create({ patient_id: pacjenci[0].id, resource_id: zasoby[1].id }),
      // Dla Marka Wiśniewskiego
      SharedResource.create({ patient_id: pacjenci[1].id, resource_id: zasoby[2].id }),
      SharedResource.create({ patient_id: pacjenci[1].id, resource_id: zasoby[4].id }),
      // Dla Katarzyny Lewandowskiej
      SharedResource.create({ patient_id: pacjenci[2].id, resource_id: zasoby[3].id }),
      SharedResource.create({ patient_id: pacjenci[2].id, resource_id: zasoby[5].id }),
    ]);
    console.log('Współdzielone zasoby utworzone.');

    // Tworzenie notatek (przynajmniej 3)
    await Promise.all([
      Note.create({
        patient_id: pacjenci[0].id,
        therapist_id: terapeuci[0].id,
        date: '2024-10-01',
        title: 'Notatki ze spotkania',
        content: 'Omówiono cele terapii oraz oczekiwania pacjentki.',
        goals: 'Zdefiniować cele terapii',
        techniques: 'Techniki CBT',
        priority: 1,
        attachments: null,
      }),
      Note.create({
        patient_id: pacjenci[1].id,
        therapist_id: terapeuci[0].id,
        date: '2024-10-02',
        title: 'Notatki o lękach',
        content: 'Pacjent opisał sytuacje wywołujące lęk.',
        goals: 'Redukcja objawów lękowych',
        techniques: 'Ćwiczenia relaksacyjne',
        priority: 2,
        attachments: null,
      }),
      Note.create({
        patient_id: pacjenci[2].id,
        therapist_id: terapeuci[1].id,
        date: '2024-10-03',
        title: 'Notatki ze wsparcia emocjonalnego',
        content: 'Pacjentka omówiła problemy z samooceną.',
        goals: 'Wzmocnienie poczucia własnej wartości',
        techniques: 'Terapia Gestalt',
        priority: 1,
        attachments: null,
      }),
    ]);
    console.log('Notatki utworzone.');

    // Tworzenie wpisów dziennika (po jednym dla każdego pacjenta)
    const wpisyDziennika = await Promise.all([
      JournalEntry.create({
        patient_id: pacjenci[0].id,
        date: '2024-10-01',
        title: 'Mój nastrój dzisiaj',
        content: 'Dzisiaj czuję się optymistycznie i pełna energii.',
        mood: 8,
        tags: JSON.stringify(['pozytywny', 'energia']),
        image: null,
        audio: null,
        shared: true,
      }),
      JournalEntry.create({
        patient_id: pacjenci[1].id,
        date: '2024-10-02',
        title: 'Dzień pełen niepokoju',
        content: 'Poranek był trudny, czułem narastający niepokój, ale wieczorem się uspokoiłem.',
        mood: 4,
        tags: JSON.stringify(['niepokój']),
        image: null,
        audio: null,
        shared: false,
      }),
      JournalEntry.create({
        patient_id: pacjenci[2].id,
        date: '2024-10-03',
        title: 'Spokój ducha',
        content: 'Dzień pełen refleksji i wewnętrznego spokoju.',
        mood: 9,
        tags: JSON.stringify(['spokój', 'refleksja']),
        image: null,
        audio: null,
        shared: true,
      }),
    ]);
    console.log('Wpisy dziennika utworzone.');

    // Dodanie dodatkowych refleksji dla każdego wpisu dziennika
    await Promise.all([
      // Dla Anny (wpis 0)
      Reflection.create({
        text: 'Dzisiaj czułam się bardzo dobrze po sesji.',
        entryId: wpisyDziennika[0].id,
      }),
      Reflection.create({
        text: 'Druga refleksja: zauważyłam postępy w moim nastroju.',
        entryId: wpisyDziennika[0].id,
      }),
      // Dla Marka (wpis 1)
      Reflection.create({
        text: 'Byłem zmęczony, ale sesja pomogła mi się zrelaksować.',
        entryId: wpisyDziennika[1].id,
      }),
      Reflection.create({
        text: 'Druga refleksja: mam nadzieję, że kolejne sesje przyniosą ulgę.',
        entryId: wpisyDziennika[1].id,
      }),
      // Dla Katarzyny (wpis 2)
      Reflection.create({
        text: 'Czuję głęboki spokój i refleksję po dzisiejszym dniu.',
        entryId: wpisyDziennika[2].id,
      }),
      Reflection.create({
        text: 'Druga refleksja: rozmowa z terapeutą była bardzo pomocna.',
        entryId: wpisyDziennika[2].id,
      }),
    ]);
    console.log('Refleksje utworzone.');

    // -------------------------
    // Tworzenie powiązań za pomocą JournalEntryTag (przynajmniej 2)
    // -------------------------
    const tagBieganie = await Tag.findOne({ where: { name: 'Bieganie' } });
    const tagRefleksja = await Tag.findOne({ where: { name: 'Refleksja' } });
    if (tagBieganie) {
      await JournalEntryTag.create({
        journalEntryId: wpisyDziennika[0].id,
        tagId: tagBieganie.id,
      });
    }
    if (tagRefleksja) {
      await JournalEntryTag.create({
        journalEntryId: wpisyDziennika[2].id,
        tagId: tagRefleksja.id,
      });
    }
    console.log('Powiązania JournalEntryTag utworzone.');

    // -------------------------
    // Tworzenie powiązań dla SessionResource (przynajmniej 2)
    // -------------------------
    await Promise.all([
      SessionResource.create({
        session_id: sesje[0].id,
        resource_id: zasoby[0].id,
        completed: false,
      }),
      SessionResource.create({
        session_id: sesje[1].id,
        resource_id: zasoby[1].id,
        completed: false,
      }),
      // Dodatkowe powiązania dla kolejnych sesji
      SessionResource.create({
        session_id: sesje[3].id,
        resource_id: zasoby[4].id,
        completed: false,
      }),
      SessionResource.create({
        session_id: sesje[5].id,
        resource_id: zasoby[5].id,
        completed: false,
      }),
    ]);
    console.log('Powiązania SessionResource utworzone.');

    // -------------------------
    // Tworzenie dokumentów sesji (SessionDocument) (przynajmniej 2)
    // -------------------------
    await Promise.all([
      SessionDocument.create({
        session_id: sesje[0].id,
        title: 'Kwestionariusz przed sesją',
        content: 'Prosimy o wypełnienie kwestionariusza przed sesją.',
        dueDate: new Date('2024-09-30T12:00:00Z'),
        submitted: false,
        feedback: null,
      }),
      SessionDocument.create({
        session_id: sesje[1].id,
        title: 'Ankieta po sesji',
        content: 'Prosimy o ocenę przebiegu sesji.',
        dueDate: new Date('2024-10-02T12:00:00Z'),
        submitted: false,
        feedback: null,
      }),
    ]);
    console.log('Dokumenty sesji utworzone.');

    // -------------------------
    // Tworzenie wpisów na tablicy dyskusyjnej (kilka rozmów dla każdego pacjenta)
    // -------------------------
    await Promise.all([
      // Rozmowy dla Anny Kowalczyk
      DiscussionBoard.create({
        patient_id: pacjenci[0].id,
        therapist_id: terapeuci[0].id,
        date: '2024-10-01',
        sender: 'Pacjent',
        message: 'Dzień dobry, chciałabym porozmawiać o swoich postępach.',
        attachment: null,
        read: false,
      }),
      DiscussionBoard.create({
        patient_id: pacjenci[0].id,
        therapist_id: terapeuci[0].id,
        date: '2024-10-02',
        sender: 'Terapeuta',
        message: 'Jak się czujesz po pierwszej sesji?',
        attachment: null,
        read: false,
      }),

      // Rozmowy dla Marka Wiśniewskiego
      DiscussionBoard.create({
        patient_id: pacjenci[1].id,
        therapist_id: terapeuci[0].id,
        date: '2024-10-02',
        sender: 'Pacjent',
        message: 'Czuję się trochę lepiej, ale mam wątpliwości.',
        attachment: null,
        read: false,
      }),
      DiscussionBoard.create({
        patient_id: pacjenci[1].id,
        therapist_id: terapeuci[0].id,
        date: '2024-10-03',
        sender: 'Terapeuta',
        message: 'Przyjrzymy się temu na kolejnej sesji.',
        attachment: null,
        read: false,
      }),

      // Rozmowy dla Katarzyny Lewandowskiej
      DiscussionBoard.create({
        patient_id: pacjenci[2].id,
        therapist_id: terapeuci[1].id,
        date: '2024-10-03',
        sender: 'Pacjentka',
        message: 'Mam kilka pytań dotyczących ostatniej sesji.',
        attachment: null,
        read: false,
      }),
      DiscussionBoard.create({
        patient_id: pacjenci[2].id,
        therapist_id: terapeuci[1].id,
        date: '2024-10-04',
        sender: 'Terapeuta',
        message: 'Oczywiście, odpowiem na wszystkie Twoje pytania.',
        attachment: null,
        read: false,
      }),
    ]);
    console.log('Wpisy na tablicy dyskusyjnej utworzone.');

    console.log('Seedowanie bazy danych zakończone pomyślnie.');
  } catch (error) {
    console.error('Błąd seedowania bazy danych:', error);
  }
};

seedDatabase();
