import { Connection } from "@solana/web3.js";

export const connection = new Connection(process.env.CONNECTION);
