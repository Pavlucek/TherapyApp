//make it simple screen file with text and button
import React from 'react';
import { View, Text, Button } from 'react-native';

const AssignPatientScreen = ({ navigation }) => {
    return (
        <View>
        <Text>Statystyki</Text>
        <Button title="Pokaż logi" onPress={() => navigation.navigate('AdminLogs')} />
        <Button title="Eksportuj dane" onPress={() => navigation.navigate('ExportData')} />
        </View>
    );
    };

export default AssignPatientScreen;
