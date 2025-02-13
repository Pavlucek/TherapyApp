import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AdminStatsScreen from '../screens/admin/AdminStatsScreen';

const Stack = createStackNavigator();

const AdminStatsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ 
              headerBackTitleVisible: false, // Ukrywa tekst przycisku powrotu
              headerTitle: '', // brak tytułu we wszystkich ekranach
      headerShown: true }}>
      <Stack.Screen name="AdminStats" component={AdminStatsScreen} />
    </Stack.Navigator>
  );
};

export default AdminStatsStack;
