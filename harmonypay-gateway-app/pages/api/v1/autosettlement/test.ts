import { getToken } from "next-auth/jwt"
import type { NextApiRequest, NextApiResponse } from "next"

const secret = process.env.SECRET

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req, secret })
  console.log("/v1/autosettlement/test req === ", req.body)
  res.status(200).send({
    result: "ok",
    token: JSON.stringify(token, null, 2),
    message: "test autosettlement sent to http:\/\/api.harmonypay.one\/"
  })

  return res;
}
