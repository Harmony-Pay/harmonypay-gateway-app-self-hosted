<p align="center">
   <br/>
   <a href="https://harmonypay.open4g.com/" target="_blank"><img width="150px" src="https://github.com/sekmet/harmonypay-gateway/raw/main/docs/ONE.svg" /></a>
   <h3 align="center">HarmonyPay - Payment Gateway</h3>
   <p align="center">
   Accept Harmony ONE and HRC20 Tokens. Peer-to-peer transactions.
   </p>

</p>

## Overview

## HarmonyPay Gateway Application - Accept Harmony ONE and HRC20 tokens

### IN PROGRESS

Cryptocurrency payment gateway for WooCommerce and Easy Digital Downloads. Accept Harmony ONE and HRC20 Tokens. Peer-to-peer transactions.

### Description

Cryptocurrency payment gateway for WooCommerce and Easy Digital Downloads. Receive coins directly into the wallet of your choice.


### Key Features & Highlights

- 0% transaction fees
- No KYC or product restrictions
- Peer-to-peer transactions
- No redirection to 3rd parties or iframes
- Use any crypto wallet you want
- Automagically detect unique payments using one wallet address
- Hierarchically deterministic (HD) wallet support
- 1-Click payment buttons, MetaMask, Waves Client, etc.
- Fiat autosettlement enables you to connect to exchange(s) and instantly convert selected coins to fiat or stablecoins
- Donations widget shortcode generator
- Tor support
- 0-conf (mempool) support for some coins
- Take MCC for a test ride by visiting our <a href="https://harmonypay.open4g.com/">Demo Store</a>


### eCommerce platforms supported

- Easy Digital Downloads
- WooCommerce

### Cryptocurrencies supported

- Harmony ONE
- HRC20 Tokens
- Custom HRC20 Tokens


### About HarmonyPay

HarmonyPay is an easy to implement, full-stack (client/server) open source authentication library designed for [Next.js](https://nextjs.org) and [Serverless](https://vercel.com).

Go to [next-auth.js.org](https://next-auth.js.org) for more information and documentation.

> *HarmonyPay is not associated with Vercel or Next.js.*

## Getting Started

### 1. Clone the repository and install dependancies

```
git clone https://github.com/nextauthjs/next-auth-example.git
cd next-auth-example
npm install
```

### 2. Configure your local environment

Copy the .env.local.example file in this directory to .env.local (which will be ignored by Git):

```
cp .env.local.example .env.local
```

Add details for one or more providers (e.g. Google, Twitter, GitHub, Email, etc).

#### Database

A database is needed to persist user accounts and to support email sign in. However, you can still use HarmonyPay for authentication without a database by using OAuth for authentication. If you do not specify a database, [JSON Web Tokens](https://jwt.io/introduction) will be enabled by default.

You **can** skip configuring a database and come back to it later if you want.

For more information about setting up a database, please check out the following links:

* Docs: [next-auth.js.org/adapters/overview](https://next-auth.js.org/adapters/overview)
* Adapters Repo: [nextauthjs/adapters](https://github.com/nextauthjs/adapters)

### 3. Configure Authentication Providers

- Review and update options in `pages/api/auth/[...nextauth].js` as needed.

- When setting up OAuth, in the developer admin page for each of your OAuth services, you should configure the callback URL to use a callback path of `{server}/api/auth/callback/{provider}`.

  e.g. For Google OAuth you would use: `http://localhost:3000/api/auth/callback/google`

  A list of configured providers and their callback URLs is available from the endpoint `/api/auth/providers`. You can find more information at https://next-auth.js.org/configuration/providers

- You can also choose to specify an **SMTP server** for passwordless sign in via email.

### 4. Start the application

To run your site locally, use:

```
npm run dev
```

To run it it production mode, use:

```
npm build
npm start
```

### 5. Preparing for Production

You must set the `NEXTAUTH_URL` environment variable with the URL of your site, before deploying to production.

e.g.  in your `.env.local` file - `NEXTAUTH_URL=https://example.com`

To do this with Vercel, you can use the [Vercel project dashboard](https://vercel.com/dashboard) or their cli with the `vc env` command:

```
vc env add NEXTAUTH_URL production
```

Do not forget to set the environment variables for the Client ID and Client Secret values for all your configured authentication providers in your hosting providers dashboard, i.e. with Vercel as described above.

## Acknowledgements

<a href="https://vercel.com?utm_source=nextauthjs&utm_campaign=oss">
<img width="170px" src="https://raw.githubusercontent.com/nextauthjs/next-auth/canary/www/static/img/powered-by-vercel.svg" alt="Powered By Vercel" />
</a>
<p align="left">Thanks to Vercel sponsoring this project by allowing it to be deployed for free for the entire HarmonyPay Team</p>

## License

ISC
