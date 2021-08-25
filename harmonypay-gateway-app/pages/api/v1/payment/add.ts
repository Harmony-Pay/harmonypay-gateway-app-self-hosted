import { getToken } from "next-auth/jwt"
import pool from '../../../../db'
import type { NextApiRequest, NextApiResponse } from "next"

const secret = process.env.SECRET

export default async (req: NextApiRequest, res: NextApiResponse): Promise<NextApiResponse> =>  {
  const token = await getToken({ req, secret })
  //let paymentId = null //Math.random()
  console.log("/v1/payment/add req === ", req.body)
  for (let key in req.body) {
    let orderData = JSON.parse(key)
    if (!orderData.payment){
      return res;
    }

    let _payment_id = orderData.payment.order_id
    let _amount = orderData.payment.amount
    let _confirmations = parseInt(orderData.payment.confirmations)
    let _currency_id = orderData.payment.currency_id
    let _data = JSON.parse(orderData.payment.data)

    let _autosettlements = [{type: "cryptocom"}]
    if (typeof _data.autosettlements !== undefined)
      _autosettlements = _data.autosettlements

    let _microtime = parseInt(_data.microtime)
    let _timeout_hours = parseInt(orderData.payment.timeout_hours)
    let _to_address = orderData.payment.to
    let _domain = orderData.domain
    let _domain_key = ""
    let _status = 0

    //console.log(_payment_id,_amount,_confirmations,_currency_id,_autosettlements,_timeout_hours,_microtime,_to_address,_domain,_domain_key,_status)

    pool.connect((err: any, client: any, release: any) => {
      if (err) {
        return console.error('Error acquiring client', err.stack)
      }

      return client.query(`INSERT INTO api.orders (
        payment_id,amount,confirmations,currency_id,autosettlements,timeout_hours,microtime,to_address,domain,domain_key,status) 
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING payment_id`, [_payment_id,_amount,_confirmations,_currency_id,_autosettlements,_timeout_hours,_microtime,_to_address,_domain,_domain_key,_status], (err: any, result: any) => {
        client.release()
        if (err) {
          return console.error('Error executing query', err.stack)
        }
        //console.log( _amount,_confirmations,_currency_id, _payment_id, result.rows[0].id, 'inserted!') // Hello world! 

        res.status(200).send({
          result: "ok",
          token: JSON.stringify(token, null, 2),
          payment_id: result.rows[0].payment_id
        })

      })

    })

  }

  return res;
}
