// create simple stack navigator for this screen

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SessionsPatientScreen from '../screens/SessionsPatientScreen';

const SessionsStack = createStackNavigator();

const SessionsStackNavigator = () => {
    return (
        <SessionsStack.Navigator
            screenOptions={{
                headerBackTitleVisible: false,
                headerShown: false,
                headerTitle: '',
            }}
        >
            <SessionsStack.Screen name="SessionsPatientScreen" component={SessionsPatientScreen} />
        </SessionsStack.Navigator>
    );
};

export default SessionsStackNavigator;
