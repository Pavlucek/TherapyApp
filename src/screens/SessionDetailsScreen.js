import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';

import { AuthContext } from '../context/AuthContext';
import sessionsApi from '../api/sessionsApi';

// Format daty w stylu DD.MM.YYYY
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

// Format czasu HH:MM
const formatTime = (timeString) => {
  if (!timeString) {return 'Brak';}
  return timeString.substring(0, 5);
};

const SessionDetailsScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const route = useRoute();
  const { sessionId } = route.params;

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [resources, setResources] = useState([]);

  // Funkcja pobierająca szczegóły danej sesji (oraz dokumenty i materiały)
  const fetchSessionDetails = async () => {
    if (!user) {return;}
    console.log(`[SessionDetailsScreen] Pobieranie szczegółów sesji ID: ${sessionId}`);
    setLoading(true);

    try {
      const sessionData = await sessionsApi.getSession(sessionId, user.token);
      setSession(sessionData);

      const documentsData = await sessionsApi.getDocuments(sessionId, user.token);
      setDocuments(documentsData);

      const resourcesData = await sessionsApi.getResources(sessionId, user.token);
      setResources(resourcesData);

      console.log('[SessionDetailsScreen] Szczegóły sesji pobrane:', sessionData);
    } catch (error) {
      console.error('[SessionDetailsScreen] Błąd pobierania danych:', error);
    } finally {
      setLoading(false);
    }
  };

  // Pobranie szczegółów przy montowaniu ekranu
  useEffect(() => {
    fetchSessionDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#07435D" />
        <Text style={styles.loaderText}>Ładowanie szczegółów sesji...</Text>
      </View>
    );
  }

  if (!session) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Nie znaleziono sesji.</Text>
      </View>
    );
  }

  // Renderowanie jednego dokumentu (zadania domowego)
  const renderDocument = ({ item }) => (
    <View style={styles.documentCard}>
      <Text style={styles.documentTitle}>{item.title}</Text>
      <Text style={styles.documentContent}>{item.content}</Text>
      <Text style={styles.documentMeta}>Termin: {formatDate(item.dueDate)}</Text>
      <Text style={styles.documentMeta}>Status: {item.submitted ? 'Oddane' : 'Nieoddane'}</Text>
    </View>
  );

  // Renderowanie jednego materiału
  const renderResource = ({ item }) => (
    <TouchableOpacity
      style={styles.resourceCard}
      onPress={() => navigation.navigate('MaterialDetails', { id: item.id })}
    >
      <Text style={styles.resourceTitle}>{item.title}</Text>
      <Text style={styles.resourceDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      {/* SafeAreaView wyłącznie dla górnego obszaru (z notchem / dynamic island). */}
      <SafeAreaView style={{ flex: 0, backgroundColor: '#C8EDFF' }} />

      {/* Drugi SafeAreaView obejmujący resztę ekranu */}
      <View style={styles.container}>
        {/* Nagłówek w stylu ekranu „Moje Sesje”, ale z tytułem „Szczegóły Sesji” */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#07435D" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Szczegóły Sesji</Text>

          {/* Przycisk odświeżania */}
          <TouchableOpacity onPress={fetchSessionDetails}>
            <Ionicons name="refresh-outline" size={24} color="#07435D" />
          </TouchableOpacity>
        </View>

        {/* Wyświetlenie danych o sesji + listy dokumentów i materiałów */}
        <FlatList
          ListHeaderComponent={
            <View style={{ paddingHorizontal: 16 }}>
              <View style={styles.sessionCard}>
                <View style={styles.sessionHeader}>
                  <Ionicons name="calendar-outline" size={20} color="#07435D" />
                  <Text style={styles.sessionDate}>{formatDate(session.date)}</Text>
                </View>
                <Text style={styles.sessionTime}>
                  {formatTime(session.startTime)} - {formatTime(session.endTime)}
                </Text>
                <Text style={styles.sessionStatus}>Status: {session.status}</Text>
                <Text style={styles.sessionLocation}>
                  Lokalizacja: {session.location || 'Online'}
                </Text>

                {/* Notatki i link do spotkania */}
                <Text style={styles.sessionDetail}>
                  Notatki: {session.notes || 'Brak notatek'}
                </Text>
                <Text style={styles.sessionDetail}>
                  Link do spotkania: {session.meetingLink || 'Brak'}
                </Text>
              </View>

              {/* Lista zadań domowych */}
              <Text style={styles.sectionTitle}>Zadania domowe</Text>
            </View>
          }
          data={documents} // Najpierw wyświetlamy dokumenty
          keyExtractor={(item) => 'doc-' + item.id.toString()}
          renderItem={renderDocument}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchSessionDetails}
              tintColor="#07435D"
              colors={['#07435D']}
              title="Odświeżanie..."
            />
          }
          ListEmptyComponent={
            documents.length === 0 && (
              <Text style={styles.emptyText}>Brak przypisanych zadań domowych</Text>
            )
          }
          ListFooterComponent={
            <View style={{ paddingHorizontal: 16 }}>
              {/* Lista materiałów */}
              <Text style={styles.sectionTitle}>Materiały</Text>
              {resources.length === 0 ? (
                <Text style={styles.emptyText}>Brak przypisanych materiałów</Text>
              ) : (
                <FlatList
                  data={resources}
                  keyExtractor={(item) => 'res-' + item.id.toString()}
                  renderItem={renderResource}
                  contentContainerStyle={{ paddingBottom: 16 }}
                />
              )}
            </View>
          }
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerContainer: {
    backgroundColor: '#C8EDFF',
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between', // back icon, title, refresh icon
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#07435D',
  },
  listContainer: {
    paddingBottom: 20,
  },
  sessionCard: {
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionDate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#07435D',
    marginLeft: 8,
  },
  sessionTime: {
    fontSize: 16,
    color: '#333',
    marginTop: 4,
  },
  sessionStatus: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  sessionLocation: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  sessionDetail: {
    fontSize: 14,
    color: '#444',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#07435D',
    marginVertical: 10,
  },
  documentCard: {
    backgroundColor: '#FFF3E0',
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FFAB40',
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D84315',
  },
  documentContent: {
    fontSize: 14,
    color: '#444',
    marginTop: 4,
  },
  documentMeta: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  resourceCard: {
    backgroundColor: '#E3F2FD',
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#42A5F5',
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  resourceDescription: {
    fontSize: 14,
    color: '#444',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#07435D',
    marginTop: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#07435D',
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'red',
    marginTop: 20,
  },
});

export default SessionDetailsScreen;
