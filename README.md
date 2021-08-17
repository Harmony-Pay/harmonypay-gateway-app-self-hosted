<p align="center">
   <br/>
   <a href="https://harmonypay.open4g.com/" target="_blank"><img width="150px" src="https://github.com/sekmet/harmonypay-gateway/raw/main/docs/ONE.svg" /></a>
   <h3 align="center">HarmonyPay - Payment Gateway</h3>
   <p align="center">
   Accept Harmony ONE and HRC20 Tokens. Peer-to-peer transactions.
   </p>

</p>

# Overview

## HarmonyPay Gateway Application - Accept Harmony ONE and HRC20 tokens

### IN PROGRESS

Cryptocurrency payment gateway for WooCommerce and Easy Digital Downloads. Accept Harmony ONE and HRC20 Tokens. Peer-to-peer transactions.

## Description

Cryptocurrency payment gateway for WooCommerce and Easy Digital Downloads. Receive coins directly into the wallet of your choice.


## Key Features & Highlights

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


## eCommerce platforms supported

- Easy Digital Downloads
- WooCommerce

## Cryptocurrencies supported

- Harmony ONE
- HRC20 Tokens
- Custom HRC20 Tokens


## About HarmonyPay

HarmonyPay is an easy to implement, cryptocurrency payment gateway for WooCommerce and Easy Digital Downloads. Accept Harmony ONE and HRC20 Tokens. Peer-to-peer transactions.

Go to [next-auth.js.org](https://next-auth.js.org) for more information and documentation.

# Getting Started

## Requirements
- docker
- node >= v12 / npm
- [one wallet](https://metamask.io/download.html)
- [metamask wallet](https://metamask.io/download.html)

# Usage and installation

### 1. Clone the repository and install dependancies

```
git clone https://github.com/sekmet/harmonypay-gateway-app.git
cd harmonypay-gateway-app
npm install
```

### 2. Run development enviroment

```sh
npm run dev
```

[![Run development enviroment](https://asciinema.org/a/391634.svg)](https://asciinema.org/a/391634)

### Or production enviroment

*Install pm2*
```sh
npm install -g pm2
```

```sh
npm run start
```

## License

MIT
