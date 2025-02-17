import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TherapistSessionScreen from '../screens/TherapistSessionScreen';
import TherapistSessionDetailsScreen from '../screens/TherapistSessionDetailsScreen';
import TherapistAddSessionScreen from '../screens/TherapistAddSessionScreen';
import TherapistAddDocumentScreen from '../screens/TherapistAddDocumentScreen';
import TherapistAddResourceScreen from '../screens/TherapistAddResourceScreen';

const Stack = createNativeStackNavigator();

const TherapistSessionStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerStyle: { backgroundColor: '#07435D' },
        headerTintColor: '#FFFFFF',
      }}
    >
      <Stack.Screen
        name="TherapistSession"
        component={TherapistSessionScreen}
        options={{ title: '', headerShown: false }}
      />
      <Stack.Screen
        name="TherapistSessionDetails"
        component={TherapistSessionDetailsScreen}
        options={{ title: '', headerShown: false }}
      />
      <Stack.Screen
        name="TherapistAddSession"
        component={TherapistAddSessionScreen}
        options={{ title: '', headerShown: false }}
      />
      <Stack.Screen
        name="AddDocument"
        component={TherapistAddDocumentScreen}
        options={{ title: 'Dodaj zadanie domowe', headerShown: false }}
      />
      <Stack.Screen
        name="AddResource"
        component={TherapistAddResourceScreen}
        options={{ title: 'Dodaj materiał', headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default TherapistSessionStack;
