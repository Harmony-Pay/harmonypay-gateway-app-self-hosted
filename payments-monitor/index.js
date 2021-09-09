const DB = require("./db");
const dotenv = require("dotenv");
const axios = require("axios");
const fs = require('fs');
const path = require('path');
//const { formatsByName, formatsByCoinType } = require("@ensdomains/address-encoder");
const { Harmony } = require('@harmony-js/core');
const { ChainType, ChainID, Units, Unit, numberToString, add0xToString, fromWei, toWei, numToStr, isBech32TestNetAddress, isBech32Address } = require('@harmony-js/utils');
const { fromBech32, toBech32, BN } = require('@harmony-js/crypto');
dotenv.config();
const network_mode = process.env.NETWORK_MODE || 'testnet'
const http_api_url = network_mode === 'testnet' ? 'https://api.s0.b.hmny.io' : 'https://api.harmony.one';
const ws_api_url = network_mode === 'testnet' ? 'wss://ws.s0.b.hmny.io' : 'wss://ws.s0.t.hmny.io';

const Web3 = require("web3");
const web3 = new Web3(ws_api_url);

let transactionsCount = 0;
let block = undefined;

const harmony = new Harmony(
    // let's assume we deploy smart contract to this end-point URL
    http_api_url, {
        chainType: ChainType.Harmony,
        chainId: network_mode === 'testnet' ? ChainID.HmyTestnet : ChainID.HmyMainnet,
    }
)

// get a contract instance
const getContractInstance = (harmony, artifact) => {
    return harmony.contracts.createContract(artifact.abi, address);
}


const convertOneToEthAddress = async(address) => {
    if (!address) return false;

    if (isBech32Address(address) || isBech32TestNetAddress(address)) {
        const data = fromBech32(address);
        //console.log(data.toString('hex'));
        //console.log('fromBech32 ADDRESS === ', address, data.toLowerCase());
        return data;

    } else {
       // const ethaddress = toBech32(address.toLowerCase());
        //const data = fromBech32(ethaddress);
        const data = address.toLowerCase();
        //console.log(data.toString('hex'));
        //console.log('toBech32 ADDRESS === ', address, data);
        return data;
    }
}

const getOrdersPending = async() => {

    DB.pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack)
        }

        DB.pool.query('SELECT * FROM api.orders WHERE status <= 0', [], (err, result) => {

            if (err) {
                return console.error('Error executing query', err.stack)
            }

            if (result.rows) {
                result.rows.map(row => {
                    console.log(row);
                })

                return result.rows;

            }

        })

    })

}


async function updateOrderStatus(order_id) {
    // Optionally the request above could also be done as
    let API_SERVER = process.env.API_SERVER;
    return await axios.post(`${API_SERVER}/payment/update/${order_id}`.toLowerCase(), {})
        .then(function(response) {
            //console.log('response ----- ', response.data);
            return response.data;
        })
        .catch(function(error) {
            console.log(error);
            return false;
        })
        .then(function() {
            // always executed
            return false;
        });
}

const amountToWei = (amount) => {
    // toWei
    const one = new BN(amount);
    const expected = toWei(one, Units.one);
    const num = numToStr(expected);
    //console.log('amountToWei ==> ', num);
    return num;
}

const amountFromWei = (amount) => {
    //console.log('AMOUNT FROM WEI ==> ', amount);
    // fromWei
    const Wei = new BN(amount);
    const expected = fromWei(Wei, Units.one);
    const num = numToStr(expected);
    //console.log('amountFromWei ==> ', num);
    return num;
}

async function decodeInput(contract, decimals, symbol, hexData) {
    try {
        let decodeParameters = (inputs, data) => {
            if (0 == inputs.length) return [];
            let params = contract.abiCoder.decodeParameters(inputs, data);
            params.length = inputs.length;
            return Array.from(params);
        };

        const no0x = hexData.startsWith("0x") ? hexData.slice(2) : hexData;
        const sig = no0x.slice(0, 8).toLowerCase();
        const method = contract.abiModel.getMethod("0x" + sig);
        if (!method) return false;

        const params = decodeParameters(method.inputs, "0x" + no0x.slice(8));
        console.log('params ===> ', params, (isBech32Address(params[0]) || isBech32TestNetAddress(params[0])) ? params[0] : toBech32(params[0]));

        //const decimals = //await contract.methods.decimals().call();
        //const symbol = //await contract.methods.symbol().call();
        console.log('params ===> ', decimals, symbol);

        return {
            to: (isBech32Address(params[0]) || isBech32TestNetAddress(params[0])) ? params[0] : toBech32(params[0]),
            amount: amountFromWei(params[1]),
            symbol,
        };

    } catch (err) {
        return false;
    }
}


