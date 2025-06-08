import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from './screens/HomeScreen';
import ContactsScreen from './screens/ContactsScreen';
import LocationScreen from './screens/LocationScreen';
import WalletScreen from './screens/WalletScreen';
import AlertScreen from './screens/AlertScreen';
import WelcomeScreen from './screens/WelcomeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkIfNameExists = async () => {
      const name = await AsyncStorage.getItem('user_name');
      setInitialRoute(name ? 'Inicio' : 'Bienvenida');
    };
    checkIfNameExists();
  }, []);

  if (!initialRoute) return null; // Spinner si quieres

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="Bienvenida" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Inicio" component={HomeScreen} />
        <Stack.Screen name="Contacts" component={ContactsScreen} />
        <Stack.Screen name="Location" component={LocationScreen} />
        <Stack.Screen name="Wallet" component={WalletScreen} />
        <Stack.Screen name="Alert" component={AlertScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
