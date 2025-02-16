import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';

const TherapistProfileScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const [sentence, setSentence] = useState('');

  const generateSentence = () => {
    const sentences = [
      'Dzisiaj jest piękny dzień, pełen możliwości!',
      'Wierzę w siebie i swoje możliwości.',
      'Każdy dzień przynosi nowe szanse.',
      'Jestem silny i zdolny do osiągnięcia wszystkiego.',
      'Uśmiechaj się – życie jest piękne!',
    ];
    const randomIndex = Math.floor(Math.random() * sentences.length);
    setSentence(sentences[randomIndex]);
  };

  useEffect(() => {
    generateSentence();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.greeting}>Witaj,</Text>
        <Text style={styles.userName}>{user ? user.userName : 'Użytkownik'}</Text>

        <TouchableOpacity style={styles.generateButton} onPress={generateSentence}>
          <Ionicons name="sunny-outline" size={24} color="#ffffff" />
          <Text style={styles.generateButtonText}>Generuj sentencję</Text>
        </TouchableOpacity>

        {sentence ? <Text style={styles.sentence}>{sentence}</Text> : null}
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Ionicons name="create-outline" size={24} color="#07435D" />
          <Text style={styles.actionText}>Edytuj profil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('ChangePassword')}
        >
          <Ionicons name="lock-closed-outline" size={24} color="#07435D" />
          <Text style={styles.actionText}>Zmień hasło</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={24} color="#07435D" />
          <Text style={styles.actionText}>Wyloguj</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerContainer: {
    backgroundColor: '#C8EDFF',
    paddingVertical: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 20,
    color: '#07435D',
  },
  userName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#07435D',
    marginBottom: 15,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#42BCBA',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    marginBottom: 10,
  },
  generateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  sentence: {
    fontSize: 16,
    color: '#07435D',
    textAlign: 'center',
    marginTop: 5,
  },
  actionsContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
  },
  actionText: {
    fontSize: 18,
    color: '#07435D',
    marginLeft: 10,
  },
});

export default TherapistProfileScreen;
