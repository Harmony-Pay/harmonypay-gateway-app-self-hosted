const cron = require('node-cron')
const DB = require("./db")
const dotenv = require("dotenv")

dotenv.config();
const Binance = require('binance-api-node').default
const { CryptoApi, Currency } = require("node-crypto-com")

const network_mode = process.env.NETWORK_MODE || 'testnet'

const interval_check_settlement = process.env.SETTLEMENT_INTERVAL;
const min_settlement_cryptocom = process.env.SETTLEMENT_CRYPTOCOM_MIN;
const min_settlement_binance = process.env.SETTLEMENT_BINANCE_MIN;

async function getOpenSettlementsQuery(exchange_id, settle_pair, status) {

    const result = await DB.pool.query(
        `SELECT * FROM api.settlements WHERE settlement_type = $1 AND settlement_pair = $2 AND status = $3`, [exchange_id, settle_pair, status]
    )

    if (!result || !result.rows || !result.rows.length) return null;
    return result.rows;
}

async function getSettlementsPairsQuery(exchange_id, status) {

    const pairs_to_settle = await DB.pool.query(
        `SELECT DISTINCT(settlement_pair) FROM api.settlements WHERE settlement_type = $1 AND status = $2`, [exchange_id, status]
    )

    if (!pairs_to_settle || !pairs_to_settle.rows || !pairs_to_settle.rows.length) return null;
    return pairs_to_settle.rows;

}


async function updateOrderSettlement(order_id, order_info) {

    const order_to_settle = await DB.pool.query('UPDATE api.settlements SET status = $1, order_info = $2 WHERE order_id = $3', [2, order_info, order_id]);

    if (!order_to_settle || !order_to_settle.rows || !order_to_settle.rows.length) return null;
    console.log('📦 AutoSettlement complete for order#', order_to_settle.rows[0].order_id);
    return order_to_settle.rows;
}


async function getPairBinanceAvgPrice(binance, pair) {

    try {

        return await binance.avgPrice({ symbol: pair })

    } catch (e) {
        console.error('request failed: ', e);
    }

}


async function getPairCryptocomAvgPrice(cryptocom, pair) {

    try {
        const { data, status } = await cryptocom.api.public.getTicker({
            instrument_name: pair,
        });

        return data;

    } catch (e) {
        console.error('request failed: ', e);
    }

}

function isCurrency(balance) {
    return balance.asset === 'ONE';
}

async function getPairBinanceAcountSummary(binance) {

    try {
        const accountSummary = await binance.accountInfo();

        let balance = accountSummary.balances.find(isCurrency);

        return balance;

    } catch (e) {
        console.error('request failed: ', e);
    }

}


async function getPairCryptocomAcountSummary(cryptocom, currency) {

    try {
        const accountSummary = await cryptocom.api.private.getAccountSummary({
            currency: currency,
        });

        return accountSummary;

    } catch (e) {
        console.error('request failed: ', e);
    }

}




async function makeSettlementBinance(binance, pair, settlement_amount) {

    try {

        console.log(await binance.time())
        console.log(`getAvgPrice ${pair}: `, await binance.avgPrice({ symbol: pair }));
        //console.log('getAvgPrice BUSD: ', await binance.avgPrice({ symbol: 'ONEBUSD' }));
        const avgprice = await binance.avgPrice({ symbol: pair });

        console.log(avgprice.price, parseFloat(settlement_amount) * parseFloat(avgprice.price));

        if (network_mode === 'testnet') {
            const testOrder = await binance.orderTest({
                symbol: pair,
                side: 'SELL',
                type: 'MARKET',
                quantity: settlement_amount,
                //price: avgprice.price,
                /*
                timeInForce?: OrderTimeInForce;
                quoteOrderQty?: number;
                newClientOrderId?: string;
                stopPrice?: number;
                icebergQty?: number;
                newOrderRespType?: OrderResponseType;*/
            });

            console.log('TestOrder --- ', testOrder, {
                symbol: pair,
                side: 'SELL',
                type: 'MARKET',
                quantity: settlement_amount
            });

            return {
                symbol: pair,
                orderId: 00000,
                clientOrderId: '1XZTVBTGS4K1e',
                transactTime: Date.now(),
                price: avgprice.price,
                origQty: settlement_amount,
                executedQty: settlement_amount,
                status: 'NEW',
                type: 'MARKET',
                side: 'SELL'
            }

        } else {

            const settlementOrder = await binance.order({
                symbol: pair,
                side: 'SELL',
                type: 'MARKET',
                quantity: settlement_amount
            });

            console.log('Settlement Order --- ', settlementOrder, {
                symbol: pair,
                side: 'SELL',
                type: 'MARKET',
                quantity: settlement_amount
            });

            return settlementOrder;

        }


    } catch (e) {
        console.error('request failed: ', e);
    }

}


