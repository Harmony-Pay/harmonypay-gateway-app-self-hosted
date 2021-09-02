import axios from "axios";

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
        github_secret: '',
        googleId: '',
        googleSecret: '',
        twitterId: '',
        twitterSecret: '',
        emailServer: '', //smtp://username:password@smtp.example.com.com:587
        emailFrom: '', //NextAuth <noreply@example.com>
    }

    axios.post(`/api/v1/admin/settings/save`, envdata)
    .then((response: any) => {
        console.log('ok')
        return response
    })
    .catch((error: any) => {
        console.log('error', error)
    });

    return false
}