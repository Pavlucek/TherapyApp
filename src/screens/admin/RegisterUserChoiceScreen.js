// src/screens/admin/RegisterUserChoiceScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const RegisterUserChoiceScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wybierz rodzaj rejestracji</Text>
      <TouchableOpacity
        style={styles.choiceButton}
        onPress={() => navigation.navigate('RegisterTherapist')}
      >
        <Text style={styles.choiceButtonText}>Rejestracja Terapeuty</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.choiceButton}
        onPress={() => navigation.navigate('RegisterPatient')}
      >
        <Text style={styles.choiceButtonText}>Rejestracja Pacjenta</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0b4a60',
    marginBottom: 30,
  },
  choiceButton: {
    backgroundColor: '#0b4a60',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginVertical: 10,
  },
  choiceButtonText: {
    color: '#f5f5f9',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RegisterUserChoiceScreen;