async function makeSettlementCryptocom(cryptocom, pair, settlement_amount) {

    if (network_mode === 'testnet') {
        //Create Order
        const { data: order, status: order_status } = await cryptocom.api.private.createOrder({
            instrument_name: pair,
            side: 'SELL',
            type: 'LIMIT',
            quantity: 3,
            price: 0.36396,
        });

        console.log('TestOrder --- ', order, {
            instrument_name: pair,
            side: 'SELL',
            type: 'LIMIT',
            quantity: 3,
            price: 0.36396,
        }, order_status);

        const { data: orders, status: orders_status } = await cryptocom.api.private.getOpenOrders({
            instrument_name: pair,
        });

        console.log(orders, orders_status);


        const { data: d, status: s } = await cryptocom.api.private.cancelOrder({
            instrument_name: pair,
            order_id: order.result.order_id,
        });

        console.log(order.result, d.code, s);

        return order.result;

    } else {

        //Create Order
        const { data: order, status: order_status } = await cryptocom.api.private.createOrder({
            instrument_name: pair,
            side: 'SELL',
            type: 'MARKET',
            quantity: settlement_amount
        });

        console.log('Settlement Order --- ', order, {
            instrument_name: pair,
            side: 'SELL',
            type: 'MARKET',
            quantity: settlement_amount,
        }, order_status);

        return order.result;

    }

}

async function checkBinanceSettlements() {

        //check binance settlements
        let pairs_binance = await getSettlementsPairsQuery('binance', 0);
        console.log('binance pair - ', pairs_binance);
        pairs_binance.map(async pair_settle => {
                let binance_settlements = await getOpenSettlementsQuery('binance', pair_settle.settlement_pair, 0);
                //console.log(binance_settlements);
                if (binance_settlements !== null 
                    && binance_settlements.length 
                    && binance_settlements[0].settlement_info
                    && binance_settlements[0].settlement_info.binance_api_key
                    && binance_settlements[0].settlement_info.binance_api_secret) {
      
                const binance = Binance({
                    apiKey: binance_settlements[0].settlement_info.binance_api_key, // Get this from your account on binance.com
                    apiSecret: binance_settlements[0].settlement_info.binance_api_secret, // Same for this
                });
    
                let total_settlement = binance_settlements.reduce((a, b) => a + (parseFloat(b['amount']) || 0), 0);
    
                //for (var key_settlement in total_settlement) {
                let settlement_order_id = binance_settlements[0].order_id
                let settlement_currency = binance_settlements[0].settlement_info.binance_settlement_currency;
                let avgPrice = await getPairBinanceAvgPrice(binance, pair_settle.settlement_pair);
                let usd_amount = total_settlement * parseFloat(avgPrice.price);
                let accountBinance = await getPairBinanceAcountSummary(binance);
                if (parseFloat(accountBinance.free) < parseFloat(total_settlement)) {
                    console.log(`[!BINANCE] Balance available (${accountBinance.free} ONE) BELLOW settlement requirements (${total_settlement} ONE)`);
                    return false;
                }
    
                if (usd_amount < parseFloat(min_settlement_binance)) {
                    console.log(`[!BINANCE] Settlement amount (${usd_amount} ${settlement_currency}) BELLOW settlement requirements ${min_settlement_binance}USD)`);
                    return false;
                }
    
    
                if (usd_amount < 11) {
                    console.log(`[!BINANCE] Settlement amount (${usd_amount} ${settlement_currency}) BELLOW settlement requirements $11USD(binance))`);
                    return false;
                }
    
    
                console.log(
                    avgPrice.price,
                    pair_settle.settlement_pair,
                    total_settlement,
                    usd_amount,
                    settlement_currency,
                    accountBinance.free,
                    'ONE'
                );
    
                let settlement_order = await makeSettlementBinance(binance, pair_settle.settlement_pair, Math.round(total_settlement));
                console.log(settlement_order);
    
                if (settlement_order) {
                    let order_settled = await updateOrderSettlement(settlement_order_id, settlement_order);
                    console.log(order_settled);
                    return true;
                }
    
                //end if settlements exists
                }
            })
            //}
    

}

