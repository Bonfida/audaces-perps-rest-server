import { Router } from "express";
import { ApiResponse } from "../types";
import { connection } from "../utils/connection";
import { signAndSendTransactionInstructions, wallet } from "../utils/wallet";
import {
  getUserAccountsForOwner,
  createUserAccount,
  closeAccount,
  depositCollateral,
  withdrawCollateral,
  UserAccount,
} from "@audaces/perps";
import { PublicKey } from "@solana/web3.js";
import { ErrorMessages } from "../utils/errors";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const accounts = await getUserAccountsForOwner(
      connection,
      wallet.publicKey
    );
    accounts.forEach((acc) => {
      // @ts-ignore
      acc.owner = acc.owner.toBase58();
      // @ts-ignore
      acc.market = acc.market.toBase58();
      // @ts-ignore
      acc.address = acc.address.toBase58();
    });
    return res.status(200).json(new ApiResponse(true, accounts));
  } catch (err) {
    return res.status(500).json(new ApiResponse(false, err));
  }
});

router.post("/create/:marketAddress", async (req, res) => {
  try {
    const marketAddress = new PublicKey(req.params.marketAddress);
    const [signers, instructions] = await createUserAccount(
      connection,
      marketAddress,
      wallet.publicKey
    );
    const tx = await signAndSendTransactionInstructions(
      connection,
      signers,
      wallet,
      instructions
    );
    return res.status(200).json(new ApiResponse(true, { signature: tx }));
  } catch (err) {
    return res.status(500).json(new ApiResponse(false, err));
  }
});

router.post("/close/:userAccountAddress", async (req, res) => {
  try {
    const userAccountAddress = new PublicKey(req.params.userAccountAddress);
    const [signers, instructions] = await closeAccount(
      userAccountAddress,
      wallet.publicKey,
      wallet.publicKey
    );
    const tx = await signAndSendTransactionInstructions(
      connection,
      signers,
      wallet,
      instructions
    );
    return res.status(200).json(new ApiResponse(true, { signature: tx }));
  } catch (err) {
    return res.status(500).json(new ApiResponse(false, err));
  }
});

router.post("/deposit/:userAccount", async (req, res) => {
  try {
    const amount = parseFloat(req.body.amount);
    const userAccount = await UserAccount.retrieve(
      connection,
      new PublicKey(req.params.userAccount)
    );
    const marketAddress = userAccount.market;
    if (!amount || !isFinite(amount) || isNaN(amount)) {
      return res
        .status(400)
        .json(new ApiResponse(false, ErrorMessages.account.invalidAmount));
    }
    const [signers, instructions] = await depositCollateral(
      connection,
      marketAddress,
      amount,
      wallet.publicKey,
      userAccount.address
    );
    const tx = await signAndSendTransactionInstructions(
      connection,
      signers,
      wallet,
      instructions
    );
    return res.status(200).json(new ApiResponse(true, { signature: tx }));
  } catch (err) {
    console.warn(err);
    return res.status(500).json(new ApiResponse(false, err));
  }
});

router.post("/withdraw/:userAccount", async (req, res) => {
  try {
    const amount = parseFloat(req.body.amount);
    const userAccount = await UserAccount.retrieve(
      connection,
      new PublicKey(req.params.userAccount)
    );
    const marketAddress = userAccount.market;
    if (!amount || !isFinite(amount) || isNaN(amount)) {
      throw new Error("Invalid amount");
    }
    const [signers, instructions] = await withdrawCollateral(
      connection,
      marketAddress,
      amount,
      wallet.publicKey,
      userAccount.address
    );
    const tx = await signAndSendTransactionInstructions(
      connection,
      signers,
      wallet,
      instructions
    );
    return res.status(200).json(new ApiResponse(true, { signature: tx }));
  } catch (err) {
    console.warn(err);
    return res.status(500).json(new ApiResponse(false, err));
  }
});

export default router;
