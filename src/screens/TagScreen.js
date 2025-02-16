import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
import { getTags, createTag, deleteTag } from '../api/TagApi';

const TagScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [selectedType, setSelectedType] = useState('OTHER'); // domyślny typ

  const fetchTags = async () => {
    try {
      setLoading(true);
      const data = await getTags(user.token);
      setTags(data);
    } catch (error) {
      console.error('[TagScreen] Błąd pobierania tagów:', error);
      Alert.alert('Błąd', 'Nie udało się pobrać tagów.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTags();
    setRefreshing(false);
  };

  const handleCreateTag = async () => {
    if (!newTag.trim()) {
      Alert.alert('Błąd', 'Wpisz nazwę tagu.');
      return;
    }
    try {
      // Przekazujemy nazwę tagu, wybrany typ oraz patient_id, aby tag został przypisany do użytkownika
      await createTag(user.token, { name: newTag, type: selectedType, patient_id: user.patientId });
      Alert.alert('Sukces', 'Tag został utworzony.');
      setNewTag('');
      fetchTags();
    } catch (error) {
      console.error('[TagScreen] Błąd tworzenia tagu:', error);
      Alert.alert('Błąd', 'Nie udało się utworzyć tagu.');
    }
  };

  const handleDeleteTag = async (tagId) => {
    Alert.alert(
      'Potwierdzenie',
      'Czy na pewno chcesz usunąć ten tag?',
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Usuń',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTag(user.token, tagId);
              Alert.alert('Sukces', 'Tag został usunięty.');
              fetchTags();
            } catch (error) {
              console.error('[TagScreen] Błąd usuwania tagu:', error);
              Alert.alert('Błąd', 'Nie udało się usunąć tagu.');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => {
    // Tag należy do użytkownika, jeśli patient_id jest równy user.patientId
    const isUserTag = item.patient_id === user.patientId;
    return (
      <View style={styles.tagItem}>
        <Text style={styles.tagText}>{item.name}</Text>
        {isUserTag && (
          <TouchableOpacity onPress={() => handleDeleteTag(item.id)}>
            <Ionicons name="trash-outline" size={20} color="#DC3545" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Lista dostępnych typów tagów z polskimi etykietami
  const tagTypes = [
    { value: 'WEATHER', label: 'Pogoda' },
    { value: 'ACTIVITY', label: 'Aktywność' },
    { value: 'CATEGORY', label: 'Kategoria' },
    { value: 'LOCATION', label: 'Lokalizacja' },
    { value: 'OTHER', label: 'Inne' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Zarządzanie tagami</Text>

      {/* Sekcja dodawania nowego tagu */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Wpisz nazwę nowego tagu"
          value={newTag}
          onChangeText={setNewTag}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleCreateTag}>
          <Ionicons name="add-circle-outline" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {/* Sekcja wyboru typu tagu */}
      <View style={styles.typeContainer}>
        <Text style={styles.typeLabel}>Wybierz typ tagu:</Text>
        <View style={styles.types}>
          {tagTypes.map((typeObj) => (
            <TouchableOpacity
              key={typeObj.value}
              style={[
                styles.typeButton,
                selectedType === typeObj.value && styles.typeButtonSelected,
              ]}
              onPress={() => setSelectedType(typeObj.value)}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  selectedType === typeObj.value && styles.typeButtonTextSelected,
                ]}
              >
                {typeObj.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#07435D" />
      ) : (
        <FlatList
          data={tags}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={<Text style={styles.emptyText}>Brak tagów</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', color: '#07435D', marginBottom: 15, textAlign: 'center' },
  inputContainer: { flexDirection: 'row', marginBottom: 15, alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, borderColor: '#07435D', borderRadius: 8, padding: 10, marginRight: 10, fontSize: 16 },
  addButton: { backgroundColor: '#07435D', padding: 10, borderRadius: 8 },
  typeContainer: { marginBottom: 15 },
  typeLabel: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#07435D' },
  types: { flexDirection: 'row', flexWrap: 'wrap' },
  typeButton: {
    backgroundColor: '#C8EDFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  typeButtonSelected: { backgroundColor: '#07435D' },
  typeButtonText: { fontSize: 14, color: '#07435D', fontWeight: 'bold' },
  typeButtonTextSelected: { color: '#fff' },
  tagItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#C8EDFF', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, marginBottom: 8 },
  tagText: { fontSize: 16, color: '#07435D' },
  emptyText: { textAlign: 'center', fontSize: 16, color: '#07435D', marginTop: 20 },
});

export default TagScreen;
