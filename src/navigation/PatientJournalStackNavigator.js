import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import JournalScreen from '../screens/JournalScreen';
import JournalDetailsScreen from '../screens/JournalDetailsScreen';
import JournalNewEntryScreen from '../screens/JournalNewEntryScreen';
import JournalEditEntryScreen from '../screens/JournalEditEntryScreen'; // NOWY EKRAN
import TagScreen from '../screens/TagScreen'; // NOWY SCREEN

const JournalStack = createStackNavigator();

const PatientJournalStackNavigator = () => {
  return (
    <JournalStack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerStyle: { backgroundColor: '#C8EDFF' },
        headerTintColor: '#07435D',
        headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
      }}
    >
      <JournalStack.Screen
        name="JournalScreen"
        component={JournalScreen}
        options={{ headerShown: false, title: '' }}
      />

      <JournalStack.Screen
        name="JournalDetails"
        component={JournalDetailsScreen}
        options={{ headerShown: true, title: 'Szczegóły wpisu' }}
      />

      <JournalStack.Screen
        name="JournalEditEntry"
        component={JournalEditEntryScreen}
        options={{ headerShown: true, title: 'Edytuj wpis' }}
      />

      <JournalStack.Screen
        name="JournalNewEntry"
        component={JournalNewEntryScreen}
        options={{ headerShown: true, title: 'Nowy wpis' }}
      />

      <JournalStack.Screen
        name="TagScreen"
        component={TagScreen}
        options={{ headerShown: true, title: 'Tagi' }}
      />
    </JournalStack.Navigator>
  );
};

export default PatientJournalStackNavigator;
