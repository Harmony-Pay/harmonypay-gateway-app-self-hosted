const web3utils = require('web3').utils;
import axios from "axios";

export async function getNetworkMode() {
    return await axios.get(`/api/v1/admin/settings/env`)
    .then((response: any) => {
        console.log('ok', response.data.data.networkMode);
        return response.data.data.networkMode
    })
    .catch((error: Error) => {
        console.log('error', error)
        return false
    });

}


export function covertFromWei(value: string) {
    return web3utils.fromWei(value, 'ether')
}

export function getHarmonyExplorer(network_mode: string, kind: string, hash: string): string {

    if (kind === 'address') {
    
        if (network_mode === 'mainnet')
            return `https://explorer.harmony.one/address/${hash}`
        else
            return `https://explorer.testnet.harmony.one/address/${hash}`

    }

    if (kind === 'tx') {
    
        if (network_mode === 'mainnet')
            return `https://explorer.harmony.one/tx/${hash}`
        else
            return `https://explorer.testnet.harmony.one/tx/${hash}`

    }

    return '';
}

export async function resetEnviroment(api_server_url: string) {

    if (!api_server_url) {
        throw new Error('api server url is not defined')
    }

    let envdata: any = {
        NodeEnv: 'production',
        LogLevel: 'debug',
        networkMode: 'testnet',
        apiServer: `${api_server_url}/api/v1`,
        nextauthUrl: `${api_server_url}`,
        nextauthUsername: 'harmonypay',
        nextauthPassword: 'harmonypay',
        secret: 'secret here',
        wpSiteUrl: '',
        woocommerceWebhookUrl: '',
        woocommerceSignatureSecret: '',
        dbHost: 'localhost',
        dbPort: '5432',
        dbName: 'harmonypaydb',
        dbUsername: 'postgres',
        dbPassword: 'harmonypay',
        settlementInterval: '6',
        settlementBinanceMin: '11',
        settlementCryptocomMin: '3',
        appleId: '',
        appleTeamId: '',
        applePrivateKey: '',
        appleKeyId: '',
        auth0Id: '',
        auth0Secret: '',
        auth0Domain: '',
        facebookId: '',
        facebookSecret: '',
        githubId: '',
        githubSecret: '',
        googleId: '',
        googleSecret: '',
        twitterId: '',
        twitterSecret: '',
        emailServer: '', //smtp://username:password@smtp.example.com.com:587
        emailFrom: '', //NextAuth <noreply@example.com>
        databaseUrl: 'sqlite://localhost/:memory:?synchronize=true'
    }

    await axios.post(`/api/v1/admin/settings/save`, envdata)
    .then((response: any) => {
        console.log('ok')
        return response
    })
    .catch((error: any) => {
        console.log('error', error)
    });

    return false
}