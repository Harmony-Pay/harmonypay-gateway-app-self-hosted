import dayjs from "dayjs"
import axios from "axios"
import { getToken } from "next-auth/jwt"
import pool from '../../../../db'
import type { NextApiRequest, NextApiResponse } from "next"

const secret = process.env.SECRET
const network_mode = process.env.NETWORK_MODE || 'testnet'

async function countOrdersQuery() {

  const result = await pool.query(
    `SELECT COUNT(id) FROM api.orders WHERE status = $1`,
    [2]
  )

  if (!result || !result.rows || !result.rows.length) return 0;
    return result.rows[0].count;
}

async function getCoinsQuery() {

  const result = await pool.query(
    `SELECT * FROM api.coins WHERE active = $1`,
    [true]
  )

  if (!result || !result.rows || !result.rows.length) return null;
    return result.rows;
}


function currencyDataResponse(coin: any) {
  const currency_data = new Array();
  let currency_info = { 
    name: coin.name,
    address_length: coin.address_length,
    decimal_precision: coin.decimal_precision,
    group: coin.token_group,
    contract: coin.contract ? coin.contract : null,
    contract_testnet: coin.contract_testnet ? coin.contract_testnet : null,
    erc20: coin.erc20 ? coin.erc20 : null,
    hrc20: coin.hrc20 ? coin.hrc20 : null,
    supports: { 
      wp_plugin_open_in_wallet: coin.wp_plugin_open_in_wallet, 
      metamask_currency: coin.metamask_currency,
      metamask_abi: coin.metamask_abi ? JSON.stringify(coin.metamask_abi,null,0) : null,
      network_mode: network_mode
    }
  }
  currency_data[coin.symbol] = currency_info

  return currency_data[coin.symbol]
}

const execRatesQuery = async () => {

    let endpoint = 'https://api.coingecko.com/api/v3/simple/price'
  
    return await axios.get(endpoint, {
      params: {
        ids: 'harmony,bitcoin,ethereum,binancecoin,chainlink,viper,dai,uniswap,aave,axie-infinity,binance-usd,usd-coin,sushi,havven,matic-network,terra-luna,terrausd',
        vs_currencies: 'gbp,usd,aud,eur,cad,rub,brl',
        include_last_updated_at: true,
      }
    })
    .then((result) => { 
        return result.data
    })

}

const getCurrencyRatesQuery = async () => {

  let endpoint = 'https://currencies.harmonypay.one/latest'

  return await axios.get(endpoint, {
    params: {
      from: 'USD',
      to: 'GBP,CAD,AUD,EUR,RUB,BRL'
    }
  })
  .then((result) => { 
      return result.data.rates
  })

}


