import React from 'react';
import { View, Text, Button } from 'react-native';

const AdminDashboard = ({ navigation }) => {
  return (
    <View>
      <Text>Panel Administratora</Text>
      <Button title="Dodaj użytkownika" onPress={() => navigation.navigate('RegisterUser')} />
      <Button title="Przypisz pacjenta do terapeuty" onPress={() => navigation.navigate('AssignPatient')} />
    </View>
  );
};

export default AdminDashboard;
