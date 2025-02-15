import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  Button,
  Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from '../../context/AuthContext';
import { registerTherapist } from '../../services/authService';

const RegisterTherapistScreen = () => {
  const { user: currentUser } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [gender, setGender] = useState('');
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const clearFields = () => {
    setEmail('');
    setPassword('');
    setName('');
    setPhone('');
    setAddress('');
    setSpecialization('');
    setDateOfBirth(null);
    setGender('');
  };

  const formatDate = (date) => {
    if (!date) {return '';}
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (month < 10) {month = '0' + month;}
    if (day < 10) {day = '0' + day;}
    return `${year}-${month}-${day}`;
  };

  const handleRegister = async () => {
    if (
      !email ||
      !password ||
      !name ||
      !phone ||
      !address ||
      !specialization ||
      !dateOfBirth ||
      !gender
    ) {
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
        date_of_birth: formatDate(dateOfBirth),
        gender,
      });
      Alert.alert('Sukces', 'Terapeuta został zarejestrowany');
      clearFields();
    } catch (error) {
      console.error('Błąd rejestracji terapeuty:', error.message);
      Alert.alert('Błąd', 'Nie udało się zarejestrować terapeuty');
    }
  };

  const onDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
    setShowDatePicker(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rejestracja Terapeuty</Text>
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
        placeholder="Imię i nazwisko"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#777"
      />
      <TextInput
        style={styles.input}
        placeholder="Telefon"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        placeholderTextColor="#777"
      />
      <TextInput
        style={styles.input}
        placeholder="Adres"
        value={address}
        onChangeText={setAddress}
        placeholderTextColor="#777"
      />
      <TextInput
        style={styles.input}
        placeholder="Specjalizacja"
        value={specialization}
        onChangeText={setSpecialization}
        placeholderTextColor="#777"
      />

      <Text style={styles.label}>Data urodzenia</Text>
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.pickerButtonText}>
          {dateOfBirth ? formatDate(dateOfBirth) : 'Wybierz datę urodzenia'}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={dateOfBirth || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      )}

      <Text style={styles.label}>Płeć</Text>
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setShowGenderPicker(true)}
      >
        <Text style={styles.pickerButtonText}>
          {gender
            ? gender === 'male'
              ? 'Mężczyzna'
              : gender === 'female'
              ? 'Kobieta'
              : gender === 'other'
              ? 'Inna'
              : gender
            : 'Wybierz płeć'}
        </Text>
      </TouchableOpacity>

      {/* Modal z Pickerem dla płci */}
      <Modal
        visible={showGenderPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowGenderPicker(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Wybierz płeć</Text>
            <Picker
              selectedValue={gender || ''}
              onValueChange={(itemValue) => {
                setGender(itemValue);
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

      <TouchableOpacity style={styles.primaryButton} onPress={handleRegister}>
        <Text style={styles.primaryButtonText}>Zarejestruj</Text>
      </TouchableOpacity>
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

export default RegisterTherapistScreen;
