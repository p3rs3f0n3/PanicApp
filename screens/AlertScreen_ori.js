import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SendIntentAndroid from 'react-native-send-intent'; // SMS
import { enviarAlertaBlockchain } from '../utils/web3Config';

const AlertScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  useEffect(() => {
    const triggerAlert = async () => {
      try {
        const contactsData = await AsyncStorage.getItem('contacts');
        const contacts = contactsData ? JSON.parse(contactsData) : [];

        const name = await AsyncStorage.getItem('user_name');
        const nombreFinal = name || 'Usuario';
        setUserName(nombreFinal);

        if (contacts.length === 0) {
          Alert.alert('🚫 Sin contactos', 'Agrega al menos un contacto para enviar la alerta.', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
          return;
        }

        Alert.alert('🔐 Ruta de pánico activada', 'Notificando a tu red de apoyo...');

        const permiso = await requestLocationPermission();
        if (!permiso) {
          Alert.alert('Permiso denegado', 'No se pudo obtener la ubicación');
          return;
        }

        Geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const googleMapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;
            const message = `🚨 ¡Emergencia de ${nombreFinal}! Estoy en: ${googleMapsLink}`;

            // Enviar mensaje por SMS
            contacts.forEach((contact) => {
              SendIntentAndroid.sendText({
                text: message,
                phoneNumber: contact.telefono,
                type: SendIntentAndroid.TEXT_PLAIN,
              });
            });

            // Simular WhatsApp vía backend (reemplazar URL con tu endpoint real)
            fetch('https://tu-backend.com/api/enviar-whatsapp', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                from: 'AlertaApp',
                to: contacts.map(c => c.telefono),
                message,
              }),
            }).catch(err => console.warn('❌ Error WhatsApp:', err));

            // Enviar a blockchain
            const txHash = await enviarAlertaBlockchain(nombreFinal, latitude, longitude);
            if (!txHash) {
              console.warn('❌ Error enviando a blockchain');
            }

            // Guardar historial local
            const timestamp = new Date().toISOString();
            const newRecord = {
              timestamp,
              location: { latitude, longitude },
              contacts,
              txHash,
            };
            const existingHistory = await AsyncStorage.getItem('alert_history');
            const history = existingHistory ? JSON.parse(existingHistory) : [];
            history.push(newRecord);
            await AsyncStorage.setItem('alert_history', JSON.stringify(history));

            Alert.alert(
              '✅ Alerta enviada',
              `Tu red fue notificada exitosamente.\nTxHash: ${txHash.slice(0, 10)}...`,
              [
                {
                  text: 'Ver en Etherscan',
                  onPress: () => {
                    const url = `https://sepolia.etherscan.io/tx/${txHash}`;
                    Linking.openURL(url);
                  },
                },
                { text: 'OK', onPress: () => navigation.goBack() },
              ]
            );
          },
          (error) => {
            Alert.alert('❌ Error', 'No se pudo obtener la ubicación: ' + error.message, [
              { text: 'OK', onPress: () => navigation.goBack() },
            ]);
          },
          { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 }
        );
      } catch (e) {
        Alert.alert('⚠️ Error', 'Ocurrió un error al activar la alerta.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
        console.error(e);
      }
    };

    triggerAlert();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚨 Alerta activada</Text>
      <Text>Procesando en segundo plano...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
});

export default AlertScreen;
