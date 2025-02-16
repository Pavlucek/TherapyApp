import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MaterialsScreen from '../screens/MaterialsScreen';
import MaterialDetailsScreen from '../screens/MaterialDetailsScreen';

const MaterialsStack = createStackNavigator();

const MaterialsStackNavigator = () => {
  return (
    <MaterialsStack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerShown: false,
        headerTitle: '',
      }}
    >
      <MaterialsStack.Screen name="MaterialsScreen" component={MaterialsScreen} />
      <MaterialsStack.Screen
        name="MaterialDetails"
        component={MaterialDetailsScreen}
        options={{
          headerShown: false, // Przykładowo: ukryj nagłówek dla MaterialDetails
          // Możesz ustawić inne opcje, np. headerTitle: 'Szczegóły materiału'
        }}
      />
    </MaterialsStack.Navigator>
  );
};

export default MaterialsStackNavigator;
