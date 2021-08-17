import { getToken } from "next-auth/jwt"
import pool from '../../../../db'
import type { NextApiRequest, NextApiResponse } from "next"

const secret = process.env.SECRET

async function getCoinsQuery() {

    const result = await pool.query(
      `SELECT * FROM api.coins`,
      []
    )
  
    if (!result || !result.rows || !result.rows.length) return null;
      return result.rows;
}

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req, secret })
  const coins = await getCoinsQuery()
  res.status(200).send({
    result: "ok",
    token: JSON.stringify(token, null, 2),
    data: coins,
    message: "admin coins info sent to http:\/\/api.harmonypay.test\/"
  })

  return res;
}
