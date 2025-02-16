import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TherapistHomeScreen from '../screens/TherapistHomeScreen';

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
        options={{ title: '' }}
      />
    </Stack.Navigator>
  );
};

export default TherapistHomeStack;
