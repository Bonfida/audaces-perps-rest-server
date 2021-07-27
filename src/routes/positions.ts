import { Router } from "express";
import {
  getOpenPositions,
  reducePositionBaseSize,
  increasePositionCollateral,
  increasePositionBaseSize,
  reducePositionCollateral,
} from "@audaces/perps";
import { connection } from "../utils/connection";
import { wallet, signAndSendTransactionInstructions } from "../utils/wallet";
import { ApiResponse } from "../types";
import { PublicKey } from "@solana/web3.js";
import { getPositionFromIndex } from "../utils/positions";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const positions = await getOpenPositions(connection, wallet.publicKey);
    positions.forEach((p) => {
      // @ts-ignore
      p.userAccount = p.userAccount.toBase58();
      // @ts-ignore
      p.marketAddress = p.marketAddress.toBase58();
    });
    return res.status(200).json(new ApiResponse(true, positions));
  } catch (err) {
    console.warn(err);
    return res.status(500).json(new ApiResponse(false, err));
  }
});

router.post(
  "/add-collateral/:positionIndex/:marketAddress",
  async (req, res) => {
    try {
      const amount = parseInt(req.body.amount);
      const positionIndex = parseInt(req.params.positionIndex);
      const marketAddress = new PublicKey(req.params.marketAddress);
      const position = await getPositionFromIndex(positionIndex, marketAddress);

      const [signers, instructions] = await increasePositionCollateral(
        connection,
        position,
        wallet.publicKey,
        amount
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
  }
);

router.post(
  "/withdraw-collateral/:positionIndex/:marketAddress",
  async (req, res) => {
    try {
      const amount = parseInt(req.body.amount);
      const positionIndex = parseInt(req.params.positionIndex);
      const marketAddress = new PublicKey(req.params.marketAddress);
      const position = await getPositionFromIndex(positionIndex, marketAddress);

      const [signers, instructions] = await reducePositionCollateral(
        connection,
        position,
        wallet.publicKey,
        amount
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
  }
);

router.post("/increase/:positionIndex/:marketAddress", async (req, res) => {
  try {
    const size = parseInt(req.body.size);
    const positionIndex = parseInt(req.params.positionIndex);
    const marketAddress = new PublicKey(req.params.marketAddress);
    const position = await getPositionFromIndex(positionIndex, marketAddress);
    const [signers, instructions] = await increasePositionBaseSize(
      connection,
      position,
      size,
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
    console.warn(err);
    return res.status(500).json(new ApiResponse(false, err));
  }
});

router.post("/decrease/:positionIndex/:marketAddress", async (req, res) => {
  try {
    const size = parseInt(req.body.size);
    const positionIndex = parseInt(req.params.positionIndex);
    const marketAddress = new PublicKey(req.params.marketAddress);
    const position = await getPositionFromIndex(positionIndex, marketAddress);
    const [signers, instructions] = await reducePositionBaseSize(
      connection,
      position,
      size,
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
    console.warn(err);
    return res.status(500).json(new ApiResponse(false, err));
  }
});

export default router;
