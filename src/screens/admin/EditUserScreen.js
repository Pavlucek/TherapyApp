// src/screens/admin/EditUserScreen.js
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from '../../context/AuthContext';
import { getUserDetails, updateUserDetailsByAdmin } from '../../services/authService';

const EditUserScreen = ({ navigation, route }) => {
  const { userId } = route.params;
  const { user: adminUser } = useContext(AuthContext);

  useEffect(() => {
    console.log('EditUserScreen otrzymał userId:', userId);
  }, [userId]);

  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  // Stan do kontrolowania widoczności modalu dla pickera płci
  const [showGenderPicker, setShowGenderPicker] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      console.log('Próba pobrania danych użytkownika...');
      console.log('adminUser.token:', adminUser.token);
      console.log('Pobieranie danych dla userId:', userId);
      try {
        const data = await getUserDetails(adminUser.token, userId);
        console.log('Otrzymane dane użytkownika:', data);
        setUserDetails(data);
      } catch (error) {
        console.error('Błąd podczas pobierania danych użytkownika:', error);
        Alert.alert('Błąd', `Nie udało się pobrać danych użytkownika: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, [adminUser.token, userId]);

  if (loading || !userDetails) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Walidacja – funkcje pomocnicze
  const validateName = name => name.length >= 3 && name.length <= 30;
  const validateContact = contact => contact.length > 0;
  const validateAddress = address => address.length > 0;
  const validateDateOfBirth = date => /^\d{4}-\d{2}-\d{2}$/.test(date);
  const validateGender = gender =>
    ['male', 'female', 'other'].includes(gender.toLowerCase());
  const validateEmergencyContact = emergency_contact => emergency_contact.length > 0;

  const handleSaveChanges = async () => {
    // Walidacja wspólna
    if (!validateName(userDetails.name)) {
      Alert.alert('Błąd', 'Imię powinno mieć od 3 do 30 znaków');
      return;
    }
    // Walidacja specyficzna dla pacjenta
    if (userDetails.role === 'patient') {
      if (userDetails.contact && !validateContact(userDetails.contact)) {
        Alert.alert('Błąd', 'Podaj poprawny kontakt');
        return;
      }
      if (userDetails.address && !validateAddress(userDetails.address)) {
        Alert.alert('Błąd', 'Podaj poprawny adres');
        return;
      }
      if (userDetails.date_of_birth && !validateDateOfBirth(userDetails.date_of_birth)) {
        Alert.alert('Błąd', 'Data urodzenia musi być w formacie YYYY-MM-DD');
        return;
      }
      if (userDetails.gender && !validateGender(userDetails.gender)) {
        Alert.alert('Błąd', 'Podaj poprawną płeć (male, female, lub other)');
        return;
      }
      if (userDetails.emergency_contact && !validateEmergencyContact(userDetails.emergency_contact)) {
        Alert.alert('Błąd', 'Podaj poprawny kontakt awaryjny');
        return;
      }
    }
    // Walidacja dla terapeuty (opcjonalnie – możesz dodać więcej reguł)
    if (userDetails.role === 'therapist') {
      if (userDetails.date_of_birth && !validateDateOfBirth(userDetails.date_of_birth)) {
        Alert.alert('Błąd', 'Data urodzenia musi być w formacie YYYY-MM-DD');
        return;
      }
      if (userDetails.gender && !validateGender(userDetails.gender)) {
        Alert.alert('Błąd', 'Podaj poprawną płeć (male, female, lub other)');
        return;
      }
    }

    try {
      await updateUserDetailsByAdmin(adminUser.token, userId, userDetails);
      Alert.alert('Sukces', 'Dane użytkownika zostały zaktualizowane');
      navigation.goBack();
    } catch (error) {
      console.error('Błąd przy aktualizacji danych użytkownika:', error);
      Alert.alert('Błąd', 'Nie udało się zaktualizować danych użytkownika');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edytuj użytkownika</Text>

      {/* Pola wspólne */}
      <TextInput
        style={styles.input}
        placeholder="Imię"
        value={userDetails.name}
        onChangeText={text => setUserDetails({ ...userDetails, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={userDetails.email}
        onChangeText={text => setUserDetails({ ...userDetails, email: text })}
      />

      {/* Pola specyficzne dla terapeuty */}
      {userDetails.role === 'therapist' && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Telefon"
            value={userDetails.phone || ''}
            onChangeText={text => setUserDetails({ ...userDetails, phone: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Adres"
            value={userDetails.address || ''}
            onChangeText={text => setUserDetails({ ...userDetails, address: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Specjalizacja"
            value={userDetails.specialization || ''}
            onChangeText={text => setUserDetails({ ...userDetails, specialization: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Data urodzenia (YYYY-MM-DD)"
            value={userDetails.date_of_birth ? String(userDetails.date_of_birth).slice(0, 10) : ''}
            onChangeText={text => setUserDetails({ ...userDetails, date_of_birth: text })}
          />
          <Text style={styles.label}>Płeć</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowGenderPicker(true)}
          >
            <Text style={styles.pickerButtonText}>
              {userDetails.gender ? userDetails.gender : 'Wybierz płeć'}
            </Text>
          </TouchableOpacity>
        </>
      )}

      {/* Pola specyficzne dla pacjenta */}
      {userDetails.role === 'patient' && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Kontakt"
            value={userDetails.contact || ''}
            onChangeText={text => setUserDetails({ ...userDetails, contact: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Adres"
            value={userDetails.address || ''}
            onChangeText={text => setUserDetails({ ...userDetails, address: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Data urodzenia (YYYY-MM-DD)"
            value={userDetails.date_of_birth ? String(userDetails.date_of_birth).slice(0, 10) : ''}
            onChangeText={text => setUserDetails({ ...userDetails, date_of_birth: text })}
          />
          <Text style={styles.label}>Płeć</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowGenderPicker(true)}
          >
            <Text style={styles.pickerButtonText}>
              {userDetails.gender ? userDetails.gender : 'Wybierz płeć'}
            </Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Kontakt awaryjny"
            value={userDetails.emergency_contact || ''}
            onChangeText={text => setUserDetails({ ...userDetails, emergency_contact: text })}
          />
        </>
      )}

      <Button title="Zapisz zmiany" onPress={handleSaveChanges} />
      <View style={styles.buttonSpacing}>
        <Button title="Anuluj" onPress={() => navigation.goBack()} />
      </View>

      {/* Modal dla wyboru płci */}
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
              selectedValue={userDetails.gender || ''}
              onValueChange={(itemValue) => {
                setUserDetails({ ...userDetails, gender: itemValue });
                setShowGenderPicker(false);
              }}
            >
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
              <Picker.Item label="Other" value="other" />
            </Picker>
            <Button title="Zamknij" onPress={() => setShowGenderPicker(false)} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#07435D',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    marginTop: 10,
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
  },
  pickerButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginVertical: 10,
  },
  pickerButtonText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // półprzezroczyste tło
  },
  modalContent: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonSpacing: {
    marginTop: 10,
  },
});

export default EditUserScreen;
