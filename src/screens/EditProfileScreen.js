import React, { useContext, useState } from 'react';
import {
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
  Button,
  View,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from '../context/AuthContext';
import { updateUserDetails } from '../services/authService';

const EditProfileScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [updatedUser, setUpdatedUser] = useState({
    name: user?.name || '',
    contact: '',
    address: '',
    date_of_birth: null, // Przechowujemy datę jako obiekt Date (lub null)
    gender: '',
    emergency_contact: '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);

  // Funkcja formatująca datę do postaci "RRRR-MM-DD"
  const formatDate = (date) => {
    if (!date) {return '';}
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (month < 10) {month = '0' + month;}
    if (day < 10) {day = '0' + day;}
    return `${year}-${month}-${day}`;
  };

// Walidacja imienia
const validateName = (name) => {
  if (!name || name.trim().length === 0) {
    return { valid: false, message: 'Imię jest wymagane.' };
  }
  if (name.trim().length < 3 || name.trim().length > 30) {
    return { valid: false, message: 'Imię musi mieć od 3 do 30 znaków.' };
  }
  return { valid: true };
};

// Walidacja numeru telefonu (kontakt)
const validateContact = (contact) => {
  if (!contact || contact.trim().length === 0) {
    return { valid: false, message: 'Kontakt jest wymagany.' };
  }
  // Wyrażenie regularne sprawdzające numer telefonu: od 7 do 15 cyfr, opcjonalnie poprzedzone znakiem +
  const phoneRegex = /^\+?[0-9]{7,15}$/;
  if (!phoneRegex.test(contact.trim())) {
    return {
      valid: false,
      message: 'Wprowadź poprawny numer telefonu (7-15 cyfr, opcjonalnie z + na początku).',
    };
  }
  return { valid: true };
};

// Walidacja adresu
const validateAddress = (address) => {
  if (!address || address.trim().length === 0) {
    return { valid: false, message: 'Adres jest wymagany.' };
  }
  return { valid: true };
};

// Walidacja daty urodzenia
const validateDateOfBirth = (date) => {
  if (!date) {
    return { valid: false, message: 'Data urodzenia jest wymagana.' };
  }
  const today = new Date();
  if (date > today) {
    return { valid: false, message: 'Data urodzenia nie może być w przyszłości.' };
  }
  return { valid: true };
};

// Walidacja płci
const validateGender = (gender) => {
  if (!gender) {
    return { valid: false, message: 'Płeć jest wymagana.' };
  }
  const allowed = ['male', 'female', 'other'];
  if (!allowed.includes(gender.toLowerCase())) {
    return {
      valid: false,
      message: 'Wybierz poprawną płeć: male, female lub other.',
    };
  }
  return { valid: true };
};

// Walidacja kontaktu awaryjnego
const validateEmergencyContact = (emergency_contact) => {
  if (!emergency_contact || emergency_contact.trim().length === 0) {
    return { valid: false, message: 'Kontakt awaryjny jest wymagany.' };
  }
  const phoneRegex = /^\+?[0-9]{7,15}$/;
  if (!phoneRegex.test(emergency_contact.trim())) {
    return {
      valid: false,
      message: 'Wprowadź poprawny numer telefonu dla kontaktu awaryjnego (7-15 cyfr, opcjonalnie z + na początku).',
    };
  }
  return { valid: true };
};


  const handleSaveChanges = async () => {
    if (!validateName(updatedUser.name)) {
      Alert.alert(
        'Nieprawidłowe imię',
        'Imię powinno mieć od 3 do 30 znaków'
      );
      return;
    }
    if (updatedUser.contact && !validateContact(updatedUser.contact)) {
      Alert.alert('Nieprawidłowy kontakt', 'Wprowadź poprawny kontakt');
      return;
    }
    if (updatedUser.address && !validateAddress(updatedUser.address)) {
      Alert.alert('Nieprawidłowy adres', 'Wprowadź poprawny adres');
      return;
    }
    if (updatedUser.date_of_birth && !validateDateOfBirth(updatedUser.date_of_birth)) {
      Alert.alert(
        'Nieprawidłowa data urodzenia',
        'Wybierz poprawną datę urodzenia'
      );
      return;
    }
    if (updatedUser.gender && !validateGender(updatedUser.gender)) {
      Alert.alert(
        'Nieprawidłowa płeć',
        'Wybierz poprawną płeć (mężczyzna, kobieta, inna)'
      );
      return;
    }
    if (
      updatedUser.emergency_contact &&
      !validateEmergencyContact(updatedUser.emergency_contact)
    ) {
      Alert.alert(
        'Nieprawidłowy kontakt awaryjny',
        'Wprowadź poprawny kontakt awaryjny'
      );
      return;
    }

    try {
      await updateUserDetails(user.token, {
        ...updatedUser,
        // Przekazujemy datę urodzenia jako sformatowany ciąg znaków
        date_of_birth: updatedUser.date_of_birth
          ? formatDate(updatedUser.date_of_birth)
          : '',
      });
      Alert.alert('Sukces', 'Dane użytkownika zostały zaktualizowane poprawnie');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się zaktualizować danych użytkownika');
    }
  };

  const onDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setUpdatedUser({ ...updatedUser, date_of_birth: selectedDate });
    }
    setShowDatePicker(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edytuj Profil</Text>

      <TextInput
        style={styles.input}
        placeholder="Imię i nazwisko"
        placeholderTextColor="#777"
        value={updatedUser.name}
        onChangeText={(text) =>
          setUpdatedUser({ ...updatedUser, name: text })
        }
      />
      <TextInput
        style={styles.input}
        placeholder="Kontakt"
        placeholderTextColor="#777"
        value={updatedUser.contact}
        onChangeText={(text) =>
          setUpdatedUser({ ...updatedUser, contact: text })
        }
      />
      <TextInput
        style={styles.input}
        placeholder="Adres"
        placeholderTextColor="#777"
        value={updatedUser.address}
        onChangeText={(text) =>
          setUpdatedUser({ ...updatedUser, address: text })
        }
      />

      {/* Wybór daty urodzenia */}
      <Text style={styles.label}>Data urodzenia</Text>
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.pickerButtonText}>
          {updatedUser.date_of_birth
            ? formatDate(updatedUser.date_of_birth)
            : 'Wybierz datę urodzenia'}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={updatedUser.date_of_birth || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      )}

      {/* Wybór płci */}
      <Text style={styles.label}>Płeć</Text>
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setShowGenderPicker(true)}
      >
        <Text style={styles.pickerButtonText}>
          {updatedUser.gender
            ? updatedUser.gender === 'male'
              ? 'Mężczyzna'
              : updatedUser.gender === 'female'
              ? 'Kobieta'
              : 'Inna'
            : 'Wybierz płeć'}
        </Text>
      </TouchableOpacity>
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
              selectedValue={updatedUser.gender}
              onValueChange={(itemValue) => {
                setUpdatedUser({ ...updatedUser, gender: itemValue });
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

      <TextInput
        style={styles.input}
        placeholder="Kontakt awaryjny"
        placeholderTextColor="#777"
        value={updatedUser.emergency_contact}
        onChangeText={(text) =>
          setUpdatedUser({ ...updatedUser, emergency_contact: text })
        }
      />

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleSaveChanges}
      >
        <Text style={styles.primaryButtonText}>Zapisz zmiany</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.secondaryButtonText}>Anuluj</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f9',
    padding: 20,
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
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#0b4a60',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  secondaryButtonText: {
    color: '#0b4a60',
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

export default EditProfileScreen;
