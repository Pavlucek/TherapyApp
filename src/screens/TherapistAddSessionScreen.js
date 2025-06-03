import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
  FlatList,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AuthContext } from '../context/AuthContext';
import sessionsApi from '../api/sessionsApi';
import { getAssignedPatients } from '../api/assignPatientsApi';

const TherapistAddSessionScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);

  // Pola formularza – przechowywane jako obiekty Date
  const [sessionDate, setSessionDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [meetingLink, setMeetingLink] = useState('');

  // Lista pacjentów pobierana z API
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientModal, setShowPatientModal] = useState(false);

  // Fullscreen modale dla pickerów
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const [showStartTimePickerModal, setShowStartTimePickerModal] = useState(false);
  const [showEndTimePickerModal, setShowEndTimePickerModal] = useState(false);

  // Pobieranie pacjentów przypisanych do terapeuty
  const fetchPatients = async () => {
    try {
      const data = await getAssignedPatients(user.token);
      setPatients(data);
    } catch (error) {
      console.error('[TherapistAddSessionScreen] Błąd pobierania pacjentów:', error.message);
      Alert.alert('Błąd', 'Nie udało się pobrać listy pacjentów.');
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [user]);

  const onChangeDate = (event, selectedDate) => {
    if (selectedDate) {
      setSessionDate(selectedDate);
    }
  };

  const onChangeStartTime = (event, selectedTime) => {
    if (selectedTime) {
      setStartTime(selectedTime);
    }
  };

  const onChangeEndTime = (event, selectedTime) => {
    if (selectedTime) {
      setEndTime(selectedTime);
    }
  };

  const formatDate = (date) => {
    // Format: YYYY-MM-DD
    return date.toISOString().split('T')[0];
  };

  const formatTime = (date) => {
    // Format: HH:MM
    return date.toTimeString().slice(0, 5);
  };

  const handleAddSession = async () => {
    if (!sessionDate || !startTime || !endTime) {
      Alert.alert('Błąd', 'Proszę wybrać datę oraz godziny rozpoczęcia i zakończenia.');
      return;
    }

    const sessionData = {
      date: formatDate(sessionDate),
      startTime: formatTime(startTime),
      endTime: formatTime(endTime),
      location,
      notes,
      meetingLink,
      ...(selectedPatient && { patient_id: selectedPatient.id }),
      therapist_id: user.therapistId, // Używamy właściwości therapistId z usera
    };

    try {
      const newSession = await sessionsApi.createSession(sessionData, user.token);
      Alert.alert('Sukces', 'Sesja została utworzona.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się utworzyć sesji.');
      console.error('[TherapistAddSessionScreen] Error creating session:', error.message);
    }
  };

  const renderPatientItem = ({ item }) => (
    <TouchableOpacity
      style={styles.patientItem}
      onPress={() => {
        setSelectedPatient(item);
        setShowPatientModal(false);
      }}
    >
      <Text style={styles.patientItemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header z przyciskiem powrotu i tytułem */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#07435D" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dodaj nową sesję</Text>
      </View>

      <ScrollView contentContainerStyle={styles.formContainer}>
        {/* Wybór daty – pełnoekranowy modal */}
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowDatePickerModal(true)}
        >
          <Text style={styles.pickerButtonText}>Data: {formatDate(sessionDate)}</Text>
          <Ionicons name="calendar-outline" size={20} color="#07435D" />
        </TouchableOpacity>
        <Modal visible={showDatePickerModal} animationType="slide">
          <SafeAreaView style={styles.fullScreenModal}>
            <Text style={styles.modalHeader}>Wybierz datę</Text>
            <DateTimePicker
              value={sessionDate}
              mode="date"
              display="spinner"
              onChange={onChangeDate}
              style={styles.fullScreenPicker}
            />
            <TouchableOpacity
              style={styles.fullScreenButton}
              onPress={() => setShowDatePickerModal(false)}
            >
              <Text style={styles.fullScreenButtonText}>Gotowe</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </Modal>

        {/* Wybór godziny rozpoczęcia */}
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowStartTimePickerModal(true)}
        >
          <Text style={styles.pickerButtonText}>
            Godzina rozpoczęcia: {formatTime(startTime)}
          </Text>
          <Ionicons name="time-outline" size={20} color="#07435D" />
        </TouchableOpacity>
        <Modal visible={showStartTimePickerModal} animationType="slide">
          <SafeAreaView style={styles.fullScreenModal}>
            <Text style={styles.modalHeader}>Wybierz godzinę rozpoczęcia</Text>
            <DateTimePicker
              value={startTime}
              mode="time"
              display="spinner"
              onChange={onChangeStartTime}
              style={styles.fullScreenPicker}
            />
            <TouchableOpacity
              style={styles.fullScreenButton}
              onPress={() => setShowStartTimePickerModal(false)}
            >
              <Text style={styles.fullScreenButtonText}>Gotowe</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </Modal>

        {/* Wybór godziny zakończenia */}
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowEndTimePickerModal(true)}
        >
          <Text style={styles.pickerButtonText}>
            Godzina zakończenia: {formatTime(endTime)}
          </Text>
          <Ionicons name="time-outline" size={20} color="#07435D" />
        </TouchableOpacity>
        <Modal visible={showEndTimePickerModal} animationType="slide">
          <SafeAreaView style={styles.fullScreenModal}>
            <Text style={styles.modalHeader}>Wybierz godzinę zakończenia</Text>
            <DateTimePicker
              value={endTime}
              mode="time"
              display="spinner"
              onChange={onChangeEndTime}
              style={styles.fullScreenPicker}
            />
            <TouchableOpacity
              style={styles.fullScreenButton}
              onPress={() => setShowEndTimePickerModal(false)}
            >
              <Text style={styles.fullScreenButtonText}>Gotowe</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </Modal>

        <TextInput
          style={styles.input}
          placeholder="Lokalizacja (np. sala, Online)"
          value={location}
          onChangeText={setLocation}
        />
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Notatki (opcjonalnie)"
          value={notes}
          onChangeText={setNotes}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="Link do spotkania (opcjonalnie)"
          value={meetingLink}
          onChangeText={setMeetingLink}
        />

        {/* Wybór pacjenta – teraz pobieramy pacjentów z API */}
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowPatientModal(true)}
        >
          <Text style={styles.pickerButtonText}>
            {selectedPatient
              ? `Wybrany pacjent: ${selectedPatient.name}`
              : 'Wybierz pacjenta'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#07435D" />
        </TouchableOpacity>
        <Modal
          visible={showPatientModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowPatientModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Wybierz pacjenta</Text>
              <FlatList
                data={patients}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.patientItem}
                    onPress={() => {
                      setSelectedPatient(item);
                      setShowPatientModal(false);
                    }}
                  >
                    <Text style={styles.patientItemText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowPatientModal(false)}
              >
                <Text style={styles.modalCloseButtonText}>Zamknij</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TouchableOpacity style={styles.button} onPress={handleAddSession}>
          <Ionicons name="save-outline" size={24} color="#ffffff" />
          <Text style={styles.buttonText}>Utwórz sesję</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C8EDFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C8EDFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#07435D',
    flex: 1,
    textAlign: 'center',
  },
  formContainer: {
    padding: 20,
  },
  input: {
    backgroundColor: '#F0F8FF',
    borderColor: '#07435D',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: '#07435D',
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0F8FF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#07435D',
    marginBottom: 15,
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#07435D',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#07435D',
    padding: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#07435D',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalCloseButton: {
    marginTop: 20,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#C8EDFF',
    borderRadius: 8,
  },
  modalCloseButtonText: {
    fontSize: 16,
    color: '#07435D',
    fontWeight: 'bold',
  },
  patientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  patientItemText: {
    flex: 1,
    fontSize: 16,
    color: '#07435D',
  },
  fullScreenModal: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#07435D',
  },
  fullScreenPicker: {
    width: '100%',
  },
  fullScreenButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#07435D',
    borderRadius: 8,
  },
  fullScreenButtonText: {
    color: '#ffffff',
    fontSize: 18,
  },
});

export default TherapistAddSessionScreen;
