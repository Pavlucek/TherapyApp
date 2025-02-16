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
import sessionsApi from '../api/sessionsApi';

// Mapowanie statusów na polskie nazwy
const STATUS_MAP = {
  completed: 'Zakończona',
  scheduled: 'Zaplanowana',
  pending: 'Oczekująca',
  cancelled: 'Anulowana',
};

// Opcje filtrowania
const FILTER_OPTIONS = [
  { label: 'Wszystkie', value: 'all' },
  { label: 'Zakończona', value: 'completed' },
  { label: 'Zaplanowana', value: 'scheduled' },
  { label: 'Oczekująca', value: 'pending' },
  { label: 'Anulowana', value: 'cancelled' },
];

// Formatowanie daty (DD.MM.YYYY)
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${String(date.getDate()).padStart(2, '0')}.${String(
    date.getMonth() + 1
  ).padStart(2, '0')}.${date.getFullYear()}`;
};

const SessionsPatientScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // Pobieranie sesji pacjenta
  const fetchSessions = async () => {
    if (!user) {return;}

    setLoading(true);
    try {
      const data = await sessionsApi.getSessions(user.token);
      setSessions(data);
    } catch (error) {
      console.error('[SessionsPatientScreen] Błąd pobierania sesji:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSessions();
    }, [user])
  );

  // Filtrowanie sesji
  const filteredSessions = sessions.filter((session) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const matchesSearch =
      session.date.includes(lowerSearchTerm) ||
      (session.notes && session.notes.toLowerCase().includes(lowerSearchTerm));
    const matchesStatus =
      filterStatus === 'all' || session.status.toLowerCase() === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Sortowanie sesji według daty (od najnowszej)
  const sortedSessions = filteredSessions.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Kolory kart w zależności od statusu
  const getSessionCardStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return styles.completedSessionCard;
      case 'scheduled':
        return styles.scheduledSessionCard;
      case 'pending':
        return styles.pendingSessionCard;
      case 'cancelled':
        return styles.cancelledSessionCard;
      default:
        return styles.defaultSessionCard;
    }
  };

  // Render pojedynczego elementu listy
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.sessionCard, getSessionCardStyle(item.status)]}
      onPress={() =>
        navigation.navigate('SessionDetails', { sessionId: item.id })
      }
    >
      <View style={styles.sessionHeader}>
        <Ionicons name="calendar-outline" size={20} color="#07435D" />
        <Text style={styles.sessionDate}>{formatDate(item.date)}</Text>
      </View>
      <Text style={styles.sessionTime}>
        {item.startTime} - {item.endTime}
      </Text>
      <Text style={styles.sessionStatus}>
        Status: {STATUS_MAP[item.status]}
      </Text>
      <Text style={styles.sessionLocation}>
        Lokalizacja: {item.location || 'Online'}
      </Text>
    </TouchableOpacity>
  );

  // Ekran ładowania
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#07435D" />
        <Text style={styles.loaderText}>Ładowanie sesji...</Text>
      </View>
    );
  }

  return (
    <>
      {/* SafeAreaView tylko dla górnej przestrzeni (notch, Dynamic Island).
          Dzięki flex: 0 obejmuje wyłącznie "bezpieczny" obszar na samej górze. */}
      <SafeAreaView style={{ flex: 0, backgroundColor: '#C8EDFF' }} />

      {/* Drugi SafeAreaView obejmujący resztę ekranu */}
      <View style={styles.container}>
        {/* Nagłówek */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Moje Sesje</Text>
          <View style={styles.iconRow}>
            <TouchableOpacity
              onPress={() => setShowSearch((prev) => !prev)}
              style={styles.iconButton}
            >
              <Ionicons name="search-outline" size={24} color="#07435D" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowFilterModal(true)}
              style={styles.iconButton}
            >
              <Ionicons name="filter-outline" size={24} color="#07435D" />
            </TouchableOpacity>
            <TouchableOpacity onPress={fetchSessions} style={styles.iconButton}>
              <Ionicons name="refresh-outline" size={24} color="#07435D" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Pasek wyszukiwania */}
        {showSearch && (
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Szukaj sesji..."
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
              <Text style={styles.modalTitle}>Filtruj według statusu</Text>
              {FILTER_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.modalOption,
                    filterStatus === option.value && styles.selectedOption,
                  ]}
                  onPress={() => {
                    setFilterStatus(option.value);
                    setShowFilterModal(false);
                  }}
                >
                  <View style={styles.modalOptionRow}>
                    <Text style={styles.modalOptionText}>{option.label}</Text>
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

        {/* Lista sesji */}
        <FlatList
          data={sortedSessions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchSessions}
              tintColor="#07435D"
              colors={['#07435D']}
              title="Odświeżanie sesji..."
            />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>Brak sesji do wyświetlenia</Text>
          }
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  // Cała widoczna część ekranu (oprócz safe area na górze)
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Tło głównej zawartości
  },
  // Nagłówek
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
  // Pasek wyszukiwania
  searchContainer: {
    backgroundColor: '#FFFFFF',
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
  // Modal filtrowania
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
  // Lista
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#07435D',
    marginTop: 20,
  },
  // Widok ładowania
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
  // Karta pojedynczej sesji
  sessionCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sessionDate: {
    marginLeft: 8,
    fontSize: 16,
    color: '#07435D',
    fontWeight: 'bold',
  },
  sessionTime: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  sessionStatus: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  sessionLocation: {
    fontSize: 14,
    color: '#555',
  },
  // Style statusów
  defaultSessionCard: {
    backgroundColor: '#F0F8FF',
    borderColor: '#ccc',
  },
  completedSessionCard: {
    backgroundColor: '#D4EDDA',
    borderColor: '#28A745',
  },
  scheduledSessionCard: {
    backgroundColor: '#D1ECF1',
    borderColor: '#17A2B8',
  },
  pendingSessionCard: {
    backgroundColor: '#FFF3CD',
    borderColor: '#FFC107',
  },
  cancelledSessionCard: {
    backgroundColor: '#F8D7DA',
    borderColor: '#DC3545',
  },
});

export default SessionsPatientScreen;
