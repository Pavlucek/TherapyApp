import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const SessionScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Session Screen</Text>
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

export default SessionScreen;
