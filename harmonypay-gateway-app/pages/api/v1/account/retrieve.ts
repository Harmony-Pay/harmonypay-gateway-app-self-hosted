import dayjs from "dayjs"
import axios from "axios"
import { request, gql } from "graphql-request"
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

const endpoint_exchange = 'https://graph.viper.exchange/subgraphs/name/venomprotocol/venomswap-v2'

async function execQuotePricesQuery(hrcprice: any) {
  
    const query = gql`
    {
      UST: token(id: "0x224e64ec1bdce3870a6a6c777edd450454068fec") {
        id
        symbol
        name
        decimals
        pairBase(where: {id: "0x6574026db45ba8d49529145080489c3da71a82df"}) {
          id
          token0 {
            id
            symbol
            name
          }
          token1 {
            id
            symbol
            name
          }
          token0Price
          token1Price
        }
      }
      LMA: token(id: "0x7d0546dbb1dca8108d99aa389a8e9ce0c40b2370") {
        id
        symbol
        name
        decimals
        pairBase(where: {id: "0x014b3c9acb7bb50847890541447e027fb5d9aeae"}) {
          id
          token0 {
            id
            symbol
            name
          }
          token1 {
            id
            symbol
            name
          }
          token0Price
          token1Price
        }
      }
      LOOT: token(id: "0xbda99c8695986b45a0dd3979cc6f3974d9753d30") {
        id
        symbol
        name
        decimals
        pairBase(where: {id: "0x6c1df9d439f83c175a4a230ac93bb7b828b6d3cc"}) {
          id
          token0 {
            id
            symbol
            name
          }
          token1 {
            id
            symbol
            name
          }
          token0Price
          token1Price
        }
      }
      MOONI: token(id: "0x8d4f19bec883ba20f4f295706c53f760cd0bc2b0") {
        id
        symbol
        name
        decimals
        pairBase(where: {id: "0x8fafb20266e8579d4e8952978a9cd0e4c65bd198"}) {
          id
          token0 {
            id
            symbol
            name
          }
          token1 {
            id
            symbol
            name
          }
          token0Price
          token1Price
        }
      }
      VINCI: token(id: "0xb8e0497018c991e86311b64efd9d57b06aedbbae") {
        id
        symbol
        name
        decimals
        pairBase(where: {id: "0xca3680580e01bd12cc86818fff62eda2d255677c"}) {
          id
          token0 {
            id
            symbol
            name
          }
          token1 {
            id
            symbol
            name
          }
          token0Price
          token1Price
        }
      }
    }    
    `
    
    return request(endpoint_exchange, query).then( async (data: any) => { 

        const { UST, LMA, LOOT, MOONI, VINCI } = data;
        return { 
          UST: parseFloat(UST.pairBase[0].token1Price)/hrcprice, 
          LMA: parseFloat(LMA.pairBase[0].token1Price)/hrcprice, 
          LOOT: parseFloat(LOOT.pairBase[0].token1Price)/hrcprice, 
          MOONI: parseFloat(MOONI.pairBase[0].token1Price)/hrcprice,
          VINCI: parseFloat(VINCI.pairBase[0].token1Price)/hrcprice
        };
    });

}

export default async (req: NextApiRequest, res: NextApiResponse): Promise<NextApiResponse> => {
  const token = await getToken({ req, secret })
  console.log("retrieve_account sent to https:\/\/api.harmonypay.one\/", token)
  console.log("/v1/account/retrieve req === ", req.body)
  const cryptocurrency_rates = await execRatesQuery()
  const currency_rates = await getCurrencyRatesQuery()
  const active_coins = await getCoinsQuery()
  const quotes_hrc20 = await execQuotePricesQuery(1/parseFloat(cryptocurrency_rates.harmony.usd))
  console.log(quotes_hrc20);
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
  _rates.LMA = quotes_hrc20.LMA  //1/parseFloat(cryptocurrency_rates.harmony.usd)
  _rates.LUNA = 1/parseFloat(cryptocurrency_rates['terra-luna'].usd)
  _rates.MATIC = 1/parseFloat(cryptocurrency_rates['matic-network'].usd)
  _rates.SNX = 1/parseFloat(cryptocurrency_rates.havven.usd)
  _rates.SUSHI = 1/parseFloat(cryptocurrency_rates.sushi.usd)
  _rates.UNI = 1/parseFloat(cryptocurrency_rates.uniswap.usd)
  _rates.USDC = 1/parseFloat(cryptocurrency_rates['usd-coin'].usd)
  _rates.UST = 1/parseFloat(cryptocurrency_rates.terrausd.usd)
  _rates.VINCI = quotes_hrc20.VINCI //1/parseFloat('0.10'/*cryptocurrency_rates.harmony.usd*/)
  _rates.UST = quotes_hrc20.UST  //1/parseFloat(cryptocurrency_rates.harmony.usd)
  _rates.LOOT = quotes_hrc20.LOOT  //1/parseFloat(cryptocurrency_rates.harmony.usd)
  _rates.MOONI = quotes_hrc20.MOONI  //1/parseFloat(cryptocurrency_rates.harmony.usd)
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
            plugin_version: 0.57,
            retrieve_key: "d5ce81fa934b9663a8e99b5c3a8aa6ea",
            domain_key: "47fd4b393f89697a989e961a0114319d",
            payments_used: payments_used,
            currency_data,
            physical_exchange_rates: {
                rates,
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
