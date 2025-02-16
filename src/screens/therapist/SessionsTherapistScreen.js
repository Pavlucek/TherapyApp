import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SessionsTherapistScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Lista sesji terapeuty</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default SessionsTherapistScreen;
