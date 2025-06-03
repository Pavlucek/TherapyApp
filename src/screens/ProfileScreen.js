import React, { useContext, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { getPatientModelInfo } from '../api/assignPatientsApi';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  console.log('User data:', user); // Debug logging

  const [sentence, setSentence] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [patientData, setPatientData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  // Fetch patient model info via getPatientModelInfo and set it to state
  const fetchPatientData = useCallback(async () => {
    console.log('fetchPatientData triggered', user);

    if (!user) {
      console.warn('Przerwano fetchPatientData: Brak obiektu user');
      return;
    }
    if (!user.patientId) {
      console.warn('Przerwano fetchPatientData: Brak patient_id w obiekcie user', user);
      return;
    }
    if (!user.token) {
      console.warn('Przerwano fetchPatientData: Brak tokena w obiekcie user', user);
      return;
    }

    setLoading(true);

    try {
      const data = await getPatientModelInfo(user.patientId, user.token);
      console.log('Dane z getPatientModelInfo:', data);
      setPatientData(data);
    } catch (error) {
      console.error('Błąd pobierania danych pacjenta:', error.message);
    } finally {
      setLoading(false);
    }
  }, [user]);


  useFocusEffect(
    useCallback(() => {
      fetchPatientData();
    }, [fetchPatientData])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPatientData();
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#07435D" />}>
        <View style={styles.headerContainer}>
          <Text style={styles.greeting}>Witaj,</Text>
          <Text style={styles.userName}>{patientData?.name || user?.userName || 'Użytkownik'}</Text>
          <TouchableOpacity style={styles.generateButton} onPress={generateSentence}>
            <Ionicons name="sunny-outline" size={24} color="#ffffff" />
            <Text style={styles.generateButtonText}>Generuj sentencję</Text>
          </TouchableOpacity>
          {sentence && <Text style={styles.sentence}>{sentence}</Text>}
        </View>

        {/* Section: Patient basic data */}
        <View style={styles.userDataContainer}>
          <Text style={styles.userDataTitle}>Twoje dane:</Text>
          <View style={styles.dataField}>
            <Text style={styles.fieldLabel}>Imię i nazwisko:</Text>
            <Text style={styles.fieldValue}>{patientData?.name || user?.name || 'Brak danych'}</Text>
          </View>
          <View style={styles.dataField}>
            <Text style={styles.fieldLabel}>Email:</Text>
            <Text style={styles.fieldValue}>{patientData?.email || user?.email || 'Brak danych'}</Text>
          </View>
          {expanded && (
            <>
              <View style={styles.dataField}>
                <Text style={styles.fieldLabel}>Kontakt:</Text>
                <Text style={styles.fieldValue}>{patientData?.contact || user?.contact || 'Brak danych'}</Text>
              </View>
              <View style={styles.dataField}>
                <Text style={styles.fieldLabel}>Adres:</Text>
                <Text style={styles.fieldValue}>{patientData?.address || user?.address || 'Brak danych'}</Text>
              </View>
              <View style={styles.dataField}>
                <Text style={styles.fieldLabel}>Data urodzenia:</Text>
                <Text style={styles.fieldValue}>
                  {patientData?.date_of_birth
                    ? new Date(patientData.date_of_birth).toLocaleDateString()
                    : user?.date_of_birth
                    ? new Date(user.date_of_birth).toLocaleDateString()
                    : 'Brak danych'}
                </Text>
              </View>
              <View style={styles.dataField}>
                <Text style={styles.fieldLabel}>Historia medyczna:</Text>
                <Text style={styles.fieldValue}>{patientData?.medical_history || 'Brak danych'}</Text>
              </View>
              <View style={styles.dataField}>
                <Text style={styles.fieldLabel}>Płeć:</Text>
                <Text style={styles.fieldValue}>{patientData?.gender || user?.gender || 'Brak danych'}</Text>
              </View>
              <View style={styles.dataField}>
                <Text style={styles.fieldLabel}>Kontakt awaryjny:</Text>
                <Text style={styles.fieldValue}>{patientData?.emergency_contact || user?.emergency_contact || 'Brak danych'}</Text>
              </View>
              <View style={styles.dataField}>
                <Text style={styles.fieldLabel}>Dostęp do dziennika:</Text>
                <Text style={styles.fieldValue}>
                  {patientData?.journal_access || user?.journal_access ? 'Tak' : 'Nie'}
                </Text>
              </View>
            </>
          )}
          <TouchableOpacity style={styles.expandButton} onPress={toggleExpand}>
            <Text style={styles.expandButtonText}>{expanded ? 'Zwiń' : 'Pokaż więcej'}</Text>
            <Ionicons name={expanded ? 'chevron-up-outline' : 'chevron-down-outline'} size={20} color="#07435D" />
          </TouchableOpacity>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('EdytujProfil')}
          >
            <Ionicons name="create-outline" size={24} color="#07435D" />
            <Text style={styles.actionText}>Edytuj profil</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('ZmieńHasło')}
          >
            <Ionicons name="lock-closed-outline" size={24} color="#07435D" />
            <Text style={styles.actionText}>Zmień hasło</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={logout}>
            <Ionicons name="log-out-outline" size={24} color="#07435D" />
            <Text style={styles.actionText}>Wyloguj</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#07435D" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // ...existing styles...
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
  userDataContainer: {
    margin: 20,
    padding: 15,
    marginBottom: -10,
    borderWidth: 1,
    borderColor: '#C8EDFF',
    borderRadius: 10,
    backgroundColor: '#F0F8FF',
  },
  userDataTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#07435D',
    marginBottom: 10,
    textAlign: 'center',
  },
dataField: {
  flexDirection: 'column', // Pozwala na zawijanie tekstu w wierszach
  paddingVertical: 5,
  borderBottomWidth: 1,
  borderBottomColor: '#C8EDFF',
},
fieldLabel: {
  fontSize: 16,
  color: '#07435D',
  fontWeight: 'bold',
},
fieldValue: {
  fontSize: 16,
  color: '#07435D',
  flexShrink: 1, // Zapobiega nadmiernemu rozciąganiu się tekstu
  flexWrap: 'wrap', // Umożliwia zawijanie tekstu
  maxWidth: '100%', // Zapewnia, że tekst dostosuje się do szerokości kontenera
},

  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  expandButtonText: {
    fontSize: 16,
    color: '#07435D',
    marginRight: 5,
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
    borderWidth: 1,
    borderColor: '#C8EDFF',
  },
  actionText: {
    fontSize: 18,
    color: '#07435D',
    marginLeft: 10,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;
