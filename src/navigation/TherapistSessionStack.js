import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TherapistSessionScreen from '../screens/TherapistSessionScreen';

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
        options={{ title: '' }}
      />
    </Stack.Navigator>
  );
};

export default TherapistSessionStack;
