import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import JournalScreen from '../screens/JournalScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import ChatScreen from '../screens/ChatScreen';
import MaterialsStackNavigator from './MaterialsStackNavigator'; // nowy stos dla materiałów

const Tab = createBottomTabNavigator();
const ProfileStack = createStackNavigator();

const getTabBarIcon = (routeName, focused, color, size) => {
  let iconName;

  switch (routeName) {
    case 'Materiały':
      iconName = focused ? 'document-text' : 'document-text-outline';
      break;
    case 'Dziennik':
      iconName = focused ? 'book' : 'book-outline';
      break;
    case 'Ustawienia':
      iconName = focused ? 'settings' : 'settings-outline';
      break;
    case 'Profil':
      iconName = focused ? 'person' : 'person-outline';
      break;
    case 'Czat':
      iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
      break;
    default:
      iconName = 'circle';
      break;
  }

  return <Ionicons name={iconName} size={size} color={color} />;
};

// Tworzymy stos nawigacji dla ekranu Profilu
const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerShown: true,
        headerTitle: '',
      }}
    >
      <ProfileStack.Screen name="ProfilUżytkownika" component={ProfileScreen} />
      <ProfileStack.Screen name="EdytujProfil" component={EditProfileScreen} />
      <ProfileStack.Screen name="ZmieńHasło" component={ChangePasswordScreen} />
    </ProfileStack.Navigator>
  );
};

const PatientNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerBackTitleVisible: false,
        headerShown: false,
        headerTitle: '',
        tabBarIcon: ({ focused, color, size }) =>
          getTabBarIcon(route.name, focused, color, size),
        tabBarActiveTintColor: '#42BCBA',
        tabBarInactiveTintColor: '#C8EDFF',
        tabBarStyle: { backgroundColor: '#07435D' },
      })}
    >
      <Tab.Screen name="Dziennik" component={JournalScreen} />
      <Tab.Screen name="Materiały" component={MaterialsStackNavigator} />
      <Tab.Screen name="Czat" component={ChatScreen} />
      <Tab.Screen name="Profil" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
};

export default PatientNavigator;
