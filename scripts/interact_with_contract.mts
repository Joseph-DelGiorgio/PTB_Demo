import { TransactionBlock } from '@mysten/sui.js/transactions';
import { SuiClient } from '@mysten/sui.js/client';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';

// Initialize the Sui client
const client = new SuiClient({ url: 'https://fullnode.devnet.sui.io' });

// Create a new transaction block
const txb = new TransactionBlock();

// Use the actual package ID from your deployed contract
const packageId = '0x9dd5e0905d4cd0733c9d5d11ff564d521a6ac6f2a36151dd8a49aaee182177fc';

// Use the actual treasury ID from your deployed contract
const treasuryId = '0x8ba3807b2bfefce96a7ca03a5d29abfbc12deacecf2016e5fadfcd34e8c7bd94';

// Step 1: Create a new position
const newPosition = txb.moveCall({
  target: `${packageId}::PTB_Demo::create_position`,
});

// Step 2: Unstake from the newly created position
txb.moveCall({
  target: `${packageId}::PTB_Demo::unstake`,
  arguments: [newPosition],
});

// Step 3: Claim a referral ticket
const referralTicket = txb.moveCall({
  target: `${packageId}::PTB_Demo::claim_referral_ticket`,
});

// Step 4: Borrow with referral
const amount = 1000; // Example amount
const borrowedCoins = txb.moveCall({
  target: `${packageId}::PTB_Demo::borrow_with_referral`,
  arguments: [
    newPosition,
    referralTicket,
    txb.pure(amount),
    txb.object(treasuryId),
  ],
});

// Step 5: Stake the borrowed amount
txb.moveCall({
  target: `${packageId}::PTB_Demo::stake`,
  arguments: [newPosition, txb.pure(amount)],
});

// Step 6: Perform complex operation
txb.moveCall({
  target: `${packageId}::PTB_Demo::perform_complex_operation`,
  arguments: [
    newPosition,
    txb.pure(amount),
    txb.object(treasuryId),
  ],
});

// Execute the transaction block
async function executeTransaction(signer: Ed25519Keypair) {
  try {
    const result = await client.signAndExecuteTransactionBlock({
      signer,
      transactionBlock: txb,
    });
    console.log('Transaction executed successfully:', result);
  } catch (error) {
    console.error('Error executing transaction:', error);
  }
}

// To execute the transaction, you would call it like this:
// const keypair = new Ed25519Keypair();
// executeTransaction(keypair);
