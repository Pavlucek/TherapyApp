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
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AuthContext } from '../context/AuthContext';
import sessionsApi from '../api/sessionsApi';

const TherapistAddDocumentScreen = ({ navigation, route }) => {
  // Zakładamy, że sessionId jest przekazywane przez params
  const { sessionId } = route.params || {};
  const { user } = useContext(AuthContext);

  // Stany formularza
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  // Ustawiamy domyślnie nową datę jako termin
  const [dueDate, setDueDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  // Stan modala do wyboru daty (dla Androida)
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);

  // Jeśli chcesz, aby modal pojawiał się od razu po wejściu na ekran na Androidzie,
  // możesz użyć useEffect – usuń komentarz poniżej, aby modal otwierał się automatycznie.
  useEffect(() => {
    if (Platform.OS === 'android') {
      setShowDueDatePicker(true);
    }
  }, []);

  const handleDueDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setDueDate(selectedDate);
    }
    if (Platform.OS === 'android') {
      setShowDueDatePicker(false);
    }
  };

  const formatDateForDisplay = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const formatDateForApi = (date) => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  };

  const handleAddDocument = async () => {
    if (!title || !content || !dueDate) {
      Alert.alert('Błąd', 'Wypełnij wszystkie wymagane pola.');
      return;
    }

    const documentData = {
      title,
      content,
      dueDate: formatDateForApi(dueDate),
      submitted: false,
    };

    setLoading(true);
    try {
      await sessionsApi.addDocument(sessionId, documentData, user.token);
      Alert.alert('Sukces', `Dokument został dodany do sesji ${sessionId}`);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się dodać dokumentu.');
      console.error('[TherapistAddDocumentScreen] Error adding document:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Nagłówek z przyciskiem cofania */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#07435D" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dodaj zadanie domowe</Text>
      </View>

      <ScrollView contentContainerStyle={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Tytuł dokumentu"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Treść dokumentu"
          value={content}
          onChangeText={setContent}
          multiline
        />
        <View style={styles.dueDateContainer}>
          <Text style={styles.dueDateLabel}>Termin: </Text>
          {Platform.OS === 'ios' ? (
            // Inline picker dla iOS
            <DateTimePicker
              value={dueDate}
              mode="date"
              display="inline"
              onChange={handleDueDateChange}
              style={styles.inlinePicker}
            />
          ) : (
            <>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDueDatePicker(true)}
              >
                <Text style={styles.dateButtonText}>{formatDateForDisplay(dueDate)}</Text>
                <Ionicons name="calendar-outline" size={20} color="#07435D" />
              </TouchableOpacity>
              {showDueDatePicker && (
                <DateTimePicker
                  value={dueDate}
                  mode="date"
                  display="spinner"
                  onChange={handleDueDateChange}
                />
              )}
            </>
          )}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleAddDocument}
          disabled={loading}
        >
          <Ionicons name="save-outline" size={24} color="#ffffff" />
          <Text style={styles.buttonText}>
            {loading ? 'Zapisywanie...' : 'Dodaj dokument'}
          </Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C8EDFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#07435D',
    flex: 1,
    textAlign: 'center',
  },
  formContainer: {
    padding: 20,
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
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  dueDateLabel: {
    fontSize: 16,
    color: '#07435D',
    marginRight: 10,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#07435D',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#07435D',
    marginRight: 5,
  },
  inlinePicker: {
    flex: 1,
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
});

export default TherapistAddDocumentScreen;
