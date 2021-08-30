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
        dbHost: 'localhost',
        dbPort: '5532',
        dbName: 'harmonypaydb',
        dbUsername: 'postgres',
        dbPassword: 'harmonypay'
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