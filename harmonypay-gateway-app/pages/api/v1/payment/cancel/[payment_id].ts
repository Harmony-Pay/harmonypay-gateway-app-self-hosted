import { getToken } from "next-auth/jwt"
import type { NextApiRequest, NextApiResponse } from "next"
import pool from '../../../../../db'

const secret = process.env.SECRET

async function cancelOrder(order_id: string) {

  const order_to_cancel = await pool.query('UPDATE api.orders SET status = $1 WHERE payment_id = $2', [-1, order_id]);

  if (!order_to_cancel || !order_to_cancel.rows || !order_to_cancel.rows.length) return null;
  console.log('📦 order cancelled#', order_to_cancel.rows[0].order_id);
  return order_to_cancel.rows;
}

export default async (req: NextApiRequest, res: NextApiResponse): Promise<NextApiResponse> =>  {
  const token = await getToken({ req, secret })
  console.log("/v1/payment/cancel req === ", req.query.payment_id)
  await cancelOrder(req.query.payment_id as string)

  res.status(200).send({
    result: "ok",
    token: JSON.stringify(token, null, 2),
    payment_id: req.query.payment_id,
    message: "payment/cancel sent to http:\/\/api.harmonypay.one\/"
  })

  return res;
}
