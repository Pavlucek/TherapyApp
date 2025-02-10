import React, { useContext } from 'react';
import { View, Text, Button, FlatList, ActivityIndicator } from 'react-native';
import useUsers from '../../hooks/useUsers';
import { AuthContext } from '../../context/AuthContext'; // ✅ Importujemy kontekst

const UserListScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext); // ✅ Pobieramy token użytkownika
  const { users, loading } = useUsers(user?.token); // Przekazujemy token do hooka

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Lista Użytkowników</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}>
              <Text style={{ fontSize: 16 }}>{item.name} - {item.email}</Text>
              <Button title="Edytuj" onPress={() => navigation.navigate('EditUser', { userId: item.id })} />
            </View>
          )}
        />
      )}

      <Button title="Dodaj użytkownika" onPress={() => navigation.navigate('RegisterUser')} />
    </View>
  );
};

export default UserListScreen;
