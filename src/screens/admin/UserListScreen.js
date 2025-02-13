import React, { useContext } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import useUsers from '../../hooks/useUsers';
import { AuthContext } from '../../context/AuthContext';
import buttonStyles from '../../styles/ButtonStyles';

const UserListScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const { users, loading } = useUsers(user?.token);

  // Funkcja mapująca role na polskie odpowiedniki
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

  const renderUserItem = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <Text style={styles.userEmail}>{item.email}</Text>
        <Text style={styles.userRole}>Rola: {getPolishRole(item.role)}</Text>
      </View>
      <TouchableOpacity
        style={buttonStyles.primaryButton}
        onPress={() => {
          console.log('ID użytkownika:', item.id);
          navigation.navigate('EditUser', { userId: item.id });
        }}
      >
        <Text style={buttonStyles.primaryButtonText}>Edytuj</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={buttonStyles.primaryButton}
        onPress={() => navigation.navigate('RegisterUser')}
      >
        <Text style={buttonStyles.primaryButtonText}>Dodaj użytkownika</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Lista użytkowników</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0b4a60" />
      ) : (
        <FlatList
          contentContainerStyle={styles.listContainer}
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderUserItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f9', // Jasne, neutralne tło
    padding: 16,
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
  userCard: {
    backgroundColor: '#d8f3f6', // Delikatne tło kart
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userInfo: {
    flex: 1,
    marginRight: 10,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0b4a60',
  },
  userRole: {
    fontSize: 14,
    color: '#0b4a60',
    marginTop: 4,
  },
});

export default UserListScreen;
