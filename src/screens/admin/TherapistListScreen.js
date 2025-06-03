// src/screens/TherapistListScreen.js
import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import { fetchTherapists } from '../../api/therapistsApi';
import Ionicons from 'react-native-vector-icons/Ionicons';
import buttonStyles from '../../styles/ButtonStyles';

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
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      const data = await fetchTherapists(authUser.token);
      setTherapists(data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (authUser && authUser.token) {
      loadData();
    }
  }, [authUser]);

  useFocusEffect(
    useCallback(() => {
      console.log('[TherapistListScreen] Ekran aktywny – odświeżam dane terapeutyczne');
      loadData();
    }, [authUser])
  );

  if (loading && !refreshing) {
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
        onRefresh={() => {
          setRefreshing(true);
          loadData();
        }}
        refreshing={refreshing}
      />

      {/* Floating Action Button – absolutnie pozycjonowany */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('AssignPatient')}
      >
        <Ionicons name="person-add-outline" size={30} color="white" />
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
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#07435D',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
});

export default TherapistListScreen;