async function getCurrencyQuery(currency_id) {

    const result = await DB.pool.query(
        `SELECT * FROM api.coins WHERE symbol = $1`, [currency_id]
    )

    if (!result || !result.rows || !result.rows.length) return null;
    return result.rows[0];
}



async function getWalletQuery(currency_id) {

    const result = await DB.pool.query(
        `SELECT * FROM api.wallets WHERE currency_id = $1`, [currency_id]
    )

    if (!result || !result.rows || !result.rows.length) return null;
    return result.rows[0];
}

async function isAlreadyDonated(transaction_hash) {

    /*const result = await DB.pool.query(
        `SELECT id FROM api.donations WHERE transaction_id = $1`, [transaction_hash]
    )

    if (!result || !result.rows || !result.rows.length) return null;
    return result.rows[0];*/
    let API_SERVER = process.env.API_SERVER;
    return await axios.get(`${API_SERVER}/admin/donation/${transaction_hash}`, {})
        .then(function(response) {
            console.log('isAlreadyDonated Response ----- ', response.data);
            return response.data.data;
        })
        .catch(function(error) {
            console.log(error);
            return false;
        })
}


async function isTransactionCaptured(transaction_hash) {

    const result = await DB.pool.query(
        `SELECT id FROM api.transactions WHERE hash = $1`, [transaction_hash]
    )

    if (!result || !result.rows || !result.rows.length) return null;
    return result.rows[0];
}


async function insertDonationInfoQuery(donation_info) {

    const result = await DB.pool.query(
        `INSERT INTO api.donations (
        transaction_id,amount,confirmations,currency_id,autosettlements,microtime,from_address,to_address,domain,domain_key,status) 
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING transaction_id`, donation_info
    )

    if (!result || !result.rows || !result.rows.length) return null;
    return result.rows[0];
}


async function insertTransactionQuery(order_id, transaction_info) {

    console.info(transaction_info);

    let _transaction_info = new Array();
    _transaction_info[0] = order_id;
    _transaction_info[1] = transaction_info.blockHash;
    _transaction_info[2] = transaction_info.blockNumber;
    _transaction_info[3] = transaction_info.from;
    _transaction_info[4] = transaction_info.gas;
    _transaction_info[5] = transaction_info.gasPrice;
    _transaction_info[6] = transaction_info.hash;
    _transaction_info[7] = transaction_info.input;
    _transaction_info[8] = transaction_info.nonce;
    _transaction_info[9] = transaction_info.r;
    _transaction_info[10] = transaction_info.timestamp;
    _transaction_info[11] = transaction_info.s;
    _transaction_info[12] = transaction_info.to;
    _transaction_info[13] = transaction_info.transactionIndex;
    _transaction_info[14] = transaction_info.v;
    _transaction_info[15] = transaction_info.value;

    console.log(_transaction_info)

    const new_transaction = await DB.pool.query(`INSERT INTO api.transactions (
        order_id, block_hash, block_number, from_address, gas, gas_price, hash, input, nonce, r, "timestamp", s, to_address, transaction_index, v, value) 
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING hash`, _transaction_info, (err, result) => {
        //client.release()
        if (err) {
            return console.error('Error executing query', err.stack)
        }

        if (!result || !result.rows || !result.rows.length) return null;
        return result.rows[0];
    });

    return new_transaction;
}




async function insertSettlementQuery(order_id, order_info, transaction_id) {

    console.info(order_info, transaction_id);
    let settlement = order_info.autosettlements ? order_info.autosettlements[0] : false;

    console.info(settlement, order_info, transaction_id);
    if (!settlement)
        return false;

    if (settlement.type === 'binance' && settlement.binance_api_key === null)
        return false;

    if (settlement.type === 'cryptocom' && settlement.cryptocom_api_key === null)
        return false;

    let settlement_pair;
    if (settlement.type === 'binance')
        settlement_pair = `${order_info.currency_id}${settlement.binance_settlement_currency}`

    if (settlement.type === 'cryptocom')
        settlement_pair = `${order_info.currency_id}${settlement.cryptocom_settlement_currency}`

    let _settlement_info = new Array();
    _settlement_info[0] = order_id;
    _settlement_info[1] = settlement.type;
    _settlement_info[2] = JSON.stringify(order_info.autosettlements[0], null, 2);
    _settlement_info[3] = settlement_pair;
    _settlement_info[4] = 0;
    _settlement_info[5] = transaction_id;
    _settlement_info[6] = order_info.amount;
    _settlement_info[7] = order_info.currency_id;
    _settlement_info[8] = order_info.to_address;
    _settlement_info[9] = 0;

    console.log(_settlement_info)

    const new_transaction = await DB.pool.query(`INSERT INTO api.settlements (
    order_id, settlement_type, settlement_info, settlement_pair, settlement_amount, transaction_id, amount, currency_id, to_address, status) 
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING order_id`, _settlement_info, (err, result) => {
        //client.release()
        if (err) {
            return console.error('Error executing query', err.stack)
        }

        if (!result || !result.rows || !result.rows.length) return null;
        return result.rows[0];
    });

    return new_transaction;
}


