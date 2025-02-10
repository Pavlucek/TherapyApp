import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Zaktualizuj na odpowiedni URL backendu

const JournalNewEntryScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext); // Pobieramy token i patient_id z kontekstu
  const [entryTitle, setEntryTitle] = useState('');
  const [entryContent, setEntryContent] = useState('');
  const [mood, setMood] = useState(5);
  const [tags, setTags] = useState('');

  const handleAddEntry = async () => {
    if (!entryTitle || !entryContent) {
      Alert.alert('Uwaga', 'Proszę uzupełnić tytuł i treść wpisu');
      return;
    }

    const newEntry = {
      title: entryTitle,
      content: entryContent,
      mood,
      tags,
      patient_id: user.patient.id, // Dodajemy patient_id
    };

    try {
      console.log(`[INFO] Adding journal entry with data:`, newEntry);

      const response = await axios.post(`${API_URL}/journal`, newEntry, {
        headers: {
          Authorization: `Bearer ${user.token}`, // Dodajemy token w nagłówku
        },
      });

      console.log(`[SUCCESS] Entry added:`, response.data);

      // Po dodaniu wpisu wracamy do JournalScreen
      navigation.goBack();
    } catch (error) {
      console.error(`[ERROR] Error adding journal entry:`, error.message);
      if (error.response) {
        console.error(`[ERROR DETAILS] Response Status: ${error.response.status}`);
        console.error(`[ERROR DETAILS] Response Data:`, error.response.data);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Nowy wpis</Text>
      <TextInput
        style={styles.input}
        placeholder="Tytuł"
        value={entryTitle}
        onChangeText={setEntryTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Treść"
        value={entryContent}
        onChangeText={setEntryContent}
        multiline
      />
      <Text style={styles.label}>Nastrój (1-10):</Text>
      <TextInput
        style={styles.input}
        placeholder="Wpisz liczbę"
        value={mood.toString()}
        onChangeText={(value) => setMood(parseInt(value))}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Tagi (oddzielone przecinkami)"
        value={tags}
        onChangeText={setTags}
      />
      <Button title="Dodaj wpis" onPress={handleAddEntry} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 20,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
  },
  label: {
    fontWeight: 'bold',
  },
});

export default JournalNewEntryScreen;
