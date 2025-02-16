import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import TherapistProfileStack from './TherapistProfileStack';
import TherapistChatStack from './TherapistChatStack';
import TherapistHomeStack from './TherapistHomeStack';
import TherapistMaterialsStack from './TherapistMaterialsStack';
import TherapistSessionStack from './TherapistSessionStack';

const Tab = createBottomTabNavigator();

// Funkcja zwracająca ikonę dla zakładki
const getTabBarIcon = (routeName, focused, color, size) => {
  let iconName;

  switch (routeName) {
    case 'Home':
      iconName = focused ? 'home' : 'home-outline';
      break;
    case 'Chat':
      iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
      break;
    case 'Materials':
      iconName = focused ? 'book' : 'book-outline';
      break;
    case 'Sessions':
      iconName = focused ? 'calendar' : 'calendar-outline';
      break;
    case 'Profile':
      iconName = focused ? 'person' : 'person-outline';
      break;
    default:
      iconName = 'ellipse';
      break;
  }

  return <Ionicons name={iconName} size={size} color={color} />;
};

const TherapistNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerBackTitleVisible: false,
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) =>
          getTabBarIcon(route.name, focused, color, size),
        tabBarActiveTintColor: '#42BCBA',
        tabBarInactiveTintColor: '#C8EDFF',
        tabBarStyle: { backgroundColor: '#07435D' },
      })}
    >
      <Tab.Screen
        name="Home"
        component={TherapistHomeStack}
        options={{ tabBarLabel: 'Strona Główna' }}
      />
      <Tab.Screen
        name="Chat"
        component={TherapistChatStack}
        options={{ tabBarLabel: 'Czat' }}
      />
      <Tab.Screen
        name="Materials"
        component={TherapistMaterialsStack}
        options={{ tabBarLabel: 'Materiały' }}
      />
      <Tab.Screen
        name="Sessions"
        component={TherapistSessionStack}
        options={{ tabBarLabel: 'Sesje' }}
      />
      <Tab.Screen
        name="Profile"
        component={TherapistProfileStack}
        options={{ tabBarLabel: 'Profil' }}
      />
    </Tab.Navigator>
  );
};

export default TherapistNavigator;
