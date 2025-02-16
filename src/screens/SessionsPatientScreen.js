//create simple template for this sreen
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const SessionsPatientScreen = () => {
    return (
        <View style={styles.container}>
        <Text>Sessions Patient Screen</Text>
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

export default SessionsPatientScreen;
