import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Alert,
  Button,
  Linking,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LocationScreen = () => {
  const [location, setLocation] = useState(null);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const data = await AsyncStorage.getItem('contacts');
        if (data) {
          setContacts(JSON.parse(data));
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudieron cargar los contactos');
      }
    };

    const getLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Alert.alert('Permiso denegado');
        return;
      }

      Geolocation.getCurrentPosition(
        (position) => {
          setLocation(position.coords);
        },
        (error) => {
          Alert.alert('Error', 'No se pudo obtener la ubicación: ' + error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    };

    loadContacts();
    getLocation();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Permiso para acceder a la ubicación',
          message: 'Esta app necesita tu ubicación para enviar alertas de emergencia',
          buttonNeutral: 'Pregúntame después',
          buttonNegative: 'Cancelar',
          buttonPositive: 'Aceptar',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const sendLocationToContact = (contact) => {
    if (!location) return;

    const phone = contact.telefono.startsWith('+') ? contact.telefono : `+57${contact.telefono}`;
    const googleMapsLink = `https://maps.google.com/?q=${location.latitude},${location.longitude}`;
    const message = `🚨 ¡Ayuda! Estoy en esta ubicación: ${googleMapsLink}`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'No se pudo abrir WhatsApp');
    });
  };

  const sendLocationToAll = () => {
    contacts.forEach((contact) => sendLocationToContact(contact));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📍 Compartir Ubicación</Text>
      {location && (
        <View style={styles.coords}>
          <Text>Latitud: {location.latitude}</Text>
          <Text>Longitud: {location.longitude}</Text>
        </View>
      )}
      <View style={styles.contactsContainer}>
        <Text style={styles.subtitle}>Selecciona un contacto:</Text>
        {contacts.map((contact, index) => (
  <View key={index} style={{ marginBottom: 10 }}>
    <Button
      title={`Enviar a ${contact.nombre}`}
      onPress={() => sendLocationToContact(contact)}
    />
  </View>
))}

        {contacts.length > 1 && (
  <View style={{ marginTop: 20 }}>
    <Button
      title="Enviar a todos"
      color="#FF4444"
      onPress={sendLocationToAll}
    />
  </View>
)}

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 22, marginBottom: 20, fontWeight: 'bold' },
  coords: { marginTop: 20, marginBottom: 20 },
  contactsContainer: { marginTop: 30, width: '100%' },
  subtitle: { fontSize: 18, marginBottom: 10, fontWeight: 'bold' },
});

export default LocationScreen;
