import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AdminUserStack from './AdminUserStack';
import AdminAssignStack from './AdminAssignStack';
import AdminStatsStack from './AdminStatsStack';


const Tab = createBottomTabNavigator();

const getTabBarIcon = (routeName, focused, color, size) => {
  let iconName;

  switch (routeName) {
    case 'Users':
      iconName = focused ? 'people' : 'people-outline';
      break;
    case 'Assignments':
      iconName = focused ? 'link' : 'link-outline';
      break;
    case 'Statistics':
      iconName = focused ? 'bar-chart' : 'bar-chart-outline';
      break;
    default:
      iconName = 'circle';
      break;
  }

  return <Ionicons name={iconName} size={size} color={color} />;
};

const AdminNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) =>
          getTabBarIcon(route.name, focused, color, size),
        tabBarActiveTintColor: '#42BCBA',
        tabBarInactiveTintColor: '#C8EDFF',
        tabBarStyle: { backgroundColor: '#07435D' },
      })}
    >
      <Tab.Screen name="Users" component={AdminUserStack} />
      <Tab.Screen name="Assignments" component={AdminAssignStack} />
      <Tab.Screen name="Statistics" component={AdminStatsStack} />
    </Tab.Navigator>
  );
};

export default AdminNavigator;
