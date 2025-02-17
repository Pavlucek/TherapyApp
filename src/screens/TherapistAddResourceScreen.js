import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
import { getMaterials } from '../api/sharedMaterialsApi';
import sessionsApi from '../api/sessionsApi';

const TherapistAddResourceScreen = ({ navigation, route }) => {
  // Zakładamy, że sessionId jest przekazywane przez params
  const { sessionId } = route.params;
  const { user } = useContext(AuthContext);

  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMaterials, setSelectedMaterials] = useState([]);

  const fetchMaterials = async () => {
    try {
      const data = await getMaterials(user.token);
      setMaterials(data);
    } catch (error) {
      console.error('[TherapistAddResourceScreen] Błąd pobierania materiałów:', error.message);
      Alert.alert('Błąd', 'Nie udało się pobrać materiałów.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const toggleMaterialSelection = (material) => {
    if (selectedMaterials.some((m) => m.id === material.id)) {
      setSelectedMaterials(selectedMaterials.filter((m) => m.id !== material.id));
    } else {
      setSelectedMaterials([...selectedMaterials, material]);
    }
  };

  const renderMaterialItem = ({ item }) => {
    const isSelected = selectedMaterials.some((m) => m.id === item.id);
    return (
      <TouchableOpacity
        style={[styles.itemContainer, isSelected && styles.selectedItem]}
        onPress={() => toggleMaterialSelection(item)}
      >
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemDescription}>{item.description}</Text>
        </View>
        {isSelected && <Ionicons name="checkmark-circle" size={24} color="#28A745" />}
      </TouchableOpacity>
    );
  };

  const handleAddMaterials = async () => {
    if (selectedMaterials.length === 0) {
      Alert.alert('Uwaga', 'Nie wybrano żadnych materiałów.');
      return;
    }
    try {
      for (const material of selectedMaterials) {
        await sessionsApi.addResource(sessionId, { resource_id: material.id }, user.token);
      }
      Alert.alert('Sukces', 'Wybrane materiały zostały dodane do sesji.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się dodać materiałów do sesji.');
      console.error('[TherapistAddResourceScreen] Błąd:', error.message);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#07435D" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Nagłówek */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#07435D" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wybierz materiały do sesji</Text>
      </View>

      <FlatList
        data={materials}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMaterialItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>Brak materiałów do wyświetlenia</Text>}
      />
      <TouchableOpacity style={styles.button} onPress={handleAddMaterials}>
        <Ionicons name="add-circle-outline" size={24} color="#fff" />
        <Text style={styles.buttonText}>Dodaj wybrane materiały</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#07435D',
    flex: 1,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedItem: {
    borderColor: '#28A745',
    backgroundColor: '#E0F8E0',
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#07435D',
  },
  itemDescription: {
    fontSize: 14,
    color: '#555',
  },
  button: {
    backgroundColor: '#07435D',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#07435D',
    marginTop: 20,
  },
});

export default TherapistAddResourceScreen;
