import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';

const RegisterUser = () => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('patient'); // 'therapist' lub 'admin'

  const registerUser = async () => {
    try {
      await axios.post('https://your-api.com/register', { name, role });
      Alert.alert('Sukces', 'Użytkownik zarejestrowany');
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się dodać użytkownika');
    }
  };

  return (
    <View>
      <Text>Rejestracja użytkownika</Text>
      <TextInput placeholder="Imię" value={name} onChangeText={setName} />
      <Button title="Zarejestruj" onPress={registerUser} />
    </View>
  );
};

export default RegisterUser;
