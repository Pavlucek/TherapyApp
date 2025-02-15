// hooks/useChat.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getMessages, addMessage } from '../api/DiscussionBoardApi';

const useChat = (token, patientId, therapistId, userRole) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const flatListRef = useRef();

  // Function to fetch messages from API
  const fetchMessages = useCallback(async () => {
    // Only fetch if we have valid IDs
    if (!patientId || !therapistId) {return;}
    try {
      const data = await getMessages(token, patientId, therapistId);
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      Alert.alert('Błąd', 'Nie udało się pobrać wiadomości');
    } finally {
      setLoading(false);
    }
  }, [token, patientId, therapistId]);

  // When therapistId changes, reset messages and fetch new ones
  useEffect(() => {
    if (!patientId || !therapistId) {return;}
    setMessages([]);
    setLoading(true);
    fetchMessages();
  }, [patientId, therapistId, fetchMessages]);

  // Poll messages when the screen is focused
  useFocusEffect(
    useCallback(() => {
      if (!patientId || !therapistId) {return;}
      fetchMessages();
      const intervalId = setInterval(fetchMessages, 5000);
      return () => clearInterval(intervalId);
    }, [fetchMessages, patientId, therapistId])
  );

  // Function to send a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !patientId || !therapistId) {return;}

    setIsSending(true);
    const payload = {
      patient_id: patientId,
      therapist_id: therapistId,
      sender: userRole,
      message: newMessage.trim(),
      attachment: null,
    };

    try {
      const sentMessage = await addMessage(token, payload);
      setMessages(prevMessages => [...prevMessages, sentMessage]);
      setNewMessage('');
      // Scroll to the bottom after sending
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Błąd', 'Nie udało się wysłać wiadomości');
    } finally {
      setIsSending(false);
    }
  };

  return {
    messages,
    newMessage,
    setNewMessage,
    loading,
    isSending,
    handleSendMessage,
    flatListRef,
    fetchMessages,
  };
};

export default useChat;
