import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const PositiveSentenceScreen = () => {
  const [sentence, setSentence] = useState('');

  const generateSentence = () => {
    const sentences = [
      "Dzisiaj jest piękny dzień, pełen możliwości!",
      "Wierzę w siebie i swoje możliwości.",
      "Każdy dzień przynosi nowe szanse.",
      "Jestem silny i zdolny do osiągnięcia wszystkiego.",
      "Uśmiechaj się – życie jest piękne!"
    ];
    const randomIndex = Math.floor(Math.random() * sentences.length);
    setSentence(sentences[randomIndex]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pozytywna sentencja na dziś</Text>
      <TouchableOpacity style={styles.button} onPress={generateSentence}>
        <Text style={styles.buttonText}>Generuj sentencję</Text>
      </TouchableOpacity>
      {sentence ? (
        <Text style={styles.sentence}>{sentence}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#07435D',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#07435D',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sentence: {
    fontSize: 20,
    color: '#07435D',
    textAlign: 'center',
  },
});

export default PositiveSentenceScreen;
