import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TherapistListScreen from '../screens/admin/TherapistListScreen';
import AssignPatientScreen from '../screens/admin/AssignPatientScreen';

const Stack = createStackNavigator();

const AdminAssignStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="TherapistList" component={TherapistListScreen} />
      <Stack.Screen name="AssignPatient" component={AssignPatientScreen} />
    </Stack.Navigator>
  );
};

export default AdminAssignStack;
