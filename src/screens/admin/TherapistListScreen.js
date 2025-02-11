// src/screens/TherapistListScreen.js

import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext'; // Upewnij się, że ścieżka jest poprawna
import { fetchTherapists } from '../../api/therapistsApi'; // Upewnij się, że ścieżka jest poprawna

const TherapistListScreen = () => {
  const navigation = useNavigation();
  const { user: authUser } = useContext(AuthContext);

  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Funkcja pobierająca dane z API przy użyciu tokena
  /*
  const loadTherapists = async () => {
    try {
      console.log('[TherapistListScreen] Token z AuthContext:', authUser?.token);
      const data = await fetchTherapists(authUser.token);
      setTherapists(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  */

  // Upewniamy się, że token jest dostępny przed próbą pobrania danych
  useEffect(() => {
    if (authUser && authUser.token) {
      async function loadData() {
        try {
          console.log('[TherapistListScreen] Token z AuthContext:', authUser?.token);
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
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Błąd: {error.message}</Text>
      </View>
    );
  }

  // Renderowanie pojedynczego elementu listy
  const renderItem = ({ item }) => {
    const therapistDetails = item.Therapist;
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>Email: {item.email}</Text>
        <Text style={styles.itemText}>Rola: {item.role}</Text>
        {therapistDetails ? (
          <>
            <Text style={styles.itemText}>Imię: {therapistDetails.name}</Text>
            <Text style={styles.itemText}>Specjalizacja: {therapistDetails.specialization}</Text>
            <Text style={styles.itemText}>Płeć: {therapistDetails.gender}</Text>
          </>
        ) : (
          <Text style={styles.itemText}>Brak dodatkowych danych terapeutycznych</Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.listContainer}>
      <FlatList
        data={therapists}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
      {/* Przycisk przekierowujący do AssignPatientScreen */}
      <Button
        title="Przypisz pacjenta"
        onPress={() => navigation.navigate('AssignPatient')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  list: {
    paddingBottom: 20,
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  itemText: {
    fontSize: 16,
  },
});

export default TherapistListScreen;
