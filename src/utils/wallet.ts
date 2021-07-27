import {
  Keypair,
  Connection,
  TransactionInstruction,
  Transaction,
} from "@solana/web3.js";

const secretKey = JSON.parse(process.env.PRIVATE_KEY);

export const wallet = Keypair.fromSecretKey(new Uint8Array(secretKey));

export const signAndSendTransactionInstructions = async (
  // sign and send transaction
  connection: Connection,
  signers: Array<Keypair>,
  feePayer: Keypair,
  txInstructions: Array<TransactionInstruction>
): Promise<string> => {
  const tx = new Transaction();
  tx.feePayer = feePayer.publicKey;
  signers.push(feePayer);
  tx.add(...txInstructions);
  return await connection.sendTransaction(tx, signers, {
    preflightCommitment: "single",
  });
};
