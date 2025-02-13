// src/screens/admin/RegisterPatientScreen.js
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Button,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from '../../context/AuthContext';
import { registerPatient } from '../../services/authService';

const RegisterPatientScreen = () => {
  const { user: currentUser } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientDateOfBirth, setPatientDateOfBirth] = useState('');
  const [contact, setContact] = useState('');
  const [patientAddress, setPatientAddress] = useState('');
  const [patientGender, setPatientGender] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [therapistId, setTherapistId] = useState('');
  const [showGenderPicker, setShowGenderPicker] = useState(false);

  const clearFields = () => {
    setEmail('');
    setPassword('');
    setPatientName('');
    setPatientDateOfBirth('');
    setContact('');
    setPatientAddress('');
    setPatientGender('');
    setEmergencyContact('');
    setTherapistId('');
  };

  const handleRegister = async () => {
    if (
      !email ||
      !password ||
      !patientName ||
      !patientDateOfBirth ||
      !contact ||
      !patientAddress ||
      !patientGender ||
      !emergencyContact
    ) {
      Alert.alert('Błąd', 'Wypełnij wszystkie pola dla pacjenta');
      return;
    }
    try {
      await registerPatient(currentUser.token, {
        email,
        password,
        name: patientName,
        date_of_birth: patientDateOfBirth,
        contact,
        address: patientAddress,
        medical_history: '', // domyślna wartość
        gender: patientGender,
        emergency_contact: emergencyContact,
        therapist_id: currentUser.role === 'admin' ? therapistId : undefined,
      });
      Alert.alert('Sukces', 'Pacjent został zarejestrowany');
      clearFields();
    } catch (error) {
      console.error('Błąd rejestracji pacjenta:', error.message);
      Alert.alert('Błąd', 'Nie udało się zarejestrować pacjenta');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rejestracja Pacjenta</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#777"
      />
      <TextInput
        style={styles.input}
        placeholder="Hasło"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#777"
      />
      <TextInput
        style={styles.input}
        placeholder="Imię i nazwisko pacjenta"
        value={patientName}
        onChangeText={setPatientName}
        placeholderTextColor="#777"
      />
      <TextInput
        style={styles.input}
        placeholder="Data urodzenia (RRRR-MM-DD)"
        value={patientDateOfBirth}
        onChangeText={setPatientDateOfBirth}
        placeholderTextColor="#777"
      />
      <TextInput
        style={styles.input}
        placeholder="Kontakt"
        value={contact}
        onChangeText={setContact}
        placeholderTextColor="#777"
      />
      <TextInput
        style={styles.input}
        placeholder="Adres"
        value={patientAddress}
        onChangeText={setPatientAddress}
        placeholderTextColor="#777"
      />

      {/* Zamiast pola tekstowego dla płci, używamy przycisku otwierającego modal */}
      <Text style={styles.label}>Płeć</Text>
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setShowGenderPicker(true)}
      >
        <Text style={styles.pickerButtonText}>
          {patientGender
            ? patientGender === 'male'
              ? 'Mężczyzna'
              : patientGender === 'female'
              ? 'Kobieta'
              : patientGender === 'other'
              ? 'Inna'
              : patientGender
            : 'Wybierz płeć'}
        </Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Kontakt awaryjny"
        value={emergencyContact}
        onChangeText={setEmergencyContact}
        placeholderTextColor="#777"
      />
      {currentUser.role === 'admin' && (
        <TextInput
          style={styles.input}
          placeholder="ID terapeuty"
          value={therapistId}
          onChangeText={setTherapistId}
          keyboardType="numeric"
          placeholderTextColor="#777"
        />
      )}
      <TouchableOpacity style={styles.primaryButton} onPress={handleRegister}>
        <Text style={styles.primaryButtonText}>Zarejestruj</Text>
      </TouchableOpacity>

      {/* Modal do wyboru płci */}
      <Modal
        visible={showGenderPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowGenderPicker(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Wybierz płeć</Text>
            <Picker
              selectedValue={patientGender || ''}
              onValueChange={(itemValue) => {
                setPatientGender(itemValue);
                setShowGenderPicker(false);
              }}
            >
              <Picker.Item label="Mężczyzna" value="male" />
              <Picker.Item label="Kobieta" value="female" />
              <Picker.Item label="Inna" value="other" />
            </Picker>
            <Button title="Zamknij" onPress={() => setShowGenderPicker(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f9',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0b4a60',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#0b4a60',
    marginVertical: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#0b4a60',
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
    fontSize: 16,
    color: '#0b4a60',
  },
  pickerButton: {
    backgroundColor: '#d8f3f6',
    borderWidth: 1,
    borderColor: '#0b4a60',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#0b4a60',
  },
  primaryButton: {
    backgroundColor: '#0b4a60',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  primaryButtonText: {
    color: '#f5f5f9',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#d8f3f6',
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0b4a60',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default RegisterPatientScreen;