async function checkCryptocomSettlements() {

        //check cryptocom settlements
        let pairs_cryptocom = await getSettlementsPairsQuery('cryptocom', 0);
        console.log('cryptocom pair - ', pairs_cryptocom);
        pairs_cryptocom.map(async pair_settle => {
            let cryptocom_settlements = await getOpenSettlementsQuery('cryptocom', pair_settle.settlement_pair, 0);
    
            if (cryptocom_settlements !== null
                && cryptocom_settlements.length 
                && cryptocom_settlements[0].settlement_info
                && cryptocom_settlements[0].settlement_info.cryptocom_api_key
                && cryptocom_settlements[0].settlement_info.cryptocom_api_secret) {
    
            const cryptocom = {
                api: new CryptoApi(cryptocom_settlements[0].settlement_info.cryptocom_api_key, cryptocom_settlements[0].settlement_info.cryptocom_api_secret),
                currency: Currency
            }
    
            //console.log(cryptocom_settlements);
            let total_settlement = cryptocom_settlements.reduce((a, b) => a + (parseFloat(b['amount']) || 0), 0);
    
            //hack ONE pair _
            let cryptocom_pair = `${pair_settle.settlement_pair}`.replace('ONE', 'ONE_')
                //for (var key_settlement in total_settlement) {
            let settlement_order_id = cryptocom_settlements[0].order_id
            let settlement_currency = cryptocom_settlements[0].settlement_info.cryptocom_settlement_currency;
            let avgPrice = await getPairCryptocomAvgPrice(cryptocom, cryptocom_pair);
            let usd_amount = total_settlement * parseFloat(avgPrice.result.data.k);
            let accountCryptocom = await getPairCryptocomAcountSummary(cryptocom, 'ONE');
            let accountBalance = accountCryptocom.data.result.accounts[0].available;
            if (parseFloat(accountBalance) < parseFloat(total_settlement)) {
                console.log(`[!CRYPTO.COM] Balance available (${accountBalance} ONE) BELLOW settlement requirements (${total_settlement} ONE)`);
                return false;
            }
    
            if (usd_amount < parseFloat(min_settlement_cryptocom)) {
                console.log(`[!CRYPTO.COM] Settlement amount (${usd_amount} ${settlement_currency}) BELLOW settlement requirements ${min_settlement_cryptocom}USD)`);
                return false;
            }
    
            if (usd_amount < 1) {
                console.log(`[!CRYPTO.COM] Settlement amount (${usd_amount} ${settlement_currency}) BELLOW settlement requirements $1USD)`);
                return false;
            }
    
            console.log(
                avgPrice.result.data.k,
                cryptocom_pair,
                pair_settle.settlement_pair,
                total_settlement,
                usd_amount,
                settlement_currency,
                accountBalance,
                'ONE'
            );
    
            let settlement_order = await makeSettlementCryptocom(cryptocom, cryptocom_pair, Math.round(total_settlement));
            console.log(settlement_order);
    
            if (settlement_order) {
                let order_settled = await updateOrderSettlement(settlement_order_id, settlement_order);
                console.log(order_settled);
                return true;
            }
    
            //end if settlements exists
            }
        });
}


cron.schedule(`*/${interval_check_settlement} * * * *`, async() => {
    console.log(`running a autosettlement task every six(${interval_check_settlement}) minutes`);
    // check for binance settlements
    let binance_settlements = await checkBinanceSettlements();
    // check for cryptocom settlements
    let cryptocom_settlements = await checkCryptocomSettlements();
});

console.info(`[${network_mode}] [Autosettlement Agent] Running every ${interval_check_settlement} minutes...`)