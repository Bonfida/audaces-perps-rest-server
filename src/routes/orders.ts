import e, { Router } from "express";
import {
  getTradeInfoFromTx,
  UserAccount,
  createPosition,
  PositionType,
  increasePosition,
  BNB_ADDRESS,
  getDiscountAccount,
  getMarketState,
  completeClosePosition,
  reducePositionBaseSize,
} from "@audaces/perps";
import { connection } from "../utils/connection";
import { ApiResponse } from "../types";
import { PublicKey } from "@solana/web3.js";
import { getPositionsForUserAccount } from "../utils/positions";
import { ErrorMessages } from "../utils/errors";
import { signAndSendTransactionInstructions, wallet } from "../utils/wallet";

const router = Router();

router.get("/details/:tx", async (req, res) => {
  const tx = req.params.tx;
  try {
    const info = await getTradeInfoFromTx(connection, tx);
    return res.status(200).json(new ApiResponse(true, info));
  } catch (err) {
    console.warn(err);
    return res.status(500).json(new ApiResponse(false, err));
  }
});

const sides = ["long", "short"];

router.post("/:userAccount", async (req, res) => {
  try {
    const side = req.body.side; // "long" or "short"
    const size = parseInt(req.body.size); // Quote size
    const leverage = parseInt(req.body.leverage);
    const userAccount = await UserAccount.retrieve(
      connection,
      new PublicKey(req.params.userAccount)
    );
    const positions = await getPositionsForUserAccount(
      new PublicKey(userAccount.address)
    );

    if (!sides.includes(side)) {
      return res
        .status(400)
        .json(new ApiResponse(false, ErrorMessages.orders.side));
    }

    if (!isFinite(size) || isNaN(size)) {
      return res
        .status(400)
        .json(new ApiResponse(false, ErrorMessages.orders.invalidSize));
    }
    if (
      !isFinite(leverage) ||
      isNaN(leverage) ||
      leverage > 15 ||
      leverage < 0
    ) {
      return res
        .status(400)
        .json(new ApiResponse(false, ErrorMessages.orders.invalidLeverage));
    }

    // More than 1 position => ambiguous
    if (positions.length > 1) {
      return res
        .status(400)
        .json(new ApiResponse(false, ErrorMessages.orders.severalPositions));
    }

    // Create a position
    if (positions.length === 0) {
      const [signers, instructions] = await createPosition(
        connection,
        side === "long" ? PositionType.Long : PositionType.Short,
        size,
        leverage,
        userAccount
      );
      const tx = await signAndSendTransactionInstructions(
        connection,
        signers,
        wallet,
        instructions
      );
      return res.status(200).json(new ApiResponse(true, { signature: tx }));
    }
    // Only 1 position

    const currentPosition = positions[0];

    // If same side => increase current position
    if (positions[0].side === side) {
      const [signers, instructions] = await increasePosition(
        connection,
        currentPosition.marketAddress,
        size / leverage,
        leverage,
        currentPosition.positionIndex,
        userAccount.owner,
        userAccount.address,
        BNB_ADDRESS,
        await getDiscountAccount(connection, wallet.publicKey),
        wallet.publicKey
      );
      const tx = await signAndSendTransactionInstructions(
        connection,
        signers,
        wallet,
        instructions
      );
      return res.status(200).json(new ApiResponse(true, { signature: tx }));
    }
    // opposite side => decrease position
    const marketState = await getMarketState(connection, userAccount.market);
    const baseSize =
      (size * marketState.vCoinAmount) /
      (marketState.vQuoteAmount - (side === "long" ? 1 : -1) * size);

    // Complete close
    if (baseSize >= currentPosition.size) {
      const [signers, instructions] = await completeClosePosition(
        connection,
        currentPosition,
        wallet.publicKey
      );
      const tx = await signAndSendTransactionInstructions(
        connection,
        signers,
        wallet,
        instructions
      );
      return res.status(200).json(new ApiResponse(true, { signature: tx }));
    }

    // Partial close
    const [signers, instructions] = await reducePositionBaseSize(
      connection,
      currentPosition,
      baseSize,
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
