import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WalletScreen = () => {
  const wallet = '0x530730bCe83A56AD860cb4fBcFFf8aD82AFd945f'; // 🔥 Wallet fija

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💰 Wallet Ethereum</Text>
      <Text style={styles.label}>Esta es la wallet configurada:</Text>
      <Text style={styles.wallet}>{wallet}</Text>
      <Text style={styles.note}>Esta wallet es fija para todos los usuarios.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 22, marginBottom: 20, fontWeight: 'bold' },
  label: { fontSize: 16, marginBottom: 10 },
  wallet: { fontSize: 16, fontWeight: 'bold', color: '#0080FF' },
  note: { fontSize: 14, marginTop: 20, color: '#777', textAlign: 'center' },
});

export default WalletScreen;

/*import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WalletScreen = () => {
  const [wallet, setWallet] = useState('');
  const [savedWallet, setSavedWallet] = useState('');

  useEffect(() => {
    const loadWallet = async () => {
      const saved = await AsyncStorage.getItem('user_wallet');
      if (saved) {
        setSavedWallet(saved);
        setWallet(saved);
      }
    };
    loadWallet();
  }, []);

  const saveWallet = async () => {
    if (!wallet.startsWith('0x') || wallet.length !== 42) {
      Alert.alert('Error', 'La dirección de wallet no es válida.');
      return;
    }
    await AsyncStorage.setItem('user_wallet', wallet);
    setSavedWallet(wallet);
    Alert.alert('Listo', '¡Wallet guardada correctamente!');
  };

  const deleteWallet = async () => {
    await AsyncStorage.removeItem('user_wallet');
    setWallet('');
    setSavedWallet('');
    Alert.alert('Wallet eliminada');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💰 Wallet Ethereum</Text>
      <TextInput
        style={styles.input}
        placeholder="0x..."
        value={wallet}
        onChangeText={setWallet}
        autoCapitalize="none"
      />
      <Button title={savedWallet ? "Actualizar Wallet" : "Guardar Wallet"} onPress={saveWallet} />
      {savedWallet !== '' && (
        <View style={{ marginTop: 15 }}>
          <Button title="Eliminar Wallet" onPress={deleteWallet} color="#FF4444" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 22, marginBottom: 20, fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    width: '100%',
    padding: 10,
    marginBottom: 20,
  },
});

export default WalletScreen;

*/

