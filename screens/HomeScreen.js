import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Botón de Pánico 🔔</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Contacts')}>
        <Text style={styles.buttonText}>👥 Contactos de Emergencia</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Location')}>
        <Text style={styles.buttonText}>📍 Compartir Ubicación</Text>
      </TouchableOpacity>

      {/*<TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Wallet')}>
        <Text style={styles.buttonText}>💰 Configurar Wallet</Text>
      </TouchableOpacity>*/}

      <TouchableOpacity style={[styles.button, { backgroundColor: '#FF4444' }]}
        onPress={() => navigation.navigate('Alert')}
      >
        <Text style={styles.buttonText}>🚨 Activar Alerta</Text>
      </TouchableOpacity>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    marginBottom: 30,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#0080FF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginBottom: 15,
    width: '100%',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default HomeScreen;
