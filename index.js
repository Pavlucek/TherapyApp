import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import 'react-native-gesture-handler'; // Upewnij się, że jest zaimportowany na początku

AppRegistry.registerComponent(appName, () => App);
