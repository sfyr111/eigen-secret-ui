import SecretManager from './secretManager';
import { ethers } from "ethers";

async function connectMetaMask() {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask is not installed');
  }

  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
    return signer;
  } catch (err) {
    console.error(err);
  }
}

async function main() {
  const signer = await connectMetaMask();

  // Step 1: Initialize the account
  const alias = 'your-alias'; // Replace with your desired alias
  await SecretManager.initializeAccount(alias, signer);

  // Step 2: Create a new account
  const options = { /*...*/ }; // Replace with your desired account options
  const createAccountResult = await SecretManager.createAccount(options);
  console.log('Account created:', createAccountResult);

  // Step 3: Query L1 and L2 balances
  const index = 0;
  const assetId = 1;
  const password = 'your-password'; // Replace with your actual password
  const balance = await SecretManager.getAllBalance(index, assetId, password);
  console.log('L1 balance:', balance.l1Balance.toString());
  console.log('L2 balance:', balance.l2Balance.toString());

  // Step 4: Send assets to another account
  const receiver = 'receiver-address'; // Replace with the receiver's address
  const receiverAlias = 'receiver-alias'; // Replace with the receiver's alias
  const value = 10;
  await SecretManager.send(alias, assetId, password, value, index, receiver, receiverAlias);
  console.log('Assets sent:', value);

  // Step 5: Withdraw assets to L1
  const withdrawValue = 5;
  await SecretManager.withdraw(alias, assetId, password, withdrawValue, index);
  console.log('Assets withdrawn:', withdrawValue);
}

main().catch((error) => {
  console.error('Error:', error);
});
