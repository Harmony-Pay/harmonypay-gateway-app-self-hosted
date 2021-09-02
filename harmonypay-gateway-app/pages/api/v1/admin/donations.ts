import { getToken } from "next-auth/jwt"
import pool from '../../../../db'
import type { NextApiRequest, NextApiResponse } from "next"

const secret = process.env.SECRET

async function getDonationsQuery() {

    const result = await pool.query(
      `SELECT * FROM api.donations ORDER BY id DESC`,
      []
    )
  
    if (!result || !result.rows || !result.rows.length) return null;
      return result.rows;
  }

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const token: any = await getToken({ req, secret })
  if (token === null || token === undefined || !token.iat || !token.exp || token.exp > Date.now()) {
    res.status(404).send('Not Found')
    return res
  }
  const donations = await getDonationsQuery()
  console.log()
  res.status(200).send({
    result: "ok",
    token: JSON.stringify(token, null, 2),
    data: donations,
    message: "admin donations info sent to http:\/\/api.harmonypay.one\/"
  })

  return res;
}
