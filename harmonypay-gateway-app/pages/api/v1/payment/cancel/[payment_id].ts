import { getToken } from "next-auth/jwt"
import type { NextApiRequest, NextApiResponse } from "next"

const secret = process.env.SECRET

export default async (req: NextApiRequest, res: NextApiResponse): Promise<NextApiResponse> =>  {
  const token = await getToken({ req, secret })
  console.log("/v1/payment/cancel req === ", req.query.payment_id)
  res.status(200).send({
    result: "ok",
    token: JSON.stringify(token, null, 2),
    payment_id: req.query.payment_id,
    message: "payment/cancel sent to http:\/\/api.harmonypay.test\/"
  })

  return res;
}
