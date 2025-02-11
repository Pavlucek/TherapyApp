// src/screens/admin/RegisterUserScreen.js
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { registerTherapist, registerPatient } from '../../services/authService';

const API_URL = 'http://localhost:3000';

const RegisterUserScreen = () => {
  const { user: currentUser } = useContext(AuthContext);
  const [role, setRole] = useState(''); // '' | 'therapist' | 'patient'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Pola dodatkowe dla terapeuty
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');

  // Pola dodatkowe dla pacjenta
  const [patientName, setPatientName] = useState('');
  const [patientDateOfBirth, setPatientDateOfBirth] = useState('');
  const [contact, setContact] = useState('');
  const [patientAddress, setPatientAddress] = useState('');
  const [patientGender, setPatientGender] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  // Jeśli rejestruje admin, można podać także therapist_id
  const [therapistId, setTherapistId] = useState('');

  // Funkcja czyszcząca wszystkie pola formularza
  const clearFields = () => {
    setEmail('');
    setPassword('');
    setName('');
    setPhone('');
    setAddress('');
    setSpecialization('');
    setDateOfBirth('');
    setGender('');
    setPatientName('');
    setPatientDateOfBirth('');
    setContact('');
    setPatientAddress('');
    setPatientGender('');
    setEmergencyContact('');
    setTherapistId('');
    setRole('');
  };

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Błąd', 'Wypełnij pola email i password');
      return;
    }

    if (role === 'therapist') {
      if (!name || !phone || !address || !specialization || !dateOfBirth || !gender) {
        Alert.alert('Błąd', 'Wypełnij wszystkie pola dla terapeuty');
        return;
      }
      try {
        await registerTherapist(currentUser.token, {
          email,
          password,
          name,
          phone,
          address,
          specialization,
          date_of_birth: dateOfBirth,
          gender,
        });
        Alert.alert('Sukces', 'Terapeuta został zarejestrowany');
        clearFields();
      } catch (error) {
        console.error('Błąd rejestracji terapeuty:', error.message);
        Alert.alert('Błąd', 'Nie udało się zarejestrować terapeuty');
      }
    } else if (role === 'patient') {
      if (!patientName || !patientDateOfBirth || !contact || !patientAddress || !patientGender || !emergencyContact) {
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
          medical_history: '', // lub inna wartość domyślna
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
    } else {
      Alert.alert('Błąd', 'Wybierz typ rejestracji');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register User</Text>
      {role === '' ? (
        <View style={styles.buttonContainer}>
          <Button title="Register Therapist" onPress={() => setRole('therapist')} />
          <Button title="Register Patient" onPress={() => setRole('patient')} />
        </View>
      ) : (
        <>
          <Text style={styles.label}>Wybrana rola: {role}</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {role === 'therapist' && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
              <TextInput
                style={styles.input}
                placeholder="Address"
                value={address}
                onChangeText={setAddress}
              />
              <TextInput
                style={styles.input}
                placeholder="Specialization"
                value={specialization}
                onChangeText={setSpecialization}
              />
              <TextInput
                style={styles.input}
                placeholder="Date of Birth (YYYY-MM-DD)"
                value={dateOfBirth}
                onChangeText={setDateOfBirth}
              />
              <TextInput
                style={styles.input}
                placeholder="Gender (male, female, other)"
                value={gender}
                onChangeText={setGender}
              />
            </>
          )}
          {role === 'patient' && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Patient Name"
                value={patientName}
                onChangeText={setPatientName}
              />
              <TextInput
                style={styles.input}
                placeholder="Date of Birth (YYYY-MM-DD)"
                value={patientDateOfBirth}
                onChangeText={setPatientDateOfBirth}
              />
              <TextInput
                style={styles.input}
                placeholder="Contact"
                value={contact}
                onChangeText={setContact}
              />
              <TextInput
                style={styles.input}
                placeholder="Address"
                value={patientAddress}
                onChangeText={setPatientAddress}
              />
              <TextInput
                style={styles.input}
                placeholder="Gender (male, female, other)"
                value={patientGender}
                onChangeText={setPatientGender}
              />
              <TextInput
                style={styles.input}
                placeholder="Emergency Contact"
                value={emergencyContact}
                onChangeText={setEmergencyContact}
              />
              {currentUser.role === 'admin' && (
                <TextInput
                  style={styles.input}
                  placeholder="Therapist ID"
                  value={therapistId}
                  onChangeText={setTherapistId}
                  keyboardType="numeric"
                />
              )}
            </>
          )}
          <Button title="Register" onPress={handleRegister} />
          <View style={styles.buttonSpacing}>
            <Button title="Cancel" onPress={() => setRole('')} />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    height: 100,
    justifyContent: 'space-around',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 4,
  },
  buttonSpacing: {
    marginTop: 10,
  },
});

export default RegisterUserScreen;
