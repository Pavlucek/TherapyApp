import React, { useContext, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
import { getJournalEntries } from '../api/JournalApi';
import { getTags } from '../api/TagApi';

// Funkcja do formatowania daty: "Czas: dd.mm.yyyy HH:MM"
const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `Czas: ${day}.${month}.${year} ${hours}:${minutes}`;
};

// Funkcja wybierająca ikonę nastroju
const getMoodIcon = (mood) => {
  if (mood >= 7) {
    return { icon: 'happy-outline', color: '#28A745' }; // Pozytywny - zielony
  } else if (mood >= 4) {
    return { icon: 'remove-circle-outline', color: '#FFC107' }; // Neutralny - żółty
  } else {
    return { icon: 'sad-outline', color: '#DC3545' }; // Negatywny - czerwony
  }
};

const JournalScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [entries, setEntries] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchEntries();
    }, [user])
  );

  useEffect(() => {
    fetchAvailableTags();
  }, [user]);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const data = await getJournalEntries(user.token);
      setEntries(data);
    } catch (error) {
      console.error('[JournalScreen] Błąd pobierania wpisów:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableTags = async () => {
    try {
      const tagsFromApi = await getTags(user.token);
      setAvailableTags(tagsFromApi);
    } catch (error) {
      console.error('[JournalScreen] Błąd pobierania tagów:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEntries();
    await fetchAvailableTags();
    setRefreshing(false);
  };

  const filteredEntries = entries.filter((entry) =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Przypisujemy globalne tagi i tagi użytkownika
  const globalTags = availableTags.filter((tag) => tag.is_global);
  const userTags = availableTags.filter((tag) => !tag.is_global);

  // Renderowanie pojedynczej karty wpisu
  const renderItem = ({ item }) => {
    const { icon, color } = getMoodIcon(item.mood);

    const tagsToDisplay = Array.isArray(item.tagsMany) && item.tagsMany.length > 0
      ? item.tagsMany
      : Array.isArray(item.tags) && item.tags.length > 0
        ? item.tags
        : [];

    return (
      <TouchableOpacity
        style={styles.entryCard}
        onPress={() => navigation.navigate('JournalDetails', { id: item.id })}
      >
        <View style={styles.cardRow}>
          <View style={styles.leftColumn}>
            <Text style={styles.entryTitle}>
              {item.title} {item.shared && <Ionicons name="people-outline" size={18} color="#28A745" />}
            </Text>
            <Text style={styles.entryContent}>
              {item.content.length > 100 ? `${item.content.substring(0, 100)}...` : item.content}
            </Text>
            <Text style={styles.entryDate}>{formatDateTime(item.date)}</Text>
            {tagsToDisplay.length > 0 && (
              <View style={styles.tagsContainer}>
                {tagsToDisplay.map((tag, index) => (
                  <View key={tag.id ? tag.id : index} style={styles.tagItem}>
                    <Ionicons name="pricetag-outline" size={14} color="#07435D" style={{ marginRight: 4 }} />
                    <Text style={styles.tagText}>{tag.name ? tag.name : tag}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
          <View style={[styles.rightColumn, { backgroundColor: color }]}>
            <Ionicons name={icon} size={50} color="white" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      {/* SafeAreaView dla górnej przestrzeni */}
      <SafeAreaView style={{ flex: 0, backgroundColor: '#C8EDFF' }} />

      {/* Reszta ekranu */}
      <View style={styles.container}>
        {/* Nagłówek */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Mój Dziennik</Text>
          <View style={styles.iconRow}>
            <TouchableOpacity
              onPress={() => setShowSearch((prev) => !prev)}
              style={styles.iconButton}
            >
              <Ionicons name="search-outline" size={24} color="#07435D" />
            </TouchableOpacity>
            <TouchableOpacity onPress={fetchEntries} style={styles.iconButton}>
              <Ionicons name="refresh-outline" size={24} color="#07435D" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Pasek wyszukiwania */}
        {showSearch && (
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Szukaj wpisów..."
              placeholderTextColor="#555"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>
        )}

        {/* Lista wpisów */}
        <View style={styles.entriesContainer}>
          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#07435D" />
              <Text style={styles.loaderText}>Ładowanie wpisów...</Text>
            </View>
          ) : (
            <FlatList
              data={filteredEntries}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              ListEmptyComponent={
                <Text style={styles.emptyText}>Brak wpisów w dzienniku.</Text>
              }
            />
          )}
        </View>

        {/* Floating buttons */}
        <TouchableOpacity
          style={styles.addEntryButton}
          onPress={() => navigation.navigate('JournalNewEntry')}
        >
          <Ionicons name="add-circle-outline" size={50} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addTagButton}
          onPress={() => navigation.navigate('TagScreen')}
        >
          <Ionicons name="pricetag-outline" size={50} color="white" />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    backgroundColor: '#C8EDFF',
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#07435D',
  },
  iconRow: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 20,
  },
  searchContainer: {
    backgroundColor: '#C8EDFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#07435D',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  availableTagsContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  availableTagsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#07435D',
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#07435D',
    marginTop: 5,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  tagBadge: {
    backgroundColor: '#C8EDFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#07435D',
    fontWeight: 'bold',
  },
  entriesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  entryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftColumn: {
    flex: 1,
    paddingRight: 10,
  },
  rightColumn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  entryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#07435D',
    marginBottom: 4,
  },
  entryContent: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  entryDate: {
    fontSize: 14,
    color: '#555',
  },
  // Sekcja tagów wpisu
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C8EDFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  // Floating buttons
  addEntryButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#07435D',
    padding: 10,
    borderRadius: 50,
  },
  addTagButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#07435D',
    padding: 10,
    borderRadius: 50,
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#07435D',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#07435D',
    marginTop: 20,
  },
});

export default JournalScreen;