const getDonationDetails = async(transaction) => {
    
    let currency_wallet = await getWalletQuery('ONE');

    convertOneToEthAddress(currency_wallet.address).then(async wallet_address => {

            //console.log(`getDonationDetails ==> ${wallet_address}`.toLowerCase(), `${transaction.to}`.toLowerCase());
            if (`${wallet_address}`.toLowerCase() === `${transaction.to}`.toLowerCase()) {

                await insertTransactionQuery(0, transaction);
                console.log('📦 Transaction inserted for a Donation #');
                //transaction_id,amount,confirmations,currency_id,autosettlements,microtime,from_address,to_address,domain,domain_key,status
                let _donation_info = new Array();
                _donation_info[0] = transaction.hash;
                _donation_info[1] = amountFromWei(transaction.value);
                _donation_info[2] = 1;
                _donation_info[3] = currency_wallet.currency_id;
                _donation_info[4] = [];
                _donation_info[5] = 0;
                _donation_info[6] = transaction.from;
                _donation_info[7] = transaction.to;
                _donation_info[8] = '';
                _donation_info[9] = '';
                _donation_info[10] = 2;

                let receivedDonation = await insertDonationInfoQuery(_donation_info);
                return receivedDonation;

            }

        })
        //}

    return false;
}

const checkBlockTransactions = async(block_transactions) => {
    let transaction_hashes = [];
    for (let i = 0; i < block_transactions.length; i++) {
        transaction_hashes.push(block_transactions[i]);
    }
    
    let transactions = [];
    for (let i = 0; i < transaction_hashes.length; i++) {
        let transaction = await web3.eth.getTransaction(transaction_hashes[i])
        transactions.push(transaction);
    }
    return transactions;
}


