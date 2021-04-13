import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TempScreen from './src/screens/TempScreen';
import MainScreen from './src/screens/MainScreen';
import ConfigScreen from './src/screens/ConfigScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen name="Main" component={MainScreen} options={{title:'Menú principal'}} />
        <Stack.Screen name="Temp" component={TempScreen} options={{title:'Estado del sistema'}}/>
        <Stack.Screen name="Config" component={ConfigScreen} options={{title:'Configuración'}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}


