import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
import { getTherapistModelInfo } from '../api/assignPatientsApi'; // Upewnij się, że ścieżka jest poprawna

const TherapistProfileScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const [sentence, setSentence] = useState('');
  const [therapistData, setTherapistData] = useState(null);
  const [expanded, setExpanded] = useState(false);

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

  // Pobieranie danych terapeuty z dodatkowym logowaniem zawartości obiektu user
  const fetchTherapistData = async () => {
    console.log('[TherapistProfileScreen] Obiekt user:', user);
    // Używamy therapistId jeśli istnieje, w przeciwnym wypadku id
    if (!user || (!user.therapistId && !user.id) || !user.token) {
      console.warn('[TherapistProfileScreen] Brak danych terapeuty w obiekcie user:', user);
      return;
    }
    try {
      const therapistId = user.therapistId || user.id;
      console.log('[TherapistProfileScreen] Używany identyfikator terapeuty:', therapistId);
      const data = await getTherapistModelInfo(therapistId, user.token);
      console.log('[TherapistProfileScreen] Otrzymane dane terapeuty:', data);
      setTherapistData(data);
    } catch (error) {
      console.error('Błąd pobierania danych terapeuty:', error.message);
    }
  };

  useEffect(() => {
    generateSentence();
    fetchTherapistData();
  }, []);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <View style={styles.container}>
      {/* Nagłówek z przywitaniem i generatorem sentencji */}
      <View style={styles.headerContainer}>
        <Text style={styles.greeting}>Witaj,</Text>
        <Text style={styles.userName}>{user ? user.userName : 'Użytkownik'}</Text>

        <TouchableOpacity style={styles.generateButton} onPress={generateSentence}>
          <Ionicons name="sunny-outline" size={24} color="#ffffff" />
          <Text style={styles.generateButtonText}>Generuj sentencję</Text>
        </TouchableOpacity>

        {sentence ? <Text style={styles.sentence}>{sentence}</Text> : null}
      </View>

      {/* Sekcja wyświetlania danych terapeuty */}
      <View style={styles.therapistDataContainer}>
        <Text style={styles.dataTitle}>Twoje dane:</Text>
        <View style={styles.dataField}>
          <Text style={styles.fieldLabel}>Imię i nazwisko:</Text>
          <Text style={styles.fieldValue}>
            {therapistData?.name || user?.name || 'Brak danych'}
          </Text>
        </View>
        <View style={styles.dataField}>
          <Text style={styles.fieldLabel}>Telefon:</Text>
          <Text style={styles.fieldValue}>
            {therapistData?.phone || 'Brak danych'}
          </Text>
        </View>
        {expanded && (
          <>
            <View style={styles.dataField}>
              <Text style={styles.fieldLabel}>Adres:</Text>
              <Text style={styles.fieldValue}>
                {therapistData?.address || 'Brak danych'}
              </Text>
            </View>
            <View style={styles.dataField}>
              <Text style={styles.fieldLabel}>Specjalizacja:</Text>
              <Text style={styles.fieldValue}>
                {therapistData?.specialization || 'Brak danych'}
              </Text>
            </View>
            <View style={styles.dataField}>
              <Text style={styles.fieldLabel}>Data urodzenia:</Text>
              <Text style={styles.fieldValue}>
                {therapistData?.date_of_birth
                  ? new Date(therapistData.date_of_birth).toLocaleDateString()
                  : 'Brak danych'}
              </Text>
            </View>
            <View style={styles.dataField}>
              <Text style={styles.fieldLabel}>Płeć:</Text>
              <Text style={styles.fieldValue}>
                {therapistData?.gender || 'Brak danych'}
              </Text>
            </View>
          </>
        )}
        <TouchableOpacity style={styles.expandButton} onPress={toggleExpand}>
          <Text style={styles.expandButtonText}>
            {expanded ? 'Zwiń' : 'Pokaż więcej'}
          </Text>
          <Ionicons
            name={expanded ? 'chevron-up-outline' : 'chevron-down-outline'}
            size={20}
            color="#07435D"
          />
        </TouchableOpacity>
      </View>

      {/* Przyciski akcji */}
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
  therapistDataContainer: {
    margin: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#C8EDFF',
    borderRadius: 10,
    marginBottom: -10,
    backgroundColor: '#F0F8FF',
  },
  dataTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#07435D',
    marginBottom: 10,
    textAlign: 'center',
  },
  dataField: {
    flexDirection: 'column',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#C8EDFF',
    marginBottom: 5,
  },
  fieldLabel: {
    fontSize: 16,
    color: '#07435D',
    fontWeight: 'bold',
  },
  fieldValue: {
    fontSize: 16,
    color: '#07435D',
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
});

export default TherapistProfileScreen;
