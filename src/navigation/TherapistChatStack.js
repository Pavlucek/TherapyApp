import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TherapistChatScreen from '../screens/TherapistChatScreen';

const Stack = createNativeStackNavigator();

const TherapistChatStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerStyle: { backgroundColor: '#07435D' },
        headerTintColor: '#FFFFFF',
      }}
    >
      <Stack.Screen
        name="TherapistChat"
        component={TherapistChatScreen}
        options={{ title: '' }}
      />
    </Stack.Navigator>
  );
};

export default TherapistChatStack;
