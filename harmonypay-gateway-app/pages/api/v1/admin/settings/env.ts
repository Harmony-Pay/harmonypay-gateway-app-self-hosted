import { getToken } from "next-auth/jwt"
import type { NextApiRequest, NextApiResponse } from "next"
import settingsEnv from '../../../../../lib/envfile'

const secret = process.env.SECRET

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const token: any = await getToken({ req, secret })
  if (token === null || token === undefined || !token.iat || !token.exp || token.exp > Date.now()) {
    res.status(404).send('Not Found')
    return res
  }
  const currentEnv = await settingsEnv();
  //console.log(currentEnv);
  res.status(200).send({
    result: "ok",
    token: JSON.stringify(token, null, 2),
    data: currentEnv,
    message: "admin get env settings"
  })

  return res;
}
