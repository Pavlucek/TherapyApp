import React, { useContext } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import useUsers from '../../hooks/useUsers';
import { AuthContext } from '../../context/AuthContext';
import buttonStyles from '../../styles/ButtonStyles';

const UserListScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const { users, loading } = useUsers(user?.token);

  const renderUserItem = ({ item }) => (
    <View style={styles.userItem}>
      <View style={styles.userInfo}>
        <Text style={styles.userText}>
          {item.email}
          {'\n'}role: {item.role}
        </Text>
      </View>
      <TouchableOpacity
        style={buttonStyles.loginButton}
        onPress={() => {
          console.log('User ID:', item.id);
          navigation.navigate('EditUser', { userId: item.id });
        }}
      >
        <Text style={buttonStyles.loginButtonText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );


  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={buttonStyles.loginButton}
        onPress={() => navigation.navigate('RegisterUser')}
      >
        <Text style={buttonStyles.loginButtonText}>Add User</Text>
      </TouchableOpacity>

      <Text style={styles.title}>User List</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
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
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    marginTop: 20,
    textAlign: 'center',
  },
  listContainer: {
    alignItems: 'center', // Wyśrodkowanie zawartości listy
  },
  userItem: {
    padding: 10,
    width: '100%',
    flexDirection: 'row',           // Ustawia elementy w jednym wierszu
    justifyContent: 'space-between',// Rozmieszcza tekst po lewej, przycisk po prawej
    alignItems: 'center',           // Centruje elementy w pionie
    // Usunięto borderBottomWidth i borderColor, aby nie było szarych linii
  },
  userInfo: {
    flex: 1,             // Tekst zajmuje całą dostępną przestrzeń po lewej
    marginRight: 10,     // Dodaje odstęp między tekstem a przyciskiem
  },
  userText: {
    fontSize: 16,
    textAlign: 'left',
  },
});

export default UserListScreen;
