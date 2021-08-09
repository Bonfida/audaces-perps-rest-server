import { Router } from "express";
import { connection } from "../utils/connection";
import { checkPayload } from "../utils/tradingview";
import { getUserAccountsForOwner, MarketState } from "@audaces/perps";
import { wallet } from "../utils/wallet";
import { apiPost } from "../utils/rest";
import { ApiResponse } from "../types";

const router = Router();

// //
// Only endpoint to expect ui amounts
// //
router.post("/", async (req, res) => {
  try {
    const rawPayload = req.body;
    const payload = checkPayload(rawPayload);
    if (!payload.isValid) {
      console.log(`Received invalid payload`);
      return res.status(400).json(new ApiResponse(false));
    }
    // Fetch user account
    const userAccount = (
      await getUserAccountsForOwner(connection, wallet.publicKey)
    ).find((acc) => acc.market.equals(payload.marketAddress));
    if (!userAccount) {
      console.log(`User account does not exist`);
      return res
        .status(400)
        .json(new ApiResponse(false, "User account does not exist"));
    }

    // Get decimals and convert uiAmount -> Amount
    const decimals = (
      await MarketState.retrieve(connection, payload.marketAddress)
    ).quoteDecimals;

    // Forward request
    const response: ApiResponse = await apiPost(
      `http://localhost:3000/orders/${userAccount.address.toBase58()}`,
      {
        side: payload.side,
        size: payload.size * Math.pow(10, decimals),
        leverage: payload.leverage,
      },
      {
        "Content-Type": "application/json",
      }
    );
    console.log(
      `Response - success: ${response.success} - result: ${response.result}`
    );
    return res.status(200).json(response);
  } catch (err) {
    return res.status(400).json(new ApiResponse(err.message));
  }
});

export default router;
