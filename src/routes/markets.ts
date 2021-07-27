import { Router } from "express";
import { MARKETS, MarketState, getOraclePrice } from "@audaces/perps";
import { ApiResponse } from "../types";
import { connection } from "../utils/connection";
import { PublicKey } from "@solana/web3.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    return res.status(200).json(new ApiResponse(true, MARKETS));
  } catch (err) {
    console.warn(err);
    return res.status(500).json(new ApiResponse(false, err));
  }
});

router.get("/:address", async (req, res) => {
  try {
    const marketAddress = new PublicKey(req.params.address);
    const marketState = await MarketState.retrieve(connection, marketAddress);
    const marketInfo = {
      markPrice: marketState.getMarkPrice(),
      indexPrice: (await getOraclePrice(connection, marketState.oracleAddress))
        .price,
      fundingLong: marketState.getFundingRatioLongShort().fundingRatioLongs,
      fundingShort: marketState.getFundingRatioLongShort().fundingRatioShorts,
    };
    return res.status(200).json(new ApiResponse(true, marketInfo));
  } catch (err) {
    console.warn(err);
    return res.status(500).json(new ApiResponse(false, err));
  }
});

export default router;
