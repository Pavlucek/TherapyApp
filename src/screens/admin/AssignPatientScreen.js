import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from '../../context/AuthContext';
import { fetchTherapists } from '../../api/therapistsApi';
import { getPatients } from '../../api/patientsApi';
import { assignPatient } from '../../api/assignmentApi';

const AssignPatientScreen = () => {
  const { user: authUser } = useContext(AuthContext);
  const [therapists, setTherapists] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sterowanie modalami dla pickera
  const [showTherapistModal, setShowTherapistModal] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);

  // Ładowanie danych: listy terapeutów i pacjentów
  useEffect(() => {
    const loadData = async () => {
      try {
        const therapistData = await fetchTherapists(authUser.token);
        const patientData = await getPatients(authUser.token);
        setTherapists(therapistData);
        setPatients(patientData);
      } catch (error) {
        console.error('Błąd przy ładowaniu danych:', error);
        Alert.alert('Błąd', 'Nie udało się pobrać danych');
      } finally {
        setLoading(false);
      }
    };
    if (authUser && authUser.token) {
      loadData();
    }
  }, [authUser]);

  const handleAssignPatient = async () => {
    if (!selectedTherapist || !selectedPatient) {
      Alert.alert('Błąd', 'Wybierz zarówno terapeutę, jak i pacjenta');
      return;
    }
    try {
      await assignPatient(authUser.token, selectedTherapist, selectedPatient);
      Alert.alert('Sukces', 'Pacjent został przypisany pomyślnie');
    } catch (error) {
      console.error('Błąd przy przypisywaniu pacjenta:', error);
      Alert.alert('Błąd', 'Nie udało się przypisać pacjenta');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Przy wyświetlaniu aktualnie wybranego terapeuty wyszukujemy rekord na podstawie właściwego identyfikatora z tabeli Therapist
  const selectedTherapistLabel = selectedTherapist
    ? therapists.find((t) => t.Therapist && t.Therapist.id === selectedTherapist)?.Therapist.name ||
      therapists.find((t) => t.Therapist && t.Therapist.id === selectedTherapist)?.email
    : 'Wybierz...';

  // Podobnie dla pacjenta – zakładamy, że wartość Picker itemu to patient.Patient.id
  const selectedPatientLabel = selectedPatient
    ? patients.find((p) => p.Patient && p.Patient.id === selectedPatient)?.Patient.name ||
      patients.find((p) => p.Patient && p.Patient.id === selectedPatient)?.email
    : 'Wybierz...';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Przypisz pacjenta</Text>

      {/* Wybór terapeuty */}
      <Text style={styles.label}>Wybierz terapeutę:</Text>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setShowTherapistModal(true)}
      >
        <Text style={styles.dropdownButtonText}>{selectedTherapistLabel}</Text>
      </TouchableOpacity>

      <Modal
        visible={showTherapistModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTherapistModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Wybierz terapeutę</Text>
            <Picker
              selectedValue={selectedTherapist}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedTherapist(itemValue)}
            >
              <Picker.Item label="Wybierz..." value={null} />
              {therapists.map((therapist) => (
                <Picker.Item
                  key={therapist.id}
                  label={therapist.Therapist?.name || therapist.email}
                  value={therapist.Therapist ? therapist.Therapist.id : null}
                />
              ))}
            </Picker>
            <Button title="Zamknij" onPress={() => setShowTherapistModal(false)} />
          </View>
        </View>
      </Modal>

      {/* Wybór pacjenta */}
      <Text style={styles.label}>Wybierz pacjenta:</Text>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setShowPatientModal(true)}
      >
        <Text style={styles.dropdownButtonText}>{selectedPatientLabel}</Text>
      </TouchableOpacity>

      <Modal
        visible={showPatientModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPatientModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Wybierz pacjenta</Text>
            <Picker
              selectedValue={selectedPatient}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedPatient(itemValue)}
            >
              <Picker.Item label="Wybierz..." value={null} />
              {patients.map((patient) => (
                <Picker.Item
                  key={patient.id}
                  label={patient.Patient?.name || patient.email}
                  value={patient.Patient ? patient.Patient.id : null}
                />
              ))}
            </Picker>
            <Button title="Zamknij" onPress={() => setShowPatientModal(false)} />
          </View>
        </View>
      </Modal>

      <Button title="Przypisz pacjenta" onPress={handleAssignPatient} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginTop: 5,
    borderRadius: 4,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#333',
  },
  picker: {
    width: '100%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 8,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default AssignPatientScreen;
