import { getToken } from "next-auth/jwt"
import pool from '../../../../../db'
import type { NextApiRequest, NextApiResponse } from "next"

const secret = process.env.SECRET

async function getOrdersQuery(id: any) {

    const result = await pool.query(
      `SELECT * FROM api.orders WHERE id = $1`,
      [id]
    )
  
    if (!result || !result.rows || !result.rows.length) return null;
      return result.rows;
  }

  async function getOrderTransactionsQuery(id: any) {

    const result = await pool.query(
      `SELECT * FROM api.transactions WHERE order_id = $1`,
      [id]
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
  const data = await getOrdersQuery(req.query.id)
  const transactions = await getOrderTransactionsQuery(data[0].payment_id)
  //set transactions information
  const order = data[0]
  order.transactions = transactions

  res.status(200).send({
    result: "ok",
    token: JSON.stringify(token, null, 2),
    data: order,
    message: "admin coins info sent to http:\/\/api.harmonypay.one\/"
  })

  return res;
}
