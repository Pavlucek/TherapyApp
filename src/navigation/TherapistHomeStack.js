import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TherapistHomeScreen from '../screens/TherapistHomeScreen';
import TherapistPatientDetails from '../screens/TherapistPatientDetailsScreen';

const Stack = createNativeStackNavigator();

const TherapistHomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerStyle: { backgroundColor: '#07435D' },
        headerTintColor: '#FFFFFF',
      }}
    >
      <Stack.Screen
        name="TherapistHome"
        component={TherapistHomeScreen}
        options={{ title: '', headerShown: false }}
      />
      <Stack.Screen
        name="TherapistPatientDetails"
        component={TherapistPatientDetails}
        options={{ title: 'Szczegóły pacjenta' }}
      />
    </Stack.Navigator>
  );
};

export default TherapistHomeStack;
