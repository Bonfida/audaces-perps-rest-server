import { getOpenPositions } from "@audaces/perps";
import { PublicKey } from "@solana/web3.js";
import { connection } from "./connection";
import { wallet } from "./wallet";

export const getPositionFromIndex = async (
  positionIndex: number,
  market: PublicKey
) => {
  const positions = await getOpenPositions(connection, wallet.publicKey);
  const position = positions.find(
    (p) => p.positionIndex === positionIndex && p.marketAddress.equals(market)
  );
  if (!position) {
    throw new Error("No position found");
  }
  return position;
};

export const getPositionsForUserAccount = async (userAccount: PublicKey) => {
  const openPositions = await getOpenPositions(connection, wallet.publicKey);
  const positions = openPositions.filter((p) =>
    p.userAccount.equals(userAccount)
  );
  return positions;
};
