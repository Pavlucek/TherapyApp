import React from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import {AuthProvider} from './src/context/AuthContext';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#C8EDFF', // Kolor podstawowy używany przez nawigację
    background: '#ffffff', // Tło aplikacji
    card: '#07435D', // Kolor tła nagłówka lub karty
    text: '#ffffff', // Kolor tekstu nagłówka
    border: '#ffffff', // Kolor obramowania
    notification: '#42f44b', // Kolor powiadomień
  },
};

const App = () => {
  return (
    <NavigationContainer theme={MyTheme}>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
};

export default App;
