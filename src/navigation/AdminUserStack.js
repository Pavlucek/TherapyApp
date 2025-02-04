import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import UserListScreen from '../screens/admin/UserListScreen';
import RegisterUserScreen from '../screens/admin/RegisterUserScreen';
import EditUserScreen from '../screens/admin/EditUserScreen';

const Stack = createStackNavigator();

const AdminUserStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserList" component={UserListScreen} />
      <Stack.Screen name="RegisterUser" component={RegisterUserScreen} />
      <Stack.Screen name="EditUser" component={EditUserScreen} />
    </Stack.Navigator>
  );
};

export default AdminUserStack;
