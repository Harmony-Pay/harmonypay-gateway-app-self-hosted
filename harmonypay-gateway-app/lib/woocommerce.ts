import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
const dotenv = require('dotenv');
dotenv.config();

const woocommerce_api = new WooCommerceRestApi({
  url: `${process.env.WP_SITE_URL}`,
  consumerKey: `${process.env.WOOCOMMERCE_CONSUMER_KEY}`,
  consumerSecret: `${process.env.WOOCOMMERCE_CONSUMER_SECRET}`,
  version: "wc/v3"
});

export default woocommerce_api;
