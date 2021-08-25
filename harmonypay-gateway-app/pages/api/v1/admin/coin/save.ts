import { getToken } from "next-auth/jwt"
import pool from '../../../../../db'
import type { NextApiRequest, NextApiResponse } from "next"

const secret = process.env.SECRET

async function updateCoinsQuery(data: any) {

  let id = data.id
  delete data.id
  delete data.created_at

  if (!data.metamask_currency || data.metamask_currency === null || data.metamask_currency === undefined) {
    data.metamask_currency = data.symbol
  }

  if (!data.metamask_abi || data.metamask_abi === null || data.metamask_abi === undefined) {
    data.metamask_abi = 'null'
  }

  let updateQuery: string = '';
  for (let [key, value] of Object.entries(data)) {
    if (value !== null) {
      updateQuery += `${key} = '${value}',`
    }
  }

  const result = await pool.query(
    `UPDATE api.coins SET ${updateQuery.slice(0, -1)} WHERE id = $1`,
    [id]
  )

  if (!result || !result.rows || !result.rows.length) return null;
    return result.rows;
}

async function insertCoinQuery(data: any) {

  if (!data.metamask_currency || data.metamask_currency === null || data.metamask_currency === undefined) {
    data.metamask_currency = data.symbol
  }

  if (!data.metamask_abi || data.metamask_abi === null || data.metamask_abi === undefined) {
    data.metamask_abi = 'null'
  } /*else {
    data.metamask_abi = JSON.stringify(data.metamask_abi)
  }*/

  const keys: string[] = Object.keys(data)
  const values: string[] = [];
  for (let [key, value] of Object.entries(data)) {
    if (value !== null || value !== undefined || value !== '') { 
      values.push(`'${value}'`)
    }
  }
  //console.log(`INSERT INTO api.coins (${keys.join(',')}) VALUES (${values.join(',')}) RETURNING id`)

  const result = await pool.query(
    `INSERT INTO api.coins (${keys.join(',')}) VALUES (${values.join(',')}) RETURNING id`,
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
  const data = req.body.id ? await updateCoinsQuery(req.body) : await insertCoinQuery(req.body)
  res.status(200).send({
    result: "ok",
    token: JSON.stringify(token, null, 2),
    data: data,
    message: "admin coins save info sent to http:\/\/api.harmonypay.test\/"
  })

  return res;
}
