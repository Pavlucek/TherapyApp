// src/screens/TherapistListScreen.js

import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext'; // Upewnij się, że ścieżka jest poprawna
import { fetchTherapists } from '../../api/therapistsApi'; // Upewnij się, że ścieżka jest poprawna
import buttonStyles from '../../styles/ButtonStyles'; // Import stylów przycisku

// Funkcja pomocnicza zamieniająca role na polskie odpowiedniki
const getPolishRole = (role) => {
  switch (role) {
    case 'admin':
      return 'Administrator';
    case 'therapist':
      return 'Terapeuta';
    case 'patient':
      return 'Pacjent';
    default:
      return role;
  }
};

const TherapistListScreen = () => {
  const navigation = useNavigation();
  const { user: authUser } = useContext(AuthContext);

  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Upewniamy się, że token jest dostępny przed pobraniem danych
  useEffect(() => {
    if (authUser && authUser.token) {
      async function loadData() {
        try {
          console.log('[TherapistListScreen] Token:', authUser?.token);
          const data = await fetchTherapists(authUser.token);
          setTherapists(data);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      }
      loadData();
    }
  }, [authUser]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0b4a60" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Błąd: {error.message}</Text>
      </View>
    );
  }

  // Renderowanie pojedynczego elementu listy terapeuty w formie "karty"
  const renderItem = ({ item }) => {
    const therapistDetails = item.Therapist;
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Email: {item.email}</Text>
        <Text style={styles.cardSubtitle}>Rola: {getPolishRole(item.role)}</Text>
        {therapistDetails ? (
          <>
            <Text style={styles.cardText}>Imię: {therapistDetails.name}</Text>
            <Text style={styles.cardText}>
              Specjalizacja: {therapistDetails.specialization}
            </Text>
            <Text style={styles.cardText}>Płeć: {therapistDetails.gender}</Text>
            <Text style={styles.subHeading}>Przypisani pacjenci:</Text>
            {therapistDetails.Patients && therapistDetails.Patients.length > 0 ? (
              therapistDetails.Patients.map((patient) => (
                <View key={patient.id} style={styles.patientContainer}>
                  <Text style={styles.patientText}>Imię: {patient.name}</Text>
                  <Text style={styles.patientText}>Kontakt: {patient.contact}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.cardText}>Brak przypisanych pacjentów</Text>
            )}
          </>
        ) : (
          <Text style={styles.cardText}>Brak dodatkowych danych terapeutycznych</Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista Terapeutów</Text>
      <FlatList
        data={therapists}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
      {/* Przycisk przekierowujący do ekranu przypisywania pacjenta */}
      <TouchableOpacity
        style={buttonStyles.primaryButton}
        onPress={() => navigation.navigate('AssignPatient')}
      >
        <Text style={buttonStyles.primaryButtonText}>Przypisz pacjenta</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f9', // Neutralne, jasne tło
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f9',
  },
  errorText: {
    color: '#0b4a60',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0b4a60', // Akcent kolorystyczny
    textAlign: 'center',
    marginVertical: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#d8f3f6', // Delikatne tło kart
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    // Delikatny cień, aby dodać głębi
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0b4a60',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#0b4a60',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    color: '#0b4a60',
    marginBottom: 4,
  },
  subHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0b4a60',
    marginTop: 10,
    marginBottom: 5,
  },
  patientContainer: {
    backgroundColor: '#f5f5f9',
    borderRadius: 5,
    padding: 8,
    marginVertical: 3,
    marginLeft: 10,
  },
  patientText: {
    fontSize: 14,
    color: '#0b4a60',
  },
});

export default TherapistListScreen;
