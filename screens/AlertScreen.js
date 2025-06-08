import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SendIntentAndroid from 'react-native-send-intent';

const AlertScreen = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const triggerAlert = async () => {
      try {
        // 1. Obtener contactos
        const contactsData = await AsyncStorage.getItem('contacts');
        const contacts = contactsData ? JSON.parse(contactsData) : [];

        if (contacts.length === 0) {
          Alert.alert('Sin contactos', 'Agrega al menos un contacto para enviar alerta.');
          return;
        }

        // 2. Obtener ubicación
        Geolocation.getCurrentPosition(
          async (position) => {
            const coords = position.coords;
            setLocation(coords);

            const message = `🚨 ¡Emergencia! Estoy en:\n📍 https://maps.google.com/?q=${coords.latitude},${coords.longitude}`;

            // 3. Enviar mensaje a cada contacto
            contacts.forEach((contact) => {
              SendIntentAndroid.sendText({
                text: message,
                phoneNumber: contact.telefono,
                type: SendIntentAndroid.TEXT_PLAIN,
              });
            });

            // 4. Simular registro en wallet (solo log local por ahora)
            const wallet = await AsyncStorage.getItem('user_wallet');
            console.log(`🔐 Registro simulado en wallet: ${wallet}`);
          },
          (error) => {
            Alert.alert('Error', 'No se pudo obtener la ubicación: ' + error.message);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
        );
      } catch (e) {
        Alert.alert('Error', 'Ocurrió un error al activar la alerta.');
        console.error(e);
      }
    };

    triggerAlert();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚨 Alerta activada</Text>
      <Text>Enviando ubicación a tus contactos de emergencia...</Text>
      <TouchableOpacity
  style={[styles.button, { backgroundColor: '#FF4444' }]}
  onPress={() => navigation.navigate('Alert')}
>
  <Text style={styles.buttonText}>🚨 Activar Alerta</Text>
</TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
});

export default AlertScreen;
