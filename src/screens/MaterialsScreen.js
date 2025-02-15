import React, { useContext, useState, useCallback } from 'react';
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
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from '../context/AuthContext';
import { getMaterials } from '../api/sharedMaterialsApi';

const MaterialsScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // Możliwe wartości: 'all', 'link', 'text', 'video', 'pdf', 'audio'
  const [showSearch, setShowSearch] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  // Funkcja pobierająca materiały z backendu
  const fetchData = async () => {
    if (!user) {
      console.log('[MaterialsScreen] Brak zalogowanego użytkownika.');
      return;
    }
    console.log('[MaterialsScreen] Rozpoczynam pobieranie materiałów...');
    setLoading(true);
    try {
      const data = await getMaterials(user.token);
      console.log('[MaterialsScreen] Materiały pobrane:', data);
      setMaterials(data);
    } catch (error) {
      console.error('[MaterialsScreen] Error fetching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  // useFocusEffect – dane pobierane przy każdym wejściu na ekran
  useFocusEffect(
    useCallback(() => {
      console.log('[MaterialsScreen] Ekran aktywny, pobieram dane...');
      fetchData();
    }, [user])
  );

  // Filtrujemy materiały na podstawie wyszukiwania i filtru typu
  const filteredMaterials = materials.filter((item) => {
    const resource = item.Resource;
    if (!resource) {return false;}
    const lowerSearchTerm = searchTerm.toLowerCase();
    const matchesSearch =
      resource.title.toLowerCase().includes(lowerSearchTerm) ||
      resource.description.toLowerCase().includes(lowerSearchTerm);
    const matchesType =
      filterType === 'all' || resource.contentType.toLowerCase() === filterType;
    return matchesSearch && matchesType;
  });

  // Sortowanie – zakładamy, że najnowsze materiały mają najwyższe ID
  const sortedMaterials = filteredMaterials.sort((a, b) => b.Resource.id - a.Resource.id);

  // Funkcja renderująca pojedynczy element listy
  const renderItem = ({ item }) => {
    const resource = item.Resource;
    if (!resource) {return null;}
    console.log('[MaterialsScreen] Renderowanie materiału:', resource.title);
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => {
          console.log('[MaterialsScreen] Kliknięto materiał:', resource.title);
          navigation.navigate('MaterialDetails', { id: resource.id });
        }}
      >
        <Text style={styles.itemTitle}>{resource.title}</Text>
        <Text style={styles.itemDescription}>{resource.description}</Text>
        <Text style={styles.itemContentType}>Typ: {resource.contentType}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#07435D" />
        <Text style={styles.loaderText}>Ładowanie materiałów...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Nagłówek z tytułem i ikonami */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Materiały</Text>
        <View style={styles.iconRow}>
          <TouchableOpacity onPress={() => setShowSearch((prev) => !prev)}>
            <Ionicons name="search-outline" size={24} color="#07435D" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowFilter((prev) => !prev)} style={styles.filterIcon}>
            <Ionicons name="filter-outline" size={24} color="#07435D" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Pasek wyszukiwania */}
      {showSearch && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Szukaj materiałów..."
            placeholderTextColor="#555"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
      )}

      {/* Filtrowanie po typie */}
      {showFilter && (
        <View style={styles.filterContainer}>
          <Picker
            style={styles.picker}
            selectedValue={filterType}
            onValueChange={(value) => {
              console.log('[MaterialsScreen] Zmieniono filtr typu na:', value);
              setFilterType(value);
            }}
            mode="dropdown"
          >
            <Picker.Item label="Wszystkie" value="all" />
            <Picker.Item label="Link" value="link" />
            <Picker.Item label="Tekst" value="text" />
            <Picker.Item label="Wideo" value="video" />
            <Picker.Item label="PDF" value="pdf" />
            <Picker.Item label="Audio" value="audio" />
          </Picker>
        </View>
      )}

      <FlatList
        data={sortedMaterials}
        keyExtractor={(item) =>
          item.Resource ? item.Resource.id.toString() : '0'
        }
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchData}
            tintColor="#07435D"
            colors={['#07435D']}
            title="Odświeżanie materiałów..."
          />
        }
        ListEmptyComponent={<Text style={styles.emptyText}>Brak materiałów</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Reszta ekranu ma białe tło
  },
  headerContainer: {
    backgroundColor: '#C8EDFF',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#07435D',
  },
  iconRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  filterIcon: {
    marginLeft: 20,
  },
  searchContainer: {
    backgroundColor: '#C8EDFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchInput: {
    backgroundColor: '#F0F8FF',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#07435D',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  filterContainer: {
    backgroundColor: '#C8EDFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  picker: {
    color: '#07435D',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    width: '100%',
  },
  itemContainer: {
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#07435D',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  itemContentType: {
    fontSize: 14,
    color: '#555',
  },
  loaderContainer: {
    flex: 1,
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

export default MaterialsScreen;
