import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { changePassword } from '../services/authService';

const ChangePasswordScreen = ({ navigation }) => {
  // Get the user object from AuthContext
  const { user } = useContext(AuthContext);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Błąd', 'Nowe hasło i potwierdzenie nie są zgodne');
      return;
    }
    if (!user || !user.token) {
      Alert.alert('Błąd', 'Nie znaleziono tokenu autoryzacyjnego');
      return;
    }
    try {
      // Pass user.token instead of a non-existent token variable
      await changePassword(user.token, currentPassword, newPassword);
      Alert.alert('Sukces', 'Hasło zostało zmienione');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Błąd', error.message || 'Nie udało się zmienić hasła');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Zmień hasło</Text>
      </View>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Aktualne hasło"
          secureTextEntry
          placeholderTextColor="#777"
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Nowe hasło"
          secureTextEntry
          placeholderTextColor="#777"
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Potwierdź nowe hasło"
          secureTextEntry
          placeholderTextColor="#777"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
          <Text style={styles.buttonText}>Zapisz zmiany</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Anuluj</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerContainer: {
    backgroundColor: '#C8EDFF',
    paddingVertical: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#07435D',
  },
  formContainer: {
    padding: 20,
    marginTop: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#07435D',
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    fontSize: 16,
    color: '#07435D',
  },
  button: {
    backgroundColor: '#07435D',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#07435D',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#07435D',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ChangePasswordScreen;
