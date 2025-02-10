import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AdminStatsScreen from '../screens/admin/AdminStatsScreen';
import AdminLogsScreen from '../screens/admin/AdminLogsScreen';
import ExportDataScreen from '../screens/admin/ExportDataScreen';

const Stack = createStackNavigator();

const AdminStatsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="AdminStats" component={AdminStatsScreen} />
      <Stack.Screen name="AdminLogs" component={AdminLogsScreen} />
      <Stack.Screen name="ExportData" component={ExportDataScreen} />
    </Stack.Navigator>
  );
};

export default AdminStatsStack;
