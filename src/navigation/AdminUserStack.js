// src/navigation/AdminUserStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import UserListScreen from '../screens/admin/UserListScreen';
import RegisterUserChoiceScreen from '../screens/admin/RegisterUserChoiceScreen';
import RegisterTherapistScreen from '../screens/admin/RegisterTherapistScreen';
import RegisterPatientScreen from '../screens/admin/RegisterPatientScreen';
import EditUserScreen from '../screens/admin/EditUserScreen';

const Stack = createStackNavigator();

const AdminUserStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="UserList" component={UserListScreen} />
      <Stack.Screen name="RegisterUser" component={RegisterUserChoiceScreen} />
      <Stack.Screen name="RegisterTherapist" component={RegisterTherapistScreen} />
      <Stack.Screen name="RegisterPatient" component={RegisterPatientScreen} />
      <Stack.Screen name="EditUser" component={EditUserScreen} />
    </Stack.Navigator>
  );
};

export default AdminUserStack;
