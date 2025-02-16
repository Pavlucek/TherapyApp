import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { getJournalEntryById, updateJournalEntry } from '../api/JournalApi';
import { getTags } from '../api/TagApi';
import Ionicons from 'react-native-vector-icons/Ionicons';

const JournalEditEntryScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [shared, setShared] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntry();
    fetchAvailableTags();
  }, []);

  const fetchEntry = async () => {
    try {
      const data = await getJournalEntryById(user.token, id);
      setTitle(data.title);
      setContent(data.content);
      setMood(String(data.mood));
      if (data.tagsMany && data.tagsMany.length > 0) {
        setSelectedTags(data.tagsMany);
      }
      if (data.shared !== undefined) {
        setShared(data.shared);
      }
    } catch (error) {
      console.error('[JournalEditEntryScreen] Błąd pobierania wpisu:', error);
      Alert.alert('Błąd', 'Nie udało się pobrać danych wpisu.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableTags = async () => {
    try {
      const tagsFromApi = await getTags(user.token);
      setAvailableTags(tagsFromApi);
    } catch (error) {
      console.error('[JournalEditEntryScreen] Błąd pobierania tagów:', error);
      Alert.alert('Błąd', 'Nie udało się pobrać tagów.');
    }
  };

  const toggleTag = (tag) => {
    if (selectedTags.some((t) => t.id === tag.id)) {
      setSelectedTags(selectedTags.filter((t) => t.id !== tag.id));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleUpdateEntry = async () => {
    if (!title.trim()) {
      Alert.alert('Błąd', 'Tytuł nie może być pusty.');
      return;
    }
    if (!mood || isNaN(mood) || mood < 1 || mood > 10) {
      Alert.alert('Błąd', 'Nastrój musi być liczbą w zakresie 1-10.');
      return;
    }

    const updatedData = {
      title,
      content,
      mood: parseInt(mood, 10),
      tags: selectedTags.map((tag) => tag.name),
      shared,
    };

    try {
      await updateJournalEntry(user.token, id, updatedData);
      Alert.alert('Sukces', 'Wpis został zaktualizowany!');
      navigation.goBack();
    } catch (error) {
      console.error('[JournalEditEntryScreen] Błąd aktualizacji wpisu:', error);
      Alert.alert('Błąd', 'Nie udało się zaktualizować wpisu.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0b4a60" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edytuj wpis</Text>

      <Text style={styles.label}>Tytuł</Text>
      <TextInput
        style={styles.input}
        placeholder="Wpisz tytuł..."
        placeholderTextColor="#777"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Treść</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Opisz swój dzień..."
        placeholderTextColor="#777"
        value={content}
        onChangeText={setContent}
        multiline
      />

      <Text style={styles.label}>Nastrój (1-10)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Wpisz liczbę od 1 do 10"
        placeholderTextColor="#777"
        value={mood}
        onChangeText={setMood}
      />

      <Text style={styles.label}>Wybierz tagi</Text>
      <View style={styles.tagsContainer}>
        {availableTags.map((tag) => {
          const isSelected = selectedTags.some((t) => t.id === tag.id);
          return (
            <TouchableOpacity
              key={tag.id}
              style={[
                styles.tagButton,
                isSelected && styles.tagButtonSelected,
              ]}
              onPress={() => toggleTag(tag)}
            >
              <Text
                style={[
                  styles.tagButtonText,
                  isSelected && styles.tagButtonTextSelected,
                ]}
              >
                {tag.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.shareContainer}>
        <Text style={styles.shareLabel}>Udostępnij terapeucie</Text>
        <Switch
          value={shared}
          onValueChange={setShared}
          thumbColor="#07435D"
          trackColor={{ false: '#ccc', true: '#28A745' }}
        />
      </View>

      <TouchableOpacity onPress={handleUpdateEntry} style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Zaktualizuj wpis</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.secondaryButton}>
        <Text style={styles.secondaryButtonText}>Anuluj</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f9', padding: 20 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#0b4a60', textAlign: 'center', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#0b4a60', marginBottom: 5 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#0b4a60', borderRadius: 8, padding: 10, marginBottom: 15, fontSize: 16, color: '#0b4a60' },
  textArea: { height: 100, textAlignVertical: 'top' },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 },
  tagButton: { backgroundColor: '#C8EDFF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginRight: 8, marginBottom: 8 },
  tagButtonSelected: { backgroundColor: '#07435D' },
  tagButtonText: { color: '#07435D', fontWeight: 'bold' },
  tagButtonTextSelected: { color: '#fff' },
  shareContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15, paddingHorizontal: 10 },
  shareLabel: { fontSize: 16, fontWeight: 'bold', color: '#0b4a60' },
  primaryButton: { backgroundColor: '#0b4a60', paddingVertical: 15, borderRadius: 25, alignItems: 'center', marginTop: 20 },
  primaryButtonText: { color: '#f5f5f9', fontSize: 18, fontWeight: 'bold' },
  secondaryButton: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#0b4a60', paddingVertical: 15, borderRadius: 25, alignItems: 'center', marginTop: 10 },
  secondaryButtonText: { color: '#0b4a60', fontSize: 18, fontWeight: 'bold' },
});

export default JournalEditEntryScreen;
