export const ErrorMessages = {
  orders: {
    side: "Invalid side. Can only be buy or sell",
    severalPositions:
      "This endpoint cannot be used if you have more than 1 position on the user account. Use /positions instead",
    invalidSize: "Invalid size",
    invalidLeverage: "Invalid leverage",
  },
  account: {
    invalidAmount: "Invalid deposit amount",
  },
};
