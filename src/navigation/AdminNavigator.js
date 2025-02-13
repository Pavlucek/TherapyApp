import React, { useContext, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AdminUserStack from './AdminUserStack';
import AdminAssignStack from './AdminAssignStack';
import AdminStatsStack from './AdminStatsStack';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const getTabBarIcon = (routeName, focused, color, size) => {
  let iconName;

  switch (routeName) {
    case 'Użytkownicy':
      iconName = focused ? 'people' : 'people-outline';
      break;
    case 'Przypisania':
      iconName = focused ? 'link' : 'link-outline';
      break;
    case 'Statystyki':
      iconName = focused ? 'bar-chart' : 'bar-chart-outline';
      break;
    default:
      iconName = 'circle';
      break;
  }

  return <Ionicons name={iconName} size={size} color={color} />;
};

const AdminNavigator = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigation = useNavigation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigation.replace('Auth');
    }
  }, [isAuthenticated, navigation]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        headerBackTitleVisible: false, // Ukrywa tekst przycisku powrotu
        headerTitle: '', // brak tytułu we wszystkich ekranach
        tabBarIcon: ({ focused, color, size }) =>
          getTabBarIcon(route.name, focused, color, size),
        tabBarActiveTintColor: '#42BCBA',
        tabBarInactiveTintColor: '#C8EDFF',
        tabBarStyle: { backgroundColor: '#07435D' },
      })}
    >
      <Tab.Screen name="Użytkownicy" component={AdminUserStack} />
      <Tab.Screen name="Przypisania" component={AdminAssignStack} />
      <Tab.Screen name="Statystyki" component={AdminStatsStack} />
    </Tab.Navigator>
  );
};

export default AdminNavigator;
