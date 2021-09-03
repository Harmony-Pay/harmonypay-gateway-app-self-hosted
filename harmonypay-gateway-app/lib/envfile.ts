import * as path from 'path';
import { readFileSync } from 'fs';
// Include envfile
import { parse, stringify } from 'envfile';


export default async function settingsEnv() {

    const fileEnvLocal: any = readFileSync(path.join(process.cwd(), '../', '.env'), 'utf-8');
    const fileEnvLocalParsed: any = parse(fileEnvLocal);
  
    const regex = /['"]+/g;
    const updatedEnv = {
      nodeEnv: fileEnvLocalParsed.NODE_ENV.replace(regex, ''),
      logLevel: fileEnvLocalParsed.LOG_LEVEL.replace(regex, ''),
      networkMode: fileEnvLocalParsed.NETWORK_MODE.replace(regex, ''), // mainnet or testnet
      apiServer: fileEnvLocalParsed.API_SERVER.replace(regex, ''), //http://api.harmonypay.test/api/v1
      nextauthUrl: fileEnvLocalParsed.NEXTAUTH_URL.replace(regex, ''), //#
      nextauthUsername: fileEnvLocalParsed.NEXTAUTH_USERNAME.replace(regex, ''), //harmonypay
      nextauthPassword: fileEnvLocalParsed.NEXTAUTH_PASSWORD.replace(regex, ''), //harmonypay
      secret: fileEnvLocalParsed.SECRET.replace(regex, ''), //# Linux: `openssl rand -hex 32` or go to https://generate-secret.now.sh/32
      
      wpSiteUrl: fileEnvLocalParsed.WP_SITE_URL.replace(regex, ''), //#
      woocommerceWebhookUrl: fileEnvLocalParsed.WOOCOMMERCE_WEBHOOK_URL.replace(regex, ''), //#
      woocommerceSignatureSecret: fileEnvLocalParsed.WOOCOMMERCE_SIGNATURE_SECRET.replace(regex, ''), //#
      
      dbHost: fileEnvLocalParsed.DB_HOST.replace(regex, ''), //=localhost
      dbPort: fileEnvLocalParsed.DB_PORT.replace(regex, ''), //5432
      dbName: fileEnvLocalParsed.DB_NAME.replace(regex, ''), //harmonypaydb
      dbUsername: fileEnvLocalParsed.DB_USERNAME.replace(regex, ''), //postgres
      dbPassword: fileEnvLocalParsed.DB_PASSWORD.replace(regex, ''), //harmonypay
      
      settlementInterval: fileEnvLocalParsed.SETTLEMENT_INTERVAL.replace(regex, ''), // 6 min
      settlementBinanceMin: fileEnvLocalParsed.SETTLEMENT_BINANCE_MIN.replace(regex, ''), // 11$ min amount to be settled
      settlementCryptocomMin: fileEnvLocalParsed.SETTLEMENT_CRYPTOCOM_MIN.replace(regex, ''), // 1$ min amount to be settled

      appleId: fileEnvLocalParsed.APPLE_ID.replace(regex, ''),
      appleTeamId: fileEnvLocalParsed.APPLE_TEAM_ID.replace(regex, ''),
      applePrivateKey: fileEnvLocalParsed.APPLE_PRIVATE_KEY.replace(regex, ''),
      appleKeyId: fileEnvLocalParsed.APPLE_KEY_ID.replace(regex, ''),
      
      auth0Id: fileEnvLocalParsed.AUTH0_ID.replace(regex, ''),
      auth0Secret: fileEnvLocalParsed.AUTH0_SECRET.replace(regex, ''),
      auth0Domain: fileEnvLocalParsed.AUTH0_DOMAIN.replace(regex, ''),
      
      facebookId: fileEnvLocalParsed.FACEBOOK_ID.replace(regex, ''),
      facebookSecret: fileEnvLocalParsed.FACEBOOK_SECRET.replace(regex, ''),
      
      githubId: fileEnvLocalParsed.GITHUB_ID.replace(regex, ''),
      github_secret: fileEnvLocalParsed.GITHUB_SECRET.replace(regex, ''),
      
      googleId: fileEnvLocalParsed.GOOGLE_ID.replace(regex, ''),
      googleSecret: fileEnvLocalParsed.GOOGLE_SECRET.replace(regex, ''),
      
      twitterId: fileEnvLocalParsed.TWITTER_ID.replace(regex, ''),
      twitterSecret: fileEnvLocalParsed.TWITTER_SECRET.replace(regex, ''),
      
      emailServer: fileEnvLocalParsed.EMAIL_SERVER.replace(regex, ''), //smtp://username:password@smtp.example.com.com:587
      emailFrom: fileEnvLocalParsed.EMAIL_FROM.replace(regex, ''), //NextAuth <noreply@example.com>

      databaseUrl: fileEnvLocalParsed.DATABASE_URL.replace(regex, ''), //sqlite://localhost/:memory:?synchronize=true
    };
  
    return updatedEnv;
}