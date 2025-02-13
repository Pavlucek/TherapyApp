import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
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

  // Sterowanie widocznością modalów dla pickera
  const [showTherapistModal, setShowTherapistModal] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);

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
        <ActivityIndicator size="large" color="#0b4a60" />
      </View>
    );
  }

  // Wyszukiwanie etykiety dla wybranego terapeuty
  const selectedTherapistLabel = selectedTherapist
    ? therapists.find((t) => t.Therapist && t.Therapist.id === selectedTherapist)?.Therapist.name ||
      therapists.find((t) => t.Therapist && t.Therapist.id === selectedTherapist)?.email
    : 'Wybierz...';

  // Wyszukiwanie etykiety dla wybranego pacjenta
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
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowTherapistModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Zamknij</Text>
            </TouchableOpacity>
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
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowPatientModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Zamknij</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Przycisk przypisania pacjenta */}
      <TouchableOpacity style={styles.assignButton} onPress={handleAssignPatient}>
        <Text style={styles.assignButtonText}>Przypisz pacjenta</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f9', // Jasne, neutralne tło
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f5f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0b4a60',
    textAlign: 'center',
    marginVertical: 20,
  },
  label: {
    fontSize: 16,
    color: '#0b4a60',
    marginTop: 10,
  },
  dropdownButton: {
    backgroundColor: '#d8f3f6',
    borderWidth: 1,
    borderColor: '#0b4a60',
    padding: 12,
    borderRadius: 8,
    marginTop: 5,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#0b4a60',
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
    backgroundColor: '#d8f3f6',
    marginHorizontal: 20,
    borderRadius: 8,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0b4a60',
    marginBottom: 10,
  },
  modalCloseButton: {
    backgroundColor: '#0b4a60',
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 15,
  },
  modalCloseButtonText: {
    color: '#f5f5f9',
    fontSize: 16,
    fontWeight: 'bold',
  },
  assignButton: {
    backgroundColor: '#0b4a60',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 30,
  },
  assignButtonText: {
    color: '#f5f5f9',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AssignPatientScreen;
