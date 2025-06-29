import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SendIntentAndroid from 'react-native-send-intent';
import { PermissionsAndroid, Platform } from 'react-native';
import { Linking } from 'react-native';


const AlertScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
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

        /*const wallet = await AsyncStorage.getItem('user_wallet');*/
        const wallet = '0x1234567890abcdef1234567890abcdef12345678'; // 🔥 Wallet fija

        if (!wallet) {
          Alert.alert('🚫 Sin wallet', 'Debes configurar una wallet primero.', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
          return;
        }

        Alert.alert('📡 Obteniendo ubicación', 'Por favor espera unos segundos...');

        const permiso = await requestLocationPermission();
        if (!permiso) {
          console.warn('🛑 Permiso de ubicación denegado');
          Alert.alert('Permiso denegado', 'No se pudo obtener la ubicación');
          return;
}


        Geolocation.getCurrentPosition(
          async (position) => {
            const coords = position.coords;
            setLocation(coords);

            /*const message = `🚨 ¡Emergencia! Estoy en:\n📍 https://maps.google.com/?q=${coords.latitude},${coords.longitude}`;*/
            const message = `🚨 ¡Emergencia de ${nombreFinal}! Estoy en:\n📍 https://maps.google.com/?q=${coords.latitude},${coords.longitude}`;

            contacts.forEach((contact) => {

               // Enviar por SMS
              SendIntentAndroid.sendText({
                text: message,
                phoneNumber: contact.telefono,
                type: SendIntentAndroid.TEXT_PLAIN,
              });

              // Enviar por WhatsApp
              const phone = contact.telefono.startsWith('+') ? contact.telefono : `+57${contact.telefono}`;
              const waURL = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
              Linking.openURL(waURL).catch(() => {
                console.warn(`❌ No se pudo abrir WhatsApp para ${contact.nombre}`);
              });

            });

            console.log(`🔐 Registro simulado en wallet: ${wallet}`);

            const timestamp = new Date().toISOString();
            const newRecord = {
              timestamp,
              location: coords,
              contacts,
              wallet,
            };

            const existingHistory = await AsyncStorage.getItem('alert_history');
            const history = existingHistory ? JSON.parse(existingHistory) : [];
            history.push(newRecord);
            await AsyncStorage.setItem('alert_history', JSON.stringify(history));

            Alert.alert('✅ Alerta enviada', 'Tu ubicación fue compartida con tus contactos de emergencia.', [
              { text: 'OK', onPress: () => navigation.goBack() },
            ]);
          },
          (error) => {
            console.warn('📍 Error de geolocalización:', error); // ← Agrega esto
            Alert.alert('❌ Error', 'No se pudo obtener la ubicación: ' + error.message, [
              { text: 'OK', onPress: () => navigation.goBack() },
            ]);
          },
          { enableHighAccuracy: true, timeout: 30000, maximumAge: 5000 }
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
      <Text>Procesando solicitud...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
});

export default AlertScreen;
