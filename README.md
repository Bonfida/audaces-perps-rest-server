# Audaces Perpetuals REST Server

## ⚠️ Warning

**THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.**

**Any content produced by the Bonfida Foundation, or developer resources that the Bonfida Foundation provides, are for educational and inspiration purposes only. Bonfida does not encourage, induce or sanction the deployment of any such applications in violation of applicable laws or regulations.**

## Introduction

This repository provides a REST interface to interact with the [Audaces protocol](https://github.com/AudacesFoundation/audaces-perps) on-chain program.

The environment file need to contain the following variables:

- `PRIVATE_KEY` the private key that will be used to trade. The private key is an array of integers.
- `CONNECTION` the URL of the RPC endpoint you will use to place trades (e.g https://solana-api.projectserum.com)

🚨 All the amounts passed are expected with decimals. For example, if you want to place an order for 1 USDC, the amount passed needs to be 1 \* `USDC Decimals` = 1 \* 1,000,000 = 1,000,000

It provides the following endpoints:

- Account:

  - **GET** `/account` returns the user account owned by the user
  - **POST** `/account/create/:marketAddress` creates a user account on the specified market
  - **POST** `/account/close/:userAccountAddress` closes the specified user account
  - **POST** `/account/deposit/:userAccount` deposit a certain `amount` of collateral (specified in the body of the request) on the specified userAccount
  - **POST** `/account/withdraw/:userAccount` withdraw a certain `amount` of collateral (specified in the body of the request) on the specified userAccount

- Markets:

  - **GET** `/markets` returns the list of available markets
  - **GET** `/markets/:address` returns market information for the specified market address

- Orders:

  - **GET** `/orders/details/:tx` returns the trade details for the specified transaction id
  - **POST** `/order/:userAccount` places a trade with the specified user account. The `size`, `leverage` and `side` are specified in the body of the request

- Positions

  - **GET** `/positions` returns all the current open position of the user
  - **POST** `/positions/add-collateral/:positionIndex/:marketAddress` add collateral (specified in the body of the request) to the specified position
  - **POST** `/positions/withdraw-collateral/:positionIndex/:marketAddress` withdraw collateral (specified in the body of the request) to the specified position
  - **POST** `/positions/increase/:positionIndex/:marketAddress` increase the size of the specified position
  - **POST** `/positions/decrease/:positionIndex/:marketAddress` decrease the size of the specified position

- Tradingview:
  - **POST** `/tradingview` can be used to execute orders based on [TradingView](https://www.tradingview.com/) alerts

It is recommended to have only 1 position per market (i.e 1 position per user account). In the case where you have one position per user account you can modify your position using the `/order/:userAccount`, however, if you have more than one, you will have to modify its size by using `/positions/increase/:positionIndex/:marketAddress` and `/positions/decrease/:positionIndex/:marketAddress`

## Reponse examples

### Account endpoints

- **GET** `/account`

Response

```
{
    "result": [
        {
            "owner": "ABwpdjw6XJZUodNMbVFUeKgGFCQLKas4eeqiyQPPQsuZ",
            "market": "475P8ZX3NrzyEMJSFHt9KCMjPpWBWGa6oNxkWcwww2BR",
            "active": true,
            "balance": 134426890,
            "lastFundingOffset": 8,
            "openPositions": [
                {
                    "lastFundingOffset": 8,
                    "instanceIndex": 0,
                    "side": 0,
                    "liquidationIndex": 39682.3453404475,
                    "collateral": 500000,
                    "slotNumber": 88790785,
                    "vCoinAmount": 132,
                    "vPcAmount": 5000000
                }
            ],
            "address": "BVrbMRpGpEaybELiobkmbU8Sc4V1zdfyF7Rcz7vsP2Gy"
        },
        {
            "owner": "ABwpdjw6XJZUodNMbVFUeKgGFCQLKas4eeqiyQPPQsuZ",
            "market": "3ds9ZtmQfHED17tXShfC1xEsZcfCvmT8huNG79wa4MHg",
            "active": false,
            "balance": 271609,
            "lastFundingOffset": 6,
            "openPositions": [],
            "address": "EN85DztKxHF47T6Jq2b9r3Fq9t4cwQmTrQjsZ8ZdxiQD"
        }
    ],
    "success": true
}
```

- **POST** `/account/create/475P8ZX3NrzyEMJSFHt9KCMjPpWBWGa6oNxkWcwww2BR`

Reponse

```
{
    "result": {
        "signature": "31rXH5bY62UyJ2ffBz3cLS6cFqCaqCoC7tWbwMmEQ8AJVpu3BnvkLpQpjfsytcRkkRrV5uWi9FdBiZL5GdpxBXC"
    },
    "success": true
}

```

- **POST** `/account/close/475P8ZX3NrzyEMJSFHt9KCMjPpWBWGa6oNxkWcwww2BR`

Reponse

```
{
    "result": {
        "signature": "31rXH5bY62UyJ2ffBz3cLS6cFqCaqCoC7tWbwMmEQ8AJVpu3BnvkLpQpjfsytcRkkRrV5uWi9FdBiZL5GdpxBXC"
    },
    "success": true
}

```

- **POST** `/account/deposit/475P8ZX3NrzyEMJSFHt9KCMjPpWBWGa6oNxkWcwww2BR`

Body

```
{
    amount: 1000
}
```

Reponse

```
{
    "result": {
        "signature": "31rXH5bY62UyJ2ffBz3cLS6cFqCaqCoC7tWbwMmEQ8AJVpu3BnvkLpQpjfsytcRkkRrV5uWi9FdBiZL5GdpxBXC"
    },
    "success": true
}

```

- **POST** `/account/withdraw/475P8ZX3NrzyEMJSFHt9KCMjPpWBWGa6oNxkWcwww2BR`

Body

```
{
    amount: 1000
}
```

Reponse

```
{
    "result": {
        "signature": "31rXH5bY62UyJ2ffBz3cLS6cFqCaqCoC7tWbwMmEQ8AJVpu3BnvkLpQpjfsytcRkkRrV5uWi9FdBiZL5GdpxBXC"
    },
    "success": true
}

```

### Markets endpoints

- **GET** `/markets`

Response

```
{
    "result": [
        {
            "address": "475P8ZX3NrzyEMJSFHt9KCMjPpWBWGa6oNxkWcwww2BR",
            "name": "BTC-PERP"
        },
        {
            "address": "3ds9ZtmQfHED17tXShfC1xEsZcfCvmT8huNG79wa4MHg",
            "name": "ETH-PERP"
        }
    ],
    "success": true
}
```

- **GET** `/markets/:address`

Response

```
{
    "result": {
        "markPrice": 37931.85641540074,
        "indexPrice": 37928.664000000004,
        "fundingLong": 0.00001291430392825053,
        "fundingShort": -0.0004772396059706807
    },
    "success": true
}
```

### Orders

- **GET** `/orders/details/31rXH5bY62UyJ2ffBz3cLS6cFqCaqCoC7tWbwMmEQ8AJVpu3BnvkLpQpjfsytcRkkRrV5uWi9FdBiZL5GdpxBXC`

Response

```
{
    "result": [
        {
            "instruction": {
                "instruction": {
                    "tag": 7,
                    "positionIndex": {
                        "0": 0,
                        "1": 0
                    },
                    "closingCollateral": "01b207",
                    "closingVCoin": "01d0",
                    "predictedEntryPrice": "00",
                    "maximumSlippageMargin": "ffffffffffffffff"
                },
                "slot": 88788516,
                "time": 1627384515,
                "log": [
                    "Program perpke6JybKfRDitCmnazpCrGN5JRApxxukhA9Js6E6 invoke [1]",
                    "Program log: Entrypoint",
                    "Program log: Beginning processing",
                    "Program log: Instruction unpacked",
                    "Program log: Instruction: Close Position",
                    "Program log: Close position in memory: Ok(())",
                    "Program log: Oracle value: 2243",
                    "Program log: Transaction info: v_coin_amount 464, v_pc_amount 1041849",
                    "Program log: Rebalancing!",
                    "Program log: Mark price for this transaction (FP32): 9643765910280, with size: 464 and side Long",
                    "Program log: Fees : Fees { total: 12084, refundable: 10000, fixed: 2084 }",
                    "Program log: Closing_collateral_ltd : 111111, new_leverage : 0",
                    "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]",
                    "Program log: Instruction: Transfer",
                    "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 3402 of 135478 compute units",
                    "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success",
                    "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]",
                    "Program log: Instruction: Transfer",
                    "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 3402 of 129117 compute units",
                    "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success",
                    "Program log: Payout : 152961",
                    "Program perpke6JybKfRDitCmnazpCrGN5JRApxxukhA9Js6E6 consumed 80525 of 200000 compute units",
                    "Program perpke6JybKfRDitCmnazpCrGN5JRApxxukhA9Js6E6 success"
                ],
                "feePayer": {
                    "_bn": "886fa1ebc10c95e882f1c78194a21ebd3a7ee712cfc90bfb5f7a9a56fd42258"
                },
                "tradeIndex": 0,
                "signature": "5kyAzU5TihdEEvz3qShat9427we7VMwCw78QM14aEg6YxmiW5doBqL9AoA9c9PgJUcZQioVWYgNYhWimDGWDQ5v4"
            },
            "markPrice": 2245.3642241377383,
            "orderSize": 0.000464,
            "side": 1
        }
    ],
    "success": true
}
```

- **POST** `/orders/BVrbMRpGpEaybELiobkmbU8Sc4V1zdfyF7Rcz7vsP2G4`

Body

```
{
"side": "short",
"leverage": 10,
"size": 5000000
}
```

Response

```
{
    "result": {
        "signature": "31rXH5bY62UyJ2ffBz3cLS6cFqCaqCoC7tWbwMmEQ8AJVpu3BnvkLpQpjfsytcRkkRrV5uWi9FdBiZL5GdpxBXC"
    },
    "success": true
}

```

### Positions

- **GET** `/positions`

Response

```
{
    "result": [
        {
            "side": "short",
            "size": 132,
            "pnl": -7005.046832897526,
            "leverage": 10,
            "liqPrice": 39682.3453404475,
            "entryPrice": 37878.78787878788,
            "userAccount": "BVrbMRpGpEaybELiobkmbU8Sc4V1zdfyF7Rcz7vsP2G4",
            "collateral": 500000,
            "marketAddress": "475P8ZX3NrzyEMJSFHt9KCMjPpWBWGa6oNxkWcwww2BR",
            "positionIndex": 0,
            "vCoinAmount": 132,
            "instanceIndex": 0
        }
    ],
    "success": true
}
```

- **POST** `/positions/add-collateral/0/475P8ZX3NrzyEMJSFHt9KCMjPpWBWGa6oNxkWcwww2BR`

Body

```
{
"amount": 1000000
}
```

Response

```
{
    "result": {
        "signature": "31rXH5bY62UyJ2ffBz3cLS6cFqCaqCoC7tWbwMmEQ8AJVpu3BnvkLpQpjfsytcRkkRrV5uWi9FdBiZL5GdpxBXC"
    },
    "success": true
}

```

- **POST** `/positions/withdraw-collateral/0/475P8ZX3NrzyEMJSFHt9KCMjPpWBWGa6oNxkWcwww2BR`

Body

```
{
"amount": 1000000
}
```

Response

```
{
    "result": {
        "signature": "31rXH5bY62UyJ2ffBz3cLS6cFqCaqCoC7tWbwMmEQ8AJVpu3BnvkLpQpjfsytcRkkRrV5uWi9FdBiZL5GdpxBXC"
    },
    "success": true
}

```

- **POST** `/positions/increase/0/475P8ZX3NrzyEMJSFHt9KCMjPpWBWGa6oNxkWcwww2BR`

Body

```
{
"size": 1000000
}
```

Response

```
{
    "result": {
        "signature": "31rXH5bY62UyJ2ffBz3cLS6cFqCaqCoC7tWbwMmEQ8AJVpu3BnvkLpQpjfsytcRkkRrV5uWi9FdBiZL5GdpxBXC"
    },
    "success": true
}

```

- **POST** `/positions/decrease/0/475P8ZX3NrzyEMJSFHt9KCMjPpWBWGa6oNxkWcwww2BR`

Body

```
{
"size": 1000000
}
```

Response

```
{
    "result": {
        "signature": "31rXH5bY62UyJ2ffBz3cLS6cFqCaqCoC7tWbwMmEQ8AJVpu3BnvkLpQpjfsytcRkkRrV5uWi9FdBiZL5GdpxBXC"
    },
    "success": true
}

```

### Tradingview

- **POST** `/tradingview`

🚨 For the ease of use this is the only endpoint to accept UI amounts i.e amounts wihthout decimals. It means that in order to place an order of size 1 USDC the amount passed in the body of the request needs to be 1.

In order to use this endpoint with Tradingview alerts:

- Deploy the REST server on a remote machine
- Create an alert on Tradingview using [webhooks](https://www.tradingview.com/support/solutions/43000529348-about-webhooks/):
  - The webhook URL is `http(s)://<server_ip_or_domain>/tradingview`
  - The format of the message alert can be found below in the `Body` example

Body

```
{
    "size": "5",
    "leverage": "10",
    "market": "BTC-PERP",
    "side": "long"
}
```

Response

```
{
    "result": {
        "signature": "31rXH5bY62UyJ2ffBz3cLS6cFqCaqCoC7tWbwMmEQ8AJVpu3BnvkLpQpjfsytcRkkRrV5uWi9FdBiZL5GdpxBXC"
    },
    "success": true
}

```

## Errors

When the transaction fails the server will return the log of the transaction 👇

```
{
    "result": {
        "logs": [
            "Program perpke6JybKfRDitCmnazpCrGN5JRApxxukhA9Js6E6 invoke [1]",
            "Program log: Entrypoint",
            "Program log: Beginning processing",
            "Program log: Instruction unpacked",
            "Program log: Instruction: Close Position",
            "Program log: Close position in memory: Ok(())",
            "Program log: Oracle value: 38069",
            "Program log: Transaction info: v_coin_amount 0, v_pc_amount 0",
            "Program log: Mark price for this transaction (FP32): 0, with size: 0 and side Short",
            "Program log: VCoin Amount 232",
            "Program log: Liquidation index for this position: 155632962424846",
            "Program log: Position margin is too low",
            "Program log: Error: The given margin is too small!",
            "Program perpke6JybKfRDitCmnazpCrGN5JRApxxukhA9Js6E6 consumed 63611 of 200000 compute units",
            "Program perpke6JybKfRDitCmnazpCrGN5JRApxxukhA9Js6E6 failed: custom program error: 0x6"
        ]
    },
    "success": false
}
```

## Starting the server

Start by installing the packages

```
yarn
```

For development purposes you can launch the server with

```
yarn dev
```

For non development purposes

```
yarn start
```
