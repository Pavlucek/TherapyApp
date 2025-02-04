import React, { useEffect, useState } from 'react';
import { View, Text, Picker, Button, Alert } from 'react-native';
import axios from 'axios';

const AssignPatient = () => {
  const [therapists, setTherapists] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedTherapist, setSelectedTherapist] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');

  // Pobieranie listy terapeutów i pacjentów z API
  useEffect(() => {
    fetchTherapists();
    fetchPatients();
  }, []);

  const fetchTherapists = async () => {
    try {
      const response = await axios.get('https://your-api.com/therapists');
      setTherapists(response.data);
    } catch (error) {
      console.error('Błąd pobierania terapeutów:', error);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await axios.get('https://your-api.com/patients');
      setPatients(response.data);
    } catch (error) {
      console.error('Błąd pobierania pacjentów:', error);
    }
  };

  const assignPatientToTherapist = async () => {
    if (!selectedTherapist || !selectedPatient) {
      Alert.alert('Błąd', 'Wybierz terapeutę i pacjenta.');
      return;
    }

    try {
      await axios.post('https://your-api.com/assign', {
        therapistId: selectedTherapist,
        patientId: selectedPatient,
      });

      Alert.alert('Sukces', 'Pacjent został przypisany do terapeuty.');
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się przypisać pacjenta.');
      console.error('Błąd przypisywania:', error);
    }
  };

  return (
    <View>
      <Text>Wybierz terapeutę:</Text>
      <Picker selectedValue={selectedTherapist} onValueChange={(itemValue) => setSelectedTherapist(itemValue)}>
        <Picker.Item label="Wybierz terapeutę" value="" />
        {therapists.map((therapist) => (
          <Picker.Item key={therapist.id} label={therapist.name} value={therapist.id} />
        ))}
      </Picker>

      <Text>Wybierz pacjenta:</Text>
      <Picker selectedValue={selectedPatient} onValueChange={(itemValue) => setSelectedPatient(itemValue)}>
        <Picker.Item label="Wybierz pacjenta" value="" />
        {patients.map((patient) => (
          <Picker.Item key={patient.id} label={patient.name} value={patient.id} />
        ))}
      </Picker>

      <Button title="Przypisz pacjenta" onPress={assignPatientToTherapist} />
    </View>
  );
};

export default AssignPatient;
