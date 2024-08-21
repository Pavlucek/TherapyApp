/* eslint-disable no-alert */
import React, {useContext, useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import {login as loginService} from '../services/authService';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {login} = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const userData = await loginService(email, password);
      console.log('User data:', userData); // Loguj dane użytkownika
      if (userData) {
        login(userData); // Ustaw dane użytkownika w kontekście
      }
    } catch (error) {
      console.error('Login error:', error.message); // Loguj błędy
      alert('Login failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/icons/icon-wb.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Welcome to Reflectea</Text>
      <Text style={styles.subtitle}>
      We're happy to see you.
      </Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d8f3f6',
    padding: 16,
    alignItems: 'center', // Wyśrodkuj elementy poziomo
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#07435D',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#07435D',
    paddingHorizontal: 20, // Dodatkowy odstęp, aby tekst nie przylegał do krawędzi
  },
  label: {
    width: '80%',
    marginBottom: 4,
    fontSize: 16,
    color: '#07435D',
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  loginButton: {
    width: '60%',
    backgroundColor: '#07435D', // Kolor tła
    paddingVertical: 14,
    borderRadius: 25, // Zaokrąglone rogi
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: 'white', // Biały kolor tekstu
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
