import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SessionsPatientScreen from '../screens/SessionsPatientScreen';
import SessionsTherapistScreen from '../screens/therapist/SessionsTherapistScreen';
import SessionDetailsScreen from '../screens/SessionDetailsScreen';
import { AuthContext } from '../context/AuthContext';

const SessionsStack = createStackNavigator();

const SessionsStackNavigator = () => {
  const { user } = useContext(AuthContext);

  return (
    <SessionsStack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerStyle: { backgroundColor: '#C8EDFF' },
        headerTintColor: '#07435D',
        headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
      }}
    >
      {user?.role === 'therapist' ? (
        <SessionsStack.Screen
          name="SessionsTherapistScreen"
          component={SessionsTherapistScreen}
          options={{ headerShown: false }}
        />
      ) : (
        <SessionsStack.Screen
          name="SessionsPatientScreen"
          component={SessionsPatientScreen}
          options={{ headerShown: false }}
        />
      )}

      {/* Ekran szczegółów sesji z dynamicznym tytułem */}
      <SessionsStack.Screen
        name="SessionDetails"
        component={SessionDetailsScreen}
        options={({ route }) => ({
          headerShown: false,  // Stały tytuł
        })}
      />
    </SessionsStack.Navigator>
  );
};

export default SessionsStackNavigator;
