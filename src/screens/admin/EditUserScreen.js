//make it simple screen file with text and button
import React from 'react';
import { View, Text, Button } from 'react-native';

const EditUserScreen = ({ navigation }) => {
    return (
        <View>
        <Text>Edytuj użytkownika</Text>
        <Button title="Zapisz zmiany" onPress={() => navigation.navigate('AdminDashboard')} />
        </View>
    );
    };

export default EditUserScreen;
