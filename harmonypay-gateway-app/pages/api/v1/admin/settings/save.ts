import { getToken } from "next-auth/jwt"
///import pool from '../../../../../db'
import type { NextApiRequest, NextApiResponse } from "next"
import * as fs from 'fs';
import * as path from 'path';

const secret = process.env.SECRET

const saveEnv = async (settings: any, envfile: string) => {

  console.log(path.join(__dirname, envfile))
  fs.writeFile(path.join(__dirname, envfile), settings, (err) => {
    if (err) {
      return console.error(err);
    }
    console.info(".env file created!");
  });

}

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req, secret })

  const settings = req.body;

  if (!settings) {
    console.error("None settings to save...");
    return false;
  }

  const envCurrent = `# Set to production when deploying to production
  NODE_ENV="development"
  LOG_LEVEL="debug"
  
  # Node.js server configuration
  API_SERVER="${settings.apiServer}"
  NEXTAUTH_URL="${settings.nextauthUrl}"
  NEXTAUTH_USERNAME="${settings.nextauthUsername}"
  NEXTAUTH_PASSWORD="${settings.nextauthPassword}"
  SECRET="${settings.secret}"
  # Linux: 'openssl rand -hex 32' or go to https://generate-secret.now.sh/32
  
  WP_SITE_URL="${settings.wpSiteUrl}"
  WOOCOMMERCE_CONSUMER_KEY="${settings.woocommerceConsumerKey}"
  WOOCOMMERCE_CONSUMER_SECRET="${settings.woocommerceConsumerSecret}"
  
  # Postgres DB configuration for the JS client
  DB_HOST="${settings.dbHost}"
  DB_PORT="${settings.dbPort}"
  DB_NAME="${settings.dbName}"
  DB_USERNAME="${settings.dbUsername}"
  DB_PASSWORD="${settings.dbPassword}"
  
  APPLE_ID="${settings.appleId}"
  APPLE_TEAM_ID="${settings.appleTeamId}"
  APPLE_PRIVATE_KEY="${settings.applePrivateKey}"
  APPLE_KEY_ID="${settings.appleKeyId}"
  
  AUTH0_ID="${settings.auth0Id}"
  AUTH0_SECRET="${settings.auth0Secret}"
  AUTH0_DOMAIN="${settings.auth0Domain}"
  
  FACEBOOK_ID="${settings.facebookId}"
  FACEBOOK_SECRET="${settings.facebookSecret}"
  
  GITHUB_ID="${settings.githubId}"
  GITHUB_SECRET="${settings.githubSecret}"
  
  GOOGLE_ID="${settings.googleId}"
  GOOGLE_SECRET="${settings.googleSecret}"
  
  TWITTER_ID="${settings.twitterId}"
  TWITTER_SECRET="${settings.twitterSecret}"
  
  EMAIL_SERVER="${settings.emailServer}"
  EMAIL_FROM="${settings.emailFrom}"
  
  DATABASE_URL="${settings.databaseUrl}"
  `
  //global env
  saveEnv(envCurrent, "../../../../../../../../.env");
  // mananger env
  saveEnv(envCurrent, "../../../../../../../.env.local");

  res.status(200).send({
    result: "ok",
    token: JSON.stringify(token, null, 2),
    message: "admin settings saved"
  })

  return res;
}