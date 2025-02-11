// src/screens/AdminStatsScreen.js

import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import ikon
import { AuthContext } from '../../context/AuthContext';
import { fetchStats } from '../../api/statsApi';

const AdminStatsScreen = () => {
  const { user: authUser, logout } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Jeśli backend wymaga tokena, przekazujemy authUser.token
        const data = await fetchStats(authUser?.token);
        setStats(data);
      } catch (err) {
        setError(err.message || 'Błąd przy pobieraniu statystyk');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [authUser]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff"/>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Statystyki</Text>
      
      <View style={styles.statsContainer}>
        <Text style={styles.statItem}>Całkowita liczba użytkowników: {stats.totalUsers}</Text>
        <Text style={styles.statItem}>Liczba terapeutów: {stats.totalTherapists}</Text>
        <Text style={styles.statItem}>Liczba pacjentów: {stats.totalPatients}</Text>
        <Text style={styles.statItem}>Łączna liczba sesji: {stats.totalSessions}</Text>
      </View>
      
      {/* Przycisk wylogowania z ikoną */}
      <TouchableOpacity onPress={logout} style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={24} color="#FF5733" />
        <Text style={styles.logoutText}>Wyloguj</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',      // Wyśrodkowanie elementów poziomo
    justifyContent: 'center',  // Wyśrodkowanie elementów pionowo
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  statItem: {
    fontSize: 18,
    marginVertical: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    color: '#FF5733',
    marginLeft: 8,
  },
});

export default AdminStatsScreen;
