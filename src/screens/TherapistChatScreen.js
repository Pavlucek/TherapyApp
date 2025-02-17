import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
// Załóż, że nowy endpoint został dodany do DiscussionBoardApi:
import { getAssignedPatients } from '../api/DiscussionBoardApi';

const TherapistChatScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const token = user.token;

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Funkcja pobierająca listę pacjentów przypisanych do terapeuty
  const fetchAssignedPatients = async () => {
    setLoading(true);
    try {
      const data = await getAssignedPatients(token);
      setPatients(data);
    } catch (error) {
      console.error('Błąd pobierania pacjentów:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedPatients();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAssignedPatients();
    setRefreshing(false);
  };

  // Renderowanie pojedynczego elementu listy pacjentów
  const renderPatientItem = ({ item }) => (
    <TouchableOpacity
      style={styles.patientItem}
      onPress={() => navigation.navigate('TherapistChatDetail', { patient: item })}
    >
      <Ionicons name="person-circle-outline" size={40} color="#07435D" />
      <View style={styles.patientInfo}>
        <Text style={styles.patientName}>{item.name}</Text>
        <Text style={styles.patientContact}>{item.contact}</Text>
      </View>
      <Ionicons name="chevron-forward-outline" size={24} color="#07435D" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Czat z pacjentami</Text>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Ładowanie pacjentów...</Text>
        </View>
      ) : (
        <FlatList
          data={patients}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPatientItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#07435D']}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Brak przypisanych pacjentów.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    backgroundColor: '#C8EDFF',
    padding: 20,
    paddingTop: 70,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#07435D' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  emptyText: { fontSize: 16, color: '#07435D' },
  patientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  patientInfo: {
    flex: 1,
    marginLeft: 10,
  },
  patientName: { fontSize: 18, fontWeight: 'bold', color: '#07435D' },
  patientContact: { fontSize: 14, color: '#07435D' },
});

export default TherapistChatScreen;
