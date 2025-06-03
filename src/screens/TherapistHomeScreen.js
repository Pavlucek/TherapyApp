import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';

import { AuthContext } from '../context/AuthContext';
import sessionsApi from '../api/sessionsApi';
import { getAssignedPatients } from '../api/assignPatientsApi';

const TherapistHomeScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [upcomingSession, setUpcomingSession] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showSearch, setShowSearch] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Pobieranie sesji i wybieranie nadchodzącej sesji
  const fetchSessions = async () => {
    try {
      const data = await sessionsApi.getSessions(user.token);
      const now = new Date();
      const upcoming = data.filter((session) => {
        const sessionDate = new Date(session.date);
        return sessionDate >= now;
      });
      upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
      setUpcomingSession(upcoming.length > 0 ? upcoming[0] : null);
    } catch (error) {
      console.error('[TherapistHomeScreen] Błąd pobierania sesji:', error.message);
      Alert.alert('Błąd', 'Nie udało się pobrać sesji.');
    }
  };

  // Pobieranie pacjentów przypisanych do terapeuty
  const fetchPatients = async () => {
    try {
      const data = await getAssignedPatients(user.token);
      setPatients(data);
    } catch (error) {
      console.error('[TherapistHomeScreen] Błąd pobierania pacjentów:', error.message);
      Alert.alert('Błąd', 'Nie udało się pobrać pacjentów.');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchSessions(), fetchPatients()]);
    setLoading(false);
  };

  // Odświeżanie danych przy wejściu na ekran
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [user])
  );

  // Renderowanie elementu nadchodzącej sesji
  const renderSessionItem = ({ item }) => {
    if (!item) {
      return <Text style={styles.noSessionText}>Brak nadchodzących sesji</Text>;
    }
    return (
      <TouchableOpacity
        style={styles.sessionCard}
        onPress={() =>
          navigation.navigate('TherapistSessionDetails', { sessionId: item.id })
        }
      >
        <View style={styles.sessionHeader}>
          <Ionicons name="calendar-outline" size={20} color="#07435D" />
          <Text style={styles.sessionDate}>
            Data: {new Date(item.date).toLocaleDateString()}
          </Text>
        </View>
        <Text style={styles.sessionTime}>
          Godziny: {item.startTime} - {item.endTime}
        </Text>
        <Text style={styles.sessionStatus}>
          Status: {item.status === 'pending'
            ? 'Oczekująca'
            : item.status === 'scheduled'
            ? 'Zaplanowana'
            : item.status === 'completed'
            ? 'Zakończona'
            : item.status === 'cancelled'
            ? 'Anulowana'
            : item.status}
        </Text>
      </TouchableOpacity>
    );
  };

  // Renderowanie elementu listy pacjentów
  const renderPatientItem = ({ item }) => (
    <TouchableOpacity
      style={styles.patientItem}
      onPress={() =>
        navigation.navigate('TherapistPatientDetails', { patientId: item.id })
      }
    >
      <Text style={styles.patientName}>{item.name}</Text>
      <Ionicons name="chevron-forward" size={20} color="#07435D" />
    </TouchableOpacity>
  );

  // Przygotowanie danych dla SectionList – jeżeli nie ma nadchodzącej sesji, pomijamy tę sekcję
  const sections = [];
  if (upcomingSession) {
    sections.push({
      title: 'Nadchodząca sesja',
      data: [upcomingSession],
    });
  }
  sections.push({
    title: 'Przypisani pacjenci',
    data: patients,
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#07435D" />
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Nagłówek strony */}
      <View style={styles.topHeader}>
        <Text style={styles.topHeaderTitle}>Strona główna terapeuty</Text>
      </View>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
        renderItem={({ section, item }) =>
          section.title === 'Nadchodząca sesja'
            ? renderSessionItem({ item })
            : renderPatientItem({ item })
        }
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>Brak danych do wyświetlenia</Text>}
        onRefresh={fetchData}
        refreshing={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topHeader: {
    backgroundColor: '#C8EDFF',
    paddingVertical: 20,
    paddingHorizontal: 20,
    paddingTop: 80,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 10,
  },
  topHeaderTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#07435D',
  },
  sectionHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#07435D',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  sessionCard: {
    backgroundColor: '#F0F8FF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  sessionDate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#07435D',
    marginLeft: 8,
  },
  sessionTime: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  sessionStatus: {
    fontSize: 16,
    color: '#555',
  },
  patientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F0F8FF',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  patientName: {
    fontSize: 18,
    color: '#07435D',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#07435D',
    marginTop: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TherapistHomeScreen;
