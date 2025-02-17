import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
import useChat from '../hooks/useChat';
import { getPatient } from '../api/SomeApi'; // opcjonalnie, jeśli chcesz pobrać dodatkowe dane pacjenta

const TherapistChatDetailScreen = ({ route, navigation }) => {
  const { user } = useContext(AuthContext);

  // Jeśli użytkownik nie jest zalogowany, wyświetl loader
  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Ładowanie...</Text>
      </View>
    );
  }

  const token = user.token;

  // Pacjent, z którym rozmawia terapeuta, powinien być przekazany przez route.params
  const { patient } = route.params;
  // Jeśli masz już patientId lub inne dane, możesz je ustawić
  const safePatientId = patient?.id;
  // Terapeuta – dla niego używamy danych z tokena lub, jeśli masz dodatkowo, route.params
  // Możesz założyć, że w tokenie jest przypisany identyfikator terapeuty lub pobrać go z profilu
  const safeTherapistId = user.therapistId || user.id;

  // Używamy custom hooka do obsługi czatu
  const {
    messages,
    newMessage,
    setNewMessage,
    loading,
    isSending,
    handleSendMessage,
    flatListRef,
    fetchMessages,
  } = useChat(token, safePatientId, safeTherapistId, user.role);

  // Opcjonalnie: jeśli chcesz pobrać dodatkowe dane pacjenta, możesz je przechowywać w stanie
  const [patientDetails, setPatientDetails] = useState(patient);

  // Jeśli nie przekazano wymaganych parametrów, wyświetl komunikat o błędzie
  if (!safePatientId || !safeTherapistId) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Brak wymaganych parametrów: patientId lub therapistId.
        </Text>
      </View>
    );
  }

  // Funkcja renderująca pojedynczą wiadomość
  const renderMessageItem = ({ item }) => {
    const isMyMessage = item.sender === user.role;
    return (
      <View
        style={[
          styles.messageContainer,
          isMyMessage ? styles.myMessage : styles.theirMessage,
        ]}
      >
        <Text style={styles.messageText}>{item.message}</Text>
        <Text style={styles.messageTime}>
          {new Date(item.date).toLocaleTimeString()}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Nagłówek opakowany w SafeAreaView */}
      <SafeAreaView style={styles.headerContainer}>
        <Text style={styles.headerGreeting}>Czat z pacjentem:</Text>
        <Text style={styles.headerPatientName}>
          {patientDetails ? patientDetails.name : 'Ładowanie...'}
        </Text>
      </SafeAreaView>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMessageItem}
        contentContainerStyle={styles.messagesList}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchMessages}
            title="Odświeżanie wiadomości..."
            tintColor="#07435D"
            colors={['#07435D']}
          />
        }
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Napisz wiadomość..."
          value={newMessage}
          onChangeText={setNewMessage}
          editable={!isSending}
        />
        <TouchableOpacity
          style={[styles.sendButton, isSending && styles.sendButtonDisabled]}
          onPress={handleSendMessage}
          disabled={isSending}
        >
          <Ionicons name="send" size={24} color="#ffffff" />
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
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerGreeting: {
    fontSize: 20,
    color: '#07435D',
  },
  headerPatientName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#07435D',
    marginTop: 10,
  },
  messagesList: {
    padding: 10,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#42BCBA',
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0F8FF',
  },
  messageText: {
    fontSize: 16,
    color: '#07435D',
  },
  messageTime: {
    fontSize: 10,
    color: '#07435D',
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#07435D',
    borderRadius: 25,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#07435D',
    padding: 10,
    borderRadius: 25,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default TherapistChatDetailScreen;
