// utils/web3Config.js

import Web3 from 'web3';

// 🔐 Configuración
const INFURA_URL = 'https://sepolia.infura.io/v3/831151e87ce54ac796a6d2145b93d164'; // 🔁 Reemplaza con tu ID real
const PRIVATE_KEY = '<gE08<IqQ6on'; // ⚠️ Solo para pruebas, nunca uses esto en producción
const CONTRACT_ADDRESS = '0xd9145CCE52D386f254917e481eB44e9943F39138';

// ABI proporcionado
const ABI = [
	{
		"anonymous": false,
		"inputs": [
			{ "indexed": true, "internalType": "address", "name": "sender", "type": "address" },
			{ "indexed": false, "internalType": "string", "name": "userName", "type": "string" },
			{ "indexed": false, "internalType": "string", "name": "latitude", "type": "string" },
			{ "indexed": false, "internalType": "string", "name": "longitude", "type": "string" },
			{ "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
		],
		"name": "AlertSent",
		"type": "event"
	},
	{
		"inputs": [
			{ "internalType": "string", "name": "userName", "type": "string" },
			{ "internalType": "string", "name": "latitude", "type": "string" },
			{ "internalType": "string", "name": "longitude", "type": "string" }
		],
		"name": "sendAlert",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ],
		"name": "alerts",
		"outputs": [
			{ "internalType": "address", "name": "sender", "type": "address" },
			{ "internalType": "string", "name": "userName", "type": "string" },
			{ "internalType": "string", "name": "latitude", "type": "string" },
			{ "internalType": "string", "name": "longitude", "type": "string" },
			{ "internalType": "uint256", "name": "timestamp", "type": "uint256" }
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [ { "internalType": "uint256", "name": "index", "type": "uint256" } ],
		"name": "getAlert",
		"outputs": [
			{ "internalType": "address", "name": "", "type": "address" },
			{ "internalType": "string", "name": "", "type": "string" },
			{ "internalType": "string", "name": "", "type": "string" },
			{ "internalType": "string", "name": "", "type": "string" },
			{ "internalType": "uint256", "name": "", "type": "uint256" }
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTotalAlerts",
		"outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ],
		"stateMutability": "view",
		"type": "function"
	}
];

// 📡 Inicializar Web3
const web3 = new Web3(new Web3.providers.HttpProvider(INFURA_URL));
const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);

const contrato = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

export const enviarAlertaBlockchain = async (userName, lat, lng) => {
  try {
    const tx = await contrato.methods
      .sendAlert(userName, lat.toString(), lng.toString())
      .send({ from: account.address, gas: 300000 });

    console.log('✅ Transacción enviada:', tx.transactionHash);
    return tx.transactionHash;
  } catch (error) {
    console.error('❌ Error en blockchain:', error);
    throw error;
  }
};
