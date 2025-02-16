import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TherapistMaterialsScreen from '../screens/TherapistMaterialsScreen';

const Stack = createNativeStackNavigator();

const TherapistMaterialsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerStyle: { backgroundColor: '#07435D' },
        headerTintColor: '#FFFFFF',
      }}
    >
      <Stack.Screen
        name="TherapistMaterials"
        component={TherapistMaterialsScreen}
        options={{ title: '' }}
      />
    </Stack.Navigator>
  );
};

export default TherapistMaterialsStack;
