//import api from '../../../../../lib/woocommerce'
import dayjs from "dayjs"
import axios from "axios"
import { getToken } from "next-auth/jwt"
import type { NextApiRequest, NextApiResponse } from "next"

const secret = process.env.SECRET

const generateHarmonyPaySignature = (secret: string, payload: any) => {
  if (!secret) {
    return false
  }
  const crypto = require("crypto-js")
  let hash = crypto.HmacSHA256(payload, secret)
  return hash
}


const postWebhook = async (header: any, payload: any) => {

  let endpoint = process.env.WOOCOMMERCE_WEBHOOK_URL as string
  const instance = axios.create({
    baseURL: endpoint,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      'HarmonyPay-Signature': header.signature,
    }
  });

  return await instance.post(endpoint, payload)
  .then(function (response: any) {
    return response.data
  })
  .catch(function (error: Error) {
    console.log(error)
    return error
  });

}

export default async (req: NextApiRequest, res: NextApiResponse): Promise<NextApiResponse> =>  {
  const token = await getToken({ req, secret })
  const webhook_secret = process.env.WOOCOMMERCE_SIGNATURE_SECRET as string
  console.log("/v1/payment/update req === ", req.query.payment_id)

  const data = {
    type: "payment.captured",
    data: {
      object: {
        status: "succeeded",
        order_id: req.query.payment_id
      }
    }
  }

  const signed_payload = generateHarmonyPaySignature(webhook_secret, `${dayjs().unix()}.${JSON.stringify(data)}`)
  const signature = `t=${dayjs().unix()},v1=${signed_payload}`
  const header = {
    timestamp: dayjs().unix(),
    signature: signature
  }
  
  await postWebhook(header, JSON.stringify(data))

  res.status(200).send({
    result: "ok",
    token: JSON.stringify(token, null, 2),
    payment_id: req.query.payment_id,
    message: "payment/update sent to http:\/\/api.harmonypay.test\/"
  })

  return res;
}