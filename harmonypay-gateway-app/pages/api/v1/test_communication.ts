import { getToken } from "next-auth/jwt"
import type { NextApiRequest, NextApiResponse } from "next"

const secret = process.env.SECRET

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req, secret })

  res.status(200).send({
    result: "ok",
    token: JSON.stringify(token, null, 2),
    message: "test_communication sent to http:\/\/api.harmonypay.one\/"
  })

  return res;
}
