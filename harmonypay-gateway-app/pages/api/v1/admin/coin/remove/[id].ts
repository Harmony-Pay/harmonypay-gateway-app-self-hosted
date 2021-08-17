import { getToken } from "next-auth/jwt"
import pool from '../../../../../../db'
import type { NextApiRequest, NextApiResponse } from "next"

const secret = process.env.SECRET

async function removeCoinQuery(id: any) {

    const result = await pool.query(
      `DELETE FROM api.coins WHERE id = $1`,
      [id]
    )
  
    if (!result || !result.rows || !result.rows.length) return null;
      return result.rows;
  }

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req, secret })
  const data = await removeCoinQuery(req.query.id)
  res.status(200).send({
    result: "ok",
    token: JSON.stringify(token, null, 2),
    data: data,
    message: "admin coin remove sent to http:\/\/api.harmonypay.test\/"
  })

  return res;
}
