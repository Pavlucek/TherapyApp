import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TherapistMaterialsScreen from '../screens/TherapistMaterialsScreen';
import TherapistAddMaterialScreen from '../screens/TherapistAddMaterialScreen';
import TherapistMaterialDetailsScreen from '../screens/TherapistMaterialDetailsScreen';

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
        options={{ title: '' , headerShown: false}}
      />
            <Stack.Screen
        name="TherapistAddMaterial"
        component={TherapistAddMaterialScreen}
        options={{ title: '' }}
      />
            <Stack.Screen
        name="TherapistMaterialDetails"
        component={TherapistMaterialDetailsScreen}
        options={{ title: '' , headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default TherapistMaterialsStack;
