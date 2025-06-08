import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WelcomeScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');

  const handleContinue = async () => {
    if (!userName.trim()) {
      Alert.alert('⚠️ Atención', 'Por favor, escribe tu nombre.');
      return;
    }
    await AsyncStorage.setItem('user_name', userName.trim());
    navigation.replace('Inicio'); // va directo a Home
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👋 Bienvenido</Text>
      <Text style={styles.subtitle}>¿Cómo te llamas?</Text>
      <TextInput
        style={styles.input}
        placeholder="Tu nombre"
        value={userName}
        onChangeText={setUserName}
      />
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 18, marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, width: '100%' },
  button: { backgroundColor: '#0080FF', padding: 15, borderRadius: 8, marginTop: 20, width: '100%' },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});

export default WelcomeScreen;
