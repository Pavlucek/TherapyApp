import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AuthNavigator from './AuthNavigator';
import TherapistNavigator from './TherapistNavigator';
import PatientNavigator from './PatientNavigator';
import AdminNavigator from './AdminNavigator';
import { AuthContext } from '../context/AuthContext';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated, user } = useContext(AuthContext);

  return (
    <Stack.Navigator screenOptions={{ 
              headerBackTitleVisible: false, // Ukrywa tekst przycisku powrotu
              headerShown: false }}>
      {isAuthenticated && user ? (
        user.role === 'therapist' ? (
          <Stack.Screen name="Therapist" component={TherapistNavigator} />
        ) : user.role === 'admin' ? (
          <Stack.Screen name="Admin" component={AdminNavigator} />
        ) : (
          <Stack.Screen name="Patient" component={PatientNavigator} />
        )
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} /> // ✅ Automatyczne przekierowanie
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
