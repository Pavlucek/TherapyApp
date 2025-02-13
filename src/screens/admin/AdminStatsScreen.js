// src/screens/AdminStatsScreen.js
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
        <ActivityIndicator size="large" color="#0b4a60" />
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
        <View style={styles.statCard}>
          <Text style={styles.statText}>Całkowita liczba użytkowników: {stats.totalUsers}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statText}>Liczba terapeutów: {stats.totalTherapists}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statText}>Liczba pacjentów: {stats.totalPatients}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statText}>Łączna liczba sesji: {stats.totalSessions}</Text>
        </View>
      </View>

      <TouchableOpacity onPress={logout} style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={24} color="#0b4a60" />
        <Text style={styles.logoutText}>Wyloguj</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f9', // jasne, neutralne tło
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0b4a60',
    textAlign: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    width: '100%',
    marginBottom: 30,
    alignItems: 'center',
  },
  statCard: {
    backgroundColor: '#d8f3f6', // tło kart
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statText: {
    fontSize: 18,
    color: '#0b4a60',
    textAlign: 'center',
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
    backgroundColor: '#d8f3f6',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
  },
  logoutText: {
    fontSize: 16,
    color: '#0b4a60',
    marginLeft: 8,
    fontWeight: 'bold',
  },
});

export default AdminStatsScreen;
