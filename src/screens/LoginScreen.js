/* eslint-disable no-alert */
import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { login as loginService } from '../services/authService';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const userData = await loginService(email, password);
      console.log('Dane użytkownika:', userData);
      if (userData) {
        login(userData);
      }
    } catch (error) {
      console.error('Błąd logowania:', error.message);
      alert('Logowanie nie powiodło się. Spróbuj ponownie.');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/icons/icon-wb.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Witaj w Reflectea</Text>
      <Text style={styles.subtitle}>Cieszymy się, że Cię widzimy.</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
      style={styles.input}
      placeholder="Wprowadź email"
      value={email}
      onChangeText={setEmail}
      autoCapitalize="none" // Dodaj tę właściwość
      placeholderTextColor="#07435D"
      />

      <Text style={styles.label}>Hasło</Text>
      <TextInput
        style={styles.input}
        placeholder="Wprowadź hasło"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#07435D"
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Zaloguj</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d8f3f6',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'flex-start', // elementy zaczynają się od góry
    paddingTop: 100, // zwiększ wartość, aby przesunąć wszystko wyżej
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#07435D',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#07435D',
    paddingHorizontal: 20,
  },
  label: {
    alignSelf: 'flex-start',
    marginLeft: '10%',
    marginBottom: 4,
    fontSize: 16,
    color: '#07435D',
  },
  input: {
    width: '80%',
    height: 50,
    backgroundColor: '#C8EDFF',
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#07435D',
    color: '#07435D',
  },
  loginButton: {
    width: '60%',
    backgroundColor: '#07435D',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPassword: {
    marginTop: 15,
  },
  forgotPasswordText: {
    color: '#07435D',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
});

export default LoginScreen;
