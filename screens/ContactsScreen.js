import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const ContactsScreen = () => {
  const [contacts, setContacts] = useState([]);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditando, setIdEditando] = useState(null);

 useEffect(() => {
  const fetchContacts = async () => {
    const loadedContacts = await loadContacts();
    setContacts(loadedContacts);
  };
  fetchContacts();
  }, []);

  const agregarContacto = () => {
    if (!nombre || !telefono) {
      Alert.alert('Error', 'Debes completar ambos campos.');
      return;
    }

    const contactoExiste = contacts.find(
    (c) =>
      c.telefono.trim() === telefono.trim() &&
      (!modoEdicion || c.id !== idEditando)
  );

  if (contactoExiste) {
    Alert.alert('Duplicado', 'Ya existe un contacto con ese número.');
    return;
  }

    if (modoEdicion) {
      const actualizados = contacts.map((c) =>
        c.id === idEditando ? { id: c.id, nombre, telefono } : c
      );
      setContacts(actualizados);
      saveContacts(actualizados);
      setModoEdicion(false);
      setIdEditando(null);
    } else {
      const nuevo = { id: Date.now().toString(), nombre, telefono };
      const actualizados = [...contacts, nuevo];
      setContacts(actualizados);
      saveContacts(actualizados);
    }

    setNombre('');
    setTelefono('');
  };

  const editarContacto = (contacto) => {
  setNombre(contacto.nombre);
  setTelefono(contacto.telefono);
  setModoEdicion(true);
  setIdEditando(contacto.id);
  };

  const eliminarContacto = (id) => {
    const filtrados = contacts.filter((c) => c.id !== id);
    setContacts(filtrados);
    saveContacts(filtrados);
  };

  // Guardar contactos
  const saveContacts = async (contacts) => {
    try {
      await AsyncStorage.setItem('contacts', JSON.stringify(contacts));
    } catch (error) {
      console.error('Error guardando los contactos:', error);
    }
  };

  // Cargar contactos
  const loadContacts = async () => {
    try {
      const savedContacts = await AsyncStorage.getItem('contacts');
      return savedContacts ? JSON.parse(savedContacts) : [];
    } catch (error) {
      console.error('Error cargando los contactos:', error);
      return [];
    }
  };

  const renderItem = ({ item }) => (
<View style={styles.contactItem}>
  <Text>{item.nombre} - {item.telefono}</Text>
  <View style={{ flexDirection: 'row' }}>
    <TouchableOpacity onPress={() => editarContacto(item)}>
      <Text style={styles.editText}>Editar</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => eliminarContacto(item.id)}>
      <Text style={styles.deleteText}>Eliminar</Text>
    </TouchableOpacity>
  </View>
</View>

  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👥 Contactos de Emergencia</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        value={telefono}
        onChangeText={setTelefono}
        keyboardType="phone-pad"
      />
      <TouchableOpacity style={styles.addButton} onPress={agregarContacto}>
  <Text style={styles.buttonText}>{modoEdicion ? 'Actualizar' : 'Agregar'}</Text>
</TouchableOpacity>


      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 8 },
  addButton: { backgroundColor: '#0080FF', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  contactItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  deleteText: { color: '#FF4444' },editText: { color: '#00C851', marginRight: 10 },
});

export default ContactsScreen;
