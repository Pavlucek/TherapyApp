import React, { useState, useContext, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
import { getJournalEntryById, deleteJournalEntry, addReflection } from '../api/JournalApi';

const JournalDetailsScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const { user } = useContext(AuthContext);
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newReflection, setNewReflection] = useState('');

  const fetchEntry = async () => {
    try {
      setLoading(true);
      const data = await getJournalEntryById(user.token, id);
      setEntry(data);
    } catch (error) {
      console.error('[JournalDetailsScreen] Błąd pobierania wpisu:', error);
    } finally {
      setLoading(false);
    }
  };

  // Odświeżanie danych przy wejściu na ekran
  useFocusEffect(
    useCallback(() => {
      fetchEntry();
    }, [user, id])
  );

  // Formatowanie daty wpisu
  const formatFullDate = (dateString) => {
    const date = new Date(dateString);
    const days = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
    const dayName = days[date.getDay()];
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${dayName}, ${day}.${month}.${year} o ${hours}:${minutes}`;
  };

  // Funkcja edycji wpisu
  const handleEdit = () => {
    navigation.navigate('JournalEditEntry', { id: entry.id });
  };

  // Funkcja usuwania wpisu
  const handleDelete = () => {
    Alert.alert(
      'Potwierdzenie usunięcia',
      'Czy na pewno chcesz usunąć ten wpis?',
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Usuń',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteJournalEntry(user.token, entry.id);
              Alert.alert('Sukces', 'Wpis został usunięty');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Błąd', 'Nie udało się usunąć wpisu.');
            }
          },
        },
      ]
    );
  };

  // Dodawanie refleksji
  const handleAddReflection = async () => {
    if (!newReflection.trim()) {
      Alert.alert('Błąd', 'Wpisz treść refleksji.');
      return;
    }
    try {
      await addReflection(user.token, entry.id, { text: newReflection });
      Alert.alert('Sukces', 'Refleksja została dodana.');
      setNewReflection('');
      fetchEntry(); // Odśwież wpis, aby pobrać zaktualizowane refleksje
    } catch (error) {
      console.error('[JournalDetailsScreen] Błąd dodawania refleksji:', error);
      Alert.alert('Błąd', 'Nie udało się dodać refleksji.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  // Wyświetlanie tagów – jeśli tagsMany jest puste, sprawdzamy pole tags
  const tagsToDisplay = (entry.tagsMany && entry.tagsMany.length > 0)
    ? entry.tagsMany
    : (entry.tags && entry.tags.length > 0 ? entry.tags : []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{entry.title}</Text>
      <Text style={styles.content}>{entry.content}</Text>
      <Text style={styles.mood}>Nastrój: {entry.mood}/10</Text>
      <Text style={styles.dateInfo}>Dodano: {formatFullDate(entry.date)}</Text>

      {/* Informacja o udostępnieniu */}
      <View style={styles.sharedContainer}>
        {entry.shared ? (
          <>
            <Ionicons name="people-outline" size={18} color="#28A745" />
            <Text style={styles.sharedText}>Udostępniony terapeucie</Text>
          </>
        ) : (
          <>
            <Ionicons name="lock-closed-outline" size={18} color="#DC3545" />
            <Text style={styles.sharedText}>Nie udostępniony</Text>
          </>
        )}
      </View>

      {/* Sekcja tagów */}
      {tagsToDisplay.length > 0 && (
        <View style={styles.tagsContainer}>
          <Text style={styles.tagsLabel}>Tagi:</Text>
          <View style={styles.tagsList}>
            {tagsToDisplay.map((tag, index) => (
              <View key={tag.id ? tag.id : index} style={styles.tagBadge}>
                <Text style={styles.tagText}>{tag.name ? tag.name : tag}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Sekcja refleksji */}
      <View style={styles.reflectionsContainer}>
        <Text style={styles.reflectionsLabel}>Refleksje:</Text>
        {entry.reflections && entry.reflections.length > 0 ? (
          entry.reflections.map((reflection) => (
            <View key={reflection.id} style={styles.reflectionItem}>
              <Text style={styles.reflectionText}>{reflection.text}</Text>
              {/* Opcjonalnie możesz sformatować datę refleksji */}
            </View>
          ))
        ) : (
          <Text style={styles.emptyReflectionText}>Brak refleksji</Text>
        )}
        <View style={styles.addReflectionContainer}>
          <TextInput
            style={styles.reflectionInput}
            placeholder="Dodaj refleksję..."
            value={newReflection}
            onChangeText={setNewReflection}
          />
          <TouchableOpacity style={styles.addReflectionButton} onPress={handleAddReflection}>
            <Ionicons name="add-circle-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Przyciski edycji i usuwania */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Ionicons name="pencil-outline" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    marginBottom: 10,
  },
  mood: {
    fontSize: 14,
    color: '#777',
    marginBottom: 5,
  },
  dateInfo: {
    fontSize: 14,
    color: '#777',
    marginBottom: 15,
  },
  sharedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sharedText: {
    fontSize: 14,
    color: '#07435D',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  tagsContainer: {
    marginTop: 15,
  },
  tagsLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#07435D',
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagBadge: {
    backgroundColor: '#C8EDFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#07435D',
    fontWeight: 'bold',
  },
  reflectionsContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#F0F8FF',
    borderRadius: 10,
  },
  reflectionsLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#07435D',
    marginBottom: 5,
  },
  reflectionItem: {
    backgroundColor: '#C8EDFF',
    padding: 8,
    borderRadius: 8,
    marginBottom: 5,
  },
  reflectionText: {
    fontSize: 14,
    color: '#07435D',
  },
  emptyReflectionText: {
    fontSize: 14,
    color: '#777',
    fontStyle: 'italic',
    marginBottom: 5,
  },
  addReflectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  reflectionInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#07435D',
    borderRadius: 8,
    padding: 8,
    marginRight: 10,
    fontSize: 14,
    color: '#07435D',
  },
  addReflectionButton: {
    backgroundColor: '#07435D',
    padding: 8,
    borderRadius: 8,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#07435D',
    padding: 15,
    borderRadius: 50,
  },
  deleteButton: {
    backgroundColor: '#DC3545',
    padding: 15,
    borderRadius: 50,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default JournalDetailsScreen;
