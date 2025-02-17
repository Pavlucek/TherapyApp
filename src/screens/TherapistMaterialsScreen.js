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
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
import { getMaterials } from '../api/sharedMaterialsApi';

const FILTER_OPTIONS = [
  { label: 'Wszystkie', value: 'all' },
  { label: 'Link', value: 'link' },
  { label: 'Tekst', value: 'text' },
  { label: 'Wideo', value: 'video' },
  { label: 'PDF', value: 'pdf' },
  { label: 'Audio', value: 'audio' },
];

const ICON_MAP = {
  all: 'apps-outline',
  link: 'link-outline',
  text: 'document-text-outline',
  video: 'videocam-outline',
  pdf: 'document-attach-outline',
  audio: 'musical-notes-outline',
};

const TherapistMaterialsScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showSearch, setShowSearch] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const fetchData = async () => {
    if (!user) {
      console.log('[TherapistMaterialsScreen] Brak zalogowanego użytkownika.');
      return;
    }
    console.log('[TherapistMaterialsScreen] Rozpoczynam pobieranie materiałów...');
    setLoading(true);
    try {
      const data = await getMaterials(user.token);
      console.log('[TherapistMaterialsScreen] Materiały pobrane:', data);
      setMaterials(data);
    } catch (error) {
      console.error('[TherapistMaterialsScreen] Error fetching materials:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      console.log('[TherapistMaterialsScreen] Ekran aktywny, pobieram dane...');
      fetchData();
    }, [user])
  );

  // Ponieważ API zwraca dane w formie płaskich obiektów, bez zagnieżdżenia w "Resource"
  const filteredMaterials = materials.filter((item) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(lowerSearchTerm) ||
      item.description.toLowerCase().includes(lowerSearchTerm);
    const matchesType =
      filterType === 'all' || item.contentType.toLowerCase() === filterType;
    return matchesSearch && matchesType;
  });

  // Sortujemy materiały malejąco według id (przyjmujemy, że wyższe id to nowszy materiał)
  const sortedMaterials = filteredMaterials.sort((a, b) => b.id - a.id);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        console.log('[TherapistMaterialsScreen] Kliknięto materiał:', item.title);
        navigation.navigate('TherapistMaterialDetails', { id: item.id });
      }}
    >
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemDescription}>{item.description}</Text>
      <Text style={styles.itemContentType}>Typ: {item.contentType}</Text>
      {item.sharedTo && item.sharedTo.length > 0 && (
        <Text style={styles.itemSharedTo}>
          Udostępnione do: {item.sharedTo.join(', ')}
        </Text>
      )}
    </TouchableOpacity>
  );


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
          <TouchableOpacity
            onPress={() => setShowFilterModal(true)}
            style={styles.filterIcon}
          >
            <Ionicons name="filter-outline" size={24} color="#07435D" />
          </TouchableOpacity>
          {/* Przycisk dodawania materiału */}
          <TouchableOpacity
            onPress={() => navigation.navigate('TherapistAddMaterial')}
            style={styles.addIcon}
          >
            <Ionicons name="add-circle-outline" size={24} color="#07435D" />
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

      {/* Modal filtrowania */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Wybierz typ materiału</Text>
            {FILTER_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.modalOption,
                  filterType === option.value && styles.selectedOption,
                ]}
                onPress={() => {
                  console.log('[TherapistMaterialsScreen] Zmieniono filtr typu na:', option.value);
                  setFilterType(option.value);
                  setShowFilterModal(false);
                }}
              >
                <View style={styles.modalOptionRow}>
                  <Text style={styles.modalOptionText}>{option.label}</Text>
                  <Ionicons
                    name={ICON_MAP[option.value]}
                    size={20}
                    color="#07435D"
                  />
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowFilterModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Zamknij</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <FlatList
        data={sortedMaterials}
        keyExtractor={(item) => item.id.toString()}
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
    backgroundColor: '#C8EDFF',
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
  addIcon: {
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
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalOptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#07435D',
  },
  selectedOption: {
    backgroundColor: '#F0F8FF',
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

export default TherapistMaterialsScreen;
