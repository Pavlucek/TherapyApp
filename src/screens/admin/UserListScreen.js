import React, { useContext, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useUsers from '../../hooks/useUsers';
import { AuthContext } from '../../context/AuthContext';
import { deleteUser } from '../../services/authService'; // Import nowej funkcji

const UserListScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const { users, loading, refetch } = useUsers(user?.token);
  const [fabExpanded, setFabExpanded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      console.log('[UserListScreen] Ekran aktywny – odświeżam dane użytkowników');
      refetch();
    }, [refetch])
  );

  const getPolishRole = (role) => {
    switch (role) {
      case 'therapist':
        return 'Terapeuta';
      case 'patient':
        return 'Pacjent';
      case 'admin':
        return 'Administrator';
      default:
        return role;
    }
  };

  const handleDeleteUser = (userId, displayName) => {
    Alert.alert(
      'Potwierdzenie usunięcia',
      `Czy na pewno chcesz usunąć użytkownika ${displayName}?`,
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Usuń',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log(`Próba usunięcia użytkownika o ID: ${userId}`);
              await deleteUser(user.token, userId); // Upewnij się, że token posiada uprawnienia admina!
              refetch();
            } catch (error) {
              console.error('Błąd podczas usuwania użytkownika:', error.response?.data || error.message);
              Alert.alert('Błąd', error.response?.data?.message || 'Nie udało się usunąć użytkownika');
            }
          },
        },
      ]
    );
  };


  const renderUserItem = ({ item }) => {
    let displayName = item.email;
    if (item.role === 'therapist' && item.Therapist && item.Therapist.name) {
      displayName = item.Therapist.name;
    } else if (item.role === 'patient' && item.Patient && item.Patient.name) {
      displayName = item.Patient.name;
    }
    return (
      <View style={styles.userCard}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{displayName}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
          <Text style={styles.userRole}>Rola: {getPolishRole(item.role)}</Text>
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('EditUser', { userId: item.id })}
          >
            <Ionicons name="create-outline" size={24} color="#07435D" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => handleDeleteUser(item.id, displayName)}
          >
            <Ionicons name="trash-outline" size={24} color="#DC3545" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista użytkowników</Text>
      {loading && users.length === 0 ? (
        <ActivityIndicator size="large" color="#07435D" />
      ) : (
        <FlatList
          contentContainerStyle={styles.listContainer}
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderUserItem}
          onRefresh={refetch}
          refreshing={loading}
        />
      )}

      {/* Rozwijany Floating Action Button */}
      <View style={styles.fabContainer}>
        {fabExpanded && (
          <>
            <TouchableOpacity
              style={[styles.fabOption, { bottom: 90 }]}
              onPress={() => {
                setFabExpanded(false);
                navigation.navigate('RegisterTherapist');
              }}
            >
              <Ionicons name="people-outline" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.fabOption, { bottom: 150 }]}
              onPress={() => {
                setFabExpanded(false);
                navigation.navigate('RegisterPatient');
              }}
            >
              <Ionicons name="person-outline" size={24} color="white" />
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => setFabExpanded((prev) => !prev)}
        >
          <Ionicons name={fabExpanded ? 'close' : 'add'} size={30} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#07435D',
    textAlign: 'center',
    marginVertical: 20,
  },
  listContainer: {
    paddingBottom: 150,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#07435D',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: '600',
    color: '#07435D',
  },
  userRole: {
    fontSize: 14,
    color: '#07435D',
    marginTop: 4,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 12,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'center',
  },
  floatingButton: {
    backgroundColor: '#07435D',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  fabOption: {
    position: 'absolute',
    right: 0,
    backgroundColor: '#07435D',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
});

export default UserListScreen;
