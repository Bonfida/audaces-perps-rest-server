import { MARKETS } from "@audaces/perps";
import { PublicKey } from "@solana/web3.js";

const validSides = ["long", "short"];

export const findMarketFromName = (name: string) => {
  const market = MARKETS.find((m) => m.name === name);
  return market;
};

export const checkPayload = (payload: any) => {
  // Check side
  const side = payload.side;
  const isValidSide = !!payload.side && validSides.includes(payload.side);
  // Check size
  const size = !!payload.side && parseFloat(payload.size);
  const isValidSize = isFinite(size) && !isNaN(size) && size > 0;
  // Check leverage
  const leverage = !!payload.leverage && parseInt(payload.leverage);
  const isValidLeverage = leverage <= 15 && leverage >= 0;
  // Check market
  const market = findMarketFromName(payload.market);
  const isValidMarket = !!market;
  // Is valid payload
  const isValid =
    isValidLeverage && isValidSide && isValidSize && isValidMarket;
  if (!isValid) {
    return { isValid: false };
  }
  return {
    isValid: isValid,
    size: size,
    side: side,
    leverage: leverage,
    marketName: market?.name,
    marketAddress: new PublicKey(market?.address),
  };
};