const getTransactionDetails = async(lastBlockNumber) => {
    //const lastBlockNumber = await web3.eth.getBlockNumber();

    console.log(`[${network_mode}] Last block number: ${lastBlockNumber}`);

    block = await web3.eth.getBlock(lastBlockNumber);

    console.log(`[${network_mode}] Last block hash: ${block.hash}`);
    //console.log(`[${network_mode}] Last block transactions: ${block.transactions}`);

    // find last transaction
    ///console.log('Search last transaction...');
    // let blockNumber = lastBlockNumber;
    transactionsCount = await web3.eth.getBlockTransactionCount(lastBlockNumber);
    //block = await web3.eth.getBlock(blockNumber);

    if (!transactionsCount) {
        //blockNumber--;
        console.log(`🛡️  Block ${lastBlockNumber}, Transactions: `, transactionsCount);
        return false;

    } else {
        block = await web3.eth.getBlock(lastBlockNumber)
        const lastTransaction = await block.transactions[block.transactions.length - 1];
        const blockTransactions = await block.transactions;
        console.log(`🪙  Block ${lastBlockNumber}, Transactions: `, transactionsCount);
        console.log('Last transaction hash: ', lastTransaction)
        //let transaction = await web3.eth.getTransaction(lastTransaction);
        let transactions = await checkBlockTransactions(blockTransactions);

        DB.pool.connect(async(err, client, release) => {
            if (err) {
                return console.error('Error acquiring client', err.stack)
            }

            // promise
            client
            .query(`SELECT payment_id, currency_id ,amount, timeout_hours, microtime, to_address, confirmations, autosettlements, domain, status FROM api.orders WHERE status = $1`, [0])
            .then( result => {
                if (result && result.rows && result.rows.length) {

                    result.rows.map(async row => {
                        return await convertOneToEthAddress(row.to_address).then(async pay_address => {
                                 const currency = await getCurrencyQuery(row.currency_id);
 
                                 transactions.map(async (transaction, idx) => {
                                 //console.log('✨ Last Ethereum Address: ', `${pay_address}`.toLowerCase(), `${transaction.to}`.toLowerCase(), row.payment_id);
                                 if (`${transaction.to}`.toLowerCase() === `${pay_address}`.toLowerCase() 
                                 || `${transaction.to}`.toLowerCase() === `${network_mode === 'testnet' ? currency && currency.contract_testnet ? currency.contract_testnet : '' : currency && currency.contract ? currency.contract : ''}`.toLowerCase()) {
 
                                     let params = {
                                         amount: 0
                                     }
 
                                     if ( (currency !== undefined || currency !== null) && (network_mode === 'testnet' ? currency.contract_testnet : currency.contract) !== null) {
 
                                         if (`${transaction.to}`.toLowerCase() === `${network_mode === 'testnet' ? currency.contract_testnet : currency.contract}`.toLowerCase()) {
 
                                             const instance = await harmony.contracts.createContract(currency.metamask_abi, row.to_address); //to address of transaction
                                             params = await decodeInput(
                                                 instance,
                                                 currency.decimal_precision,
                                                 currency.symbol,
                                                 transaction.input //txn.input is data of transaction
                                             );
 
                                             console.log('transaction.input ===> ', params);
                                             //amountToWei(`${row.amount}`);
                                             //amountFromWei(`${transaction.value}`);
 
                                             console.log('Number ==> ', Number(`${row.amount}`).toFixed(2), Number(`${params.amount}`).toFixed(2), Number(amountFromWei(`${transaction.value}`)).toFixed(2), Number(amountFromWei(amountToWei(`${row.amount}`))).toFixed(2), Number(amountFromWei(amountToWei(`${params.amount}`))).toFixed(2));
                                         }
 
                                     } else {
 
                                         params = {
                                             amount: 0
                                         }
 
                                     }
 
                                     if (Number(amountFromWei(`${transaction.value}`)).toFixed(2) === Number(`${row.amount}`).toFixed(2) ||
                                         Number(`${row.amount}`).toFixed(2) === Number(`${params.amount}`).toFixed(2) ||
                                         Number(amountFromWei(amountToWei(`${params.amount}`))).toFixed(2) === Number(`${row.amount}`).toFixed(2) ||
                                         Number(amountFromWei(amountToWei(`${params.amount}`))).toFixed(2) === Number(amountFromWei(amountToWei(`${row.amount}`))).toFixed(2)
                                     ) {
 
                                         client.query('UPDATE api.orders SET status = $1 WHERE payment_id = $2', [2, row.payment_id], async(err, result) => {
 
                                             if (err) {
                                                 return console.error('Error executing update', err.stack)
                                             }
 
                                             if (result.rows) {
                                                 await updateOrderStatus(row.payment_id);
                                                 console.log('📦 Order Updated ', result.rows);
                                                 await insertTransactionQuery(row.payment_id, transaction);
                                                 console.log('📦 Transaction Inserted for order#', row.payment_id);
                                                 await insertSettlementQuery(row.payment_id, row, transaction.hash);
                                                 console.log('📦 AutoSettlement scheduled for order#', row.payment_id);
                                                 transactions.splice(idx, 1);
                                             }
 
                                             //client.release()
 
                                         });
                            
                                     }
 
                                 }
                                 //end if found a transaction
                                 })

                             })
 
                             //
                     });

                     
                } else {

                    transactions.map(async transaction => {
                        let isDonation = await getDonationDetails(transaction);
                        return isDonation;
                    })
                }
                
                return transactions;
            })
            .then( async transactions => {
                //console.log('Results: ', transactions);
                transactions.map(async transaction => {
                    let isDonation = await getDonationDetails(transaction);
                    return isDonation;
                })
                client.release();
                return transactions;
            })
            .then(more_transactions => {
                //console.log('More transactions ===> ', more_transactions)

                /*if (paid_orders !== undefined){
                    paid_orders.map(async transaction => {
                        let isDonation = await getDonationDetails(transaction);
                        return isDonation;
                    })
                } else {
                    transactions.map(async transaction => {
                        let isDonation = await getDonationDetails(transaction);
                        return isDonation;
                    })
                }*/

                /*transactions.map(async transaction => {
                    let isDonation = await getDonationDetails(transaction);
                    return isDonation;
                })*/
                
                return more_transactions;
            })
            .catch(e => console.error(e.stack))

            /*client.query('SELECT payment_id, currency_id ,amount, timeout_hours, microtime, to_address, confirmations, autosettlements, domain FROM api.orders WHERE status = 0', [], 
            async (err, result) => {

                if (err) {
                    return console.error('Error executing query', err.stack)
                }

                if (result && result.rows && result.rows.length) {

                    result.rows.map(async row => {
                       return await convertOneToEthAddress(row.to_address).then(async pay_address => {
                                const currency = await getCurrencyQuery(row.currency_id);

                                transactions.map(async transaction => {
                                console.log('✨ Last Ethereum Address: ', `${pay_address}`.toLowerCase(), `${transaction.to}`.toLowerCase(), row.payment_id);
                                if (`${transaction.to}`.toLowerCase() === `${pay_address}`.toLowerCase() || `${transaction.to}`.toLowerCase() === `${currency && currency.contract ? currency.contract : ''}`.toLowerCase()) {

                                    let params = {
                                        amount: 0
                                    }

                                    if ( (currency !== undefined || currency !== null) && currency?.contract !== null) {

                                        if (`${transaction.to}`.toLowerCase() === `${currency?.contract}`.toLowerCase()) {

                                            const instance = await harmony.contracts.createContract(currency.metamask_abi, row.to_address); //to address of transaction
                                            params = await decodeInput(
                                                instance,
                                                currency.decimal_precision,
                                                currency.symbol,
                                                transaction.input //txn.input is data of transaction
                                            );

                                            console.log('transaction.input ===> ', params);
                                            //amountToWei(`${row.amount}`);
                                            //amountFromWei(`${transaction.value}`);

                                            console.log('Number ==> ', Number(amountFromWei(`${transaction.value}`)).toFixed(2), Number(amountFromWei(amountToWei(`${row.amount}`))).toFixed(2), Number(amountFromWei(amountToWei(`${params.amount}`))).toFixed(2));
                                        }

                                    } else {

                                        params = {
                                            amount: 0
                                        }

                                    }

                                    if (Number(amountFromWei(`${transaction.value}`)).toFixed(2) === Number(`${row.amount}`).toFixed(2) ||
                                        Number(amountFromWei(amountToWei(`${params.amount}`))).toFixed(2) === Number(`${row.amount}`).toFixed(2) ||
                                        Number(amountFromWei(amountToWei(`${params.amount}`))).toFixed(2) === Number(amountFromWei(amountToWei(`${row.amount}`))).toFixed(2)
                                    ) {

                                        client.query('UPDATE api.orders SET status = $1 WHERE payment_id = $2', [2, row.payment_id], async(err, result) => {

                                            if (err) {
                                                return console.error('Error executing update', err.stack)
                                            }

                                            if (result.rows) {
                                                await updateOrderStatus(row.payment_id);
                                                console.log('📦 Order Updated ', result.rows);
                                                await insertTransactionQuery(row.payment_id, transaction);
                                                console.log('📦 Transaction Inserted for order#', row.payment_id);
                                                await insertSettlementQuery(row.payment_id, row, transaction.hash);
                                                console.log('📦 AutoSettlement scheduled for order#', row.payment_id);
                                            }

                                            //client.release()

                                        });
                           
                                    }

                                }
                                //end if found a transaction
                                }) 

                            })

                            //
                    })

                    return result.rows

                } else {

                    transactions.map(async transaction => {
                        let isDonation = await getDonationDetails(transaction);
                        return isDonation;
                    })
                }

            })*/

            
        })


        //console.log('🏧 Last transaction: ', JSON.stringify(transaction))
    }

};





const savePid = async(settings, pidfile) => {

    fs.writeFile(path.join(__dirname, pidfile), settings, (err) => {
        if (err) {
            return console.error(err);
        }
        console.info(".pid file created!");
    });

}

let subscription = web3.eth
    .subscribe("newBlockHeaders", async function(error, result) {
        if (!error) {
            //console.log(result);
            getTransactionDetails(result.number);

            return;
        }

        if (error) {
            savePid(Date.now().toString(), '../.web3pid');
            console.error(error);
        }
    })
    .on("connected", function(subscriptionId) {
        console.log(subscriptionId);
    })
    .on("data", function(blockHeader) {
        console.log(blockHeader);
    })
    .on("error", function(error) {
        console.error(error)
        savePid(Date.now(), '../.web3pid');
    });

// unsubscribes the subscription
subscription.unsubscribe(function(error, success) {
    if (success) {
        console.log("Successfully unsubscribed!");
    }
});