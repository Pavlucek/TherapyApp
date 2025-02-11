// styles/buttonStyles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  loginButton: {
    backgroundColor: '#07435D', // Kolor tła
    paddingVertical: 10, // Wysokość przycisku
    paddingHorizontal: 20,
    borderRadius: 25, // Zaokrąglone rogi
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: 'white', // Biały kolor tekstu
    fontSize: 16,
    fontWeight: 'bold',
  },
});