export default async (req: NextApiRequest, res: NextApiResponse): Promise<NextApiResponse> => {
  const token = await getToken({ req, secret })
  console.log("retrieve_account sent to https:\/\/api.harmonypay.one\/", token)
  console.log("/v1/account/retrieve req === ", req.body)
  const cryptocurrency_rates = await execRatesQuery()
  const currency_rates = await getCurrencyRatesQuery()
  const active_coins = await getCoinsQuery()

  const rates: any = {};
  //USD
  rates.USD = 1.00
  for (const [key, value] of Object.entries(currency_rates)) {
    rates[key] = value
  }

  const currency_data: any = {};
  active_coins.map((coin: any) => {
    currency_data[coin.symbol] = currencyDataResponse(coin)
  })

  // Build exchange_rates prices
  let _rates: any = {};
  _rates.ONE = 1/parseFloat(cryptocurrency_rates.harmony.usd)
  _rates.VIPER = 1/parseFloat(cryptocurrency_rates.viper.usd)
  _rates.ETH = 1/parseFloat(cryptocurrency_rates.ethereum.usd)
  _rates.AAVE = 1/parseFloat(cryptocurrency_rates.aave.usd)
  _rates.AXS = 1/parseFloat(cryptocurrency_rates['axie-infinity'].usd)
  _rates.BTC = 1/parseFloat(cryptocurrency_rates.bitcoin.usd)
  _rates.BNB = 1/parseFloat(cryptocurrency_rates.binancecoin.usd)
  _rates.BUSD = 1/parseFloat(cryptocurrency_rates['binance-usd'].usd)
  _rates.DAI = 1/parseFloat(cryptocurrency_rates.dai.usd)
  _rates.JEN = 1/parseFloat(cryptocurrency_rates.harmony.usd)
  _rates.LINK = 1/parseFloat(cryptocurrency_rates.chainlink.usd)
  _rates.LMA = 1/parseFloat(cryptocurrency_rates.harmony.usd)
  _rates.LUNA = 1/parseFloat(cryptocurrency_rates['terra-luna'].usd)
  _rates.MATIC = 1/parseFloat(cryptocurrency_rates['matic-network'].usd)
  _rates.SNX = 1/parseFloat(cryptocurrency_rates.havven.usd)
  _rates.SUSHI = 1/parseFloat(cryptocurrency_rates.sushi.usd)
  _rates.UNI = 1/parseFloat(cryptocurrency_rates.uniswap.usd)
  _rates.USDC = 1/parseFloat(cryptocurrency_rates['usd-coin'].usd)
  _rates.UST = 1/parseFloat(cryptocurrency_rates.terrausd.usd)
  _rates.VINCI = 1/parseFloat(cryptocurrency_rates.harmony.usd)
  _rates.WISE = 1/parseFloat(cryptocurrency_rates.harmony.usd)
  _rates.WONE = 1/parseFloat(cryptocurrency_rates.harmony.usd)
  _rates.FLR = 1/parseFloat(cryptocurrency_rates.harmony.usd)

  const payments_used = await countOrdersQuery()

  res.status(200).send({
    harmonypay: {
    result: true,
    token: JSON.stringify(token, null, 2),
    messages: [
        {
        type: "retrieve_account",
        account: {
            domain: "aHR0cDovL3dwbGFiLnRlc3Q=",
            plugin_version: 0.50,
            retrieve_key: "d5ce81fa934b9663a8e99b5c3a8aa6ea",
            domain_key: "47fd4b393f89697a989e961a0114319d",
            payments_used: payments_used,
            currency_data,
            /*currency_data: {
                BTC: {"name": "Bitcoin", "address_length": 34, "decimal_precision": 8, "group": "Main blockchains"},
                ETH: {"name": "Ethereum", "address_length": 42, "decimal_precision": 18, "group": "Main blockchains", "supports": { "wp_plugin_open_in_wallet": false, "metamask_currency": "ETH" }}, 
                ONE: {"name": "Harmony", "address_length": 42, "decimal_precision": 18, "group": "Main blockchains", "supports": { "wp_plugin_open_in_wallet": false, "metamask_currency": "ONE" }}, 
                FLR: {"name": "Flora", "address_length": 42, "decimal_precision": 18, "group": "HRC-20 Tokens"},
                BNB: {"name": "Binance Coin", "address_length": 42, "decimal_precision": 8, "group": "HRC-20 Tokens"},
                BUSD: {"name": "Binance USD", "address_length": 42, "decimal_precision": 18, "group": "HRC-20 Tokens", "contract": "0x2d47d492c0978143171CB577224be39aA1dff5ce", "supports": { "wp_plugin_open_in_wallet": false, "metamask_currency": "BUSD" }}
            },*/
            physical_exchange_rates: {
                rates,
                /*rates: {
                    USD: 1.00,
                    EUR: 1.63,
                    BRL: 5.23,
                },*/
                timestamp: dayjs().unix()
            },
            virtual_exchange_rates: { 
                rates: _rates,
                timestamp: dayjs().unix()
            },
            updated: dayjs().unix()
        },
        domain_key: "47fd4b393f89697a989e961a0114319d",
        license_valid: true
        }
    ]
  }})

  return res;
}
