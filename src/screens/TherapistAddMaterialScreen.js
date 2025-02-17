import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
import { addMaterial } from '../api/sharedMaterialsApi';

const MATERIAL_TYPES = [
  { label: 'Link', value: 'link' },
  { label: 'Tekst', value: 'text' },
  { label: 'Wideo', value: 'video' },
  { label: 'PDF', value: 'pdf' },
  { label: 'Audio', value: 'audio' },
];

// Dummy lista pacjentów – zastąp ją danymi z API, jeśli posiadasz
const dummyPatients = [
  { id: 1, name: 'Pacjent 1' },
  { id: 2, name: 'Pacjent 2' },
  { id: 3, name: 'Pacjent 3' },
];

const TherapistAddMaterialScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);

  // Stany formularza
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState('link'); // domyślnie 'link'
  const [selectedPatients, setSelectedPatients] = useState([]); // tablica obiektów pacjentów
  const [loading, setLoading] = useState(false);

  // Modal dla wyboru typu materiału
  const [showTypeModal, setShowTypeModal] = useState(false);
  // Modal dla wyboru pacjentów
  const [showPatientModal, setShowPatientModal] = useState(false);

  const togglePatientSelection = (patient) => {
    if (selectedPatients.some((p) => p.id === patient.id)) {
      setSelectedPatients(selectedPatients.filter((p) => p.id !== patient.id));
    } else {
      setSelectedPatients([...selectedPatients, patient]);
    }
  };

  const renderPatientItem = ({ item }) => {
    const isSelected = selectedPatients.some((p) => p.id === item.id);
    return (
      <TouchableOpacity
        style={[
          styles.patientItem,
          isSelected && styles.patientItemSelected,
        ]}
        onPress={() => togglePatientSelection(item)}
      >
        <Text style={styles.patientItemText}>{item.name}</Text>
        {isSelected && <Ionicons name="checkmark-circle" size={20} color="#07435D" />}
      </TouchableOpacity>
    );
  };

  const handleAddMaterial = async () => {
    if (!title || !description || !contentType) {
      Alert.alert('Błąd', 'Proszę wypełnić wymagane pola (tytuł, opis, typ).');
      return;
    }

    // Mapujemy wybrane pacjentów do tablicy ID
    const patient_ids = selectedPatients.map((p) => p.id);

    const materialData = {
      title,
      description,
      url,
      content,
      contentType,
      patient_ids,
    };

    setLoading(true);
    try {
      const data = await addMaterial(user.token, materialData);
      Alert.alert('Sukces', 'Materiał został dodany.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się dodać materiału.');
      console.error('[TherapistAddMaterialScreen] Error adding material:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={styles.header}>Dodaj nowy materiał</Text>

        <TextInput
          style={styles.input}
          placeholder="Tytuł"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Opis"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="URL (opcjonalnie)"
          value={url}
          onChangeText={setUrl}
        />
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Treść (dla materiałów tekstowych)"
          value={content}
          onChangeText={setContent}
          multiline
        />

        {/* Wybór typu materiału */}
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowTypeModal(true)}
        >
          <Text style={styles.pickerButtonText}>Typ materiału: {contentType}</Text>
          <Ionicons name="chevron-down" size={20} color="#07435D" />
        </TouchableOpacity>

        {/* Modal dla wyboru typu */}
        <Modal
          visible={showTypeModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowTypeModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Wybierz typ materiału</Text>
              {MATERIAL_TYPES.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.modalOption}
                  onPress={() => {
                    setContentType(option.value);
                    setShowTypeModal(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowTypeModal(false)}
              >
                <Text style={styles.modalCloseButtonText}>Zamknij</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Wybór pacjentów */}
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowPatientModal(true)}
        >
          <Text style={styles.pickerButtonText}>
            {selectedPatients.length > 0
              ? `Wybrani pacjenci: ${selectedPatients.map((p) => p.name).join(', ')}`
              : 'Wybierz pacjentów'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#07435D" />
        </TouchableOpacity>

        {/* Modal dla wyboru pacjentów */}
        <Modal
          visible={showPatientModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowPatientModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Wybierz pacjentów</Text>
              <FlatList
                data={dummyPatients}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderPatientItem}
              />
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowPatientModal(false)}
              >
                <Text style={styles.modalCloseButtonText}>Zamknij</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TouchableOpacity
          style={styles.button}
          onPress={handleAddMaterial}
          disabled={loading}
        >
          <Ionicons name="save-outline" size={24} color="#ffffff" />
          <Text style={styles.buttonText}>{loading ? 'Zapisywanie...' : 'Dodaj materiał'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C8EDFF',
  },
  formContainer: {
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#07435D',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F0F8FF',
    borderColor: '#07435D',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: '#07435D',
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0F8FF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#07435D',
    marginBottom: 15,
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#07435D',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#07435D',
    padding: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#07435D',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#07435D',
  },
  modalCloseButton: {
    marginTop: 20,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#C8EDFF',
    borderRadius: 8,
  },
  modalCloseButtonText: {
    fontSize: 16,
    color: '#07435D',
    fontWeight: 'bold',
  },
  patientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  patientItemText: {
    flex: 1,
    fontSize: 16,
    color: '#07435D',
  },
  patientItemSelected: {
    backgroundColor: '#F0F8FF',
  },
});

export default TherapistAddMaterialScreen;
