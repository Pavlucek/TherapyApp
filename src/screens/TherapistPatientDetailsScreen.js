import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Alert,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { getPatientDetails } from '../api/assignPatientsApi';
import { getSharedJournalEntriesForPatient } from '../api/JournalApi';

const TherapistPatientDetailsScreen = ({ route }) => {
  const { patientId } = route.params;
  const { user } = useContext(AuthContext);

  const [patientDetails, setPatientDetails] = useState(null);
  const [journalEntries, setJournalEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    console.log('[TherapistPatientDetailsScreen] fetchData - start');
    setLoading(true);
    try {
      const details = await getPatientDetails(patientId, user.token);
      console.log('[TherapistPatientDetailsScreen] Retrieved patient details:', details);
      setPatientDetails(details);
      console.log('TOKEN:', patientId);
      const entries = await getSharedJournalEntriesForPatient(patientId, user.token);
      console.log('[TherapistPatientDetailsScreen] Retrieved journal entries:', entries);
      setJournalEntries(entries);
    } catch (error) {
      console.error('[TherapistPatientDetailsScreen] Error fetching data:', error.message);
      Alert.alert('Błąd', 'Nie udało się pobrać danych pacjenta.');
    } finally {
      setLoading(false);
      console.log('[TherapistPatientDetailsScreen] fetchData - end');
    }
  };

  useEffect(() => {
    fetchData();
  }, [patientId]);

  const renderJournalEntry = ({ item }) => (
    <View style={styles.entryCard}>
      <Text style={styles.entryTitle}>{item.title}</Text>
      <Text style={styles.entryContent}>{item.content}</Text>
      <Text style={styles.entryDate}>{new Date(item.date).toLocaleDateString()}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#07435D" />
      </View>
    );
  }

  if (!patientDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Nie znaleziono danych pacjenta.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Szczegóły pacjenta</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.detailLabel}>Imię i nazwisko:</Text>
        <Text style={styles.detailValue}>{patientDetails.name}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.detailLabel}>Data urodzenia:</Text>
        <Text style={styles.detailValue}>
          {patientDetails.date_of_birth ? new Date(patientDetails.date_of_birth).toLocaleDateString() : '-'}
        </Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.detailLabel}>Kontakt:</Text>
        <Text style={styles.detailValue}>{patientDetails.contact || '-'}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.detailLabel}>Adres:</Text>
        <Text style={styles.detailValue}>{patientDetails.address || '-'}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.detailLabel}>Historia medyczna:</Text>
        <Text style={styles.detailValue}>{patientDetails.medical_history || '-'}</Text>
      </View>

      <Text style={styles.sectionHeader}>Udostępnione wpisy z dziennika</Text>
      {journalEntries && journalEntries.length > 0 ? (
        <FlatList
          data={journalEntries}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderJournalEntry}
          contentContainerStyle={styles.journalList}
        />
      ) : (
        <Text style={styles.emptyText}>Brak udostępnionych wpisów</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#07435D',
    marginBottom: 20,
  },
  detailsContainer: {
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 16,
    color: '#07435D',
    fontWeight: 'bold',
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#07435D',
    marginVertical: 15,
  },
  entryCard: {
    backgroundColor: '#F0F8FF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  entryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#07435D',
    marginBottom: 5,
  },
  entryContent: {
    fontSize: 16,
    color: '#333',
  },
  entryDate: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#07435D',
    marginVertical: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  journalList: {
    paddingBottom: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

export default TherapistPatientDetailsScreen;
