import { getToken } from "next-auth/jwt"
import type { NextApiRequest, NextApiResponse } from "next"

const secret = process.env.SECRET

export default async (req: NextApiRequest, res: NextApiResponse): Promise<NextApiResponse> =>  {
  const token = await getToken({ req, secret })
  console.log("/v1/payment/complete req === ", req.query)
  res.status(200).send({
    harmonypay: {
    result: "ok",
    token: JSON.stringify(token, null, 2),
    payment_id: req.query.payment_id,
    messages: [
      {
        type: "payment_complete",
        payment: {
          payment_id: req.query.payment_id,
          transaction_id: `0x${req.query.payment_id}010101010101111011`
        }
      }
    ]
    }
  })

  return res;
}
