import { getToken } from "next-auth/jwt"
import pool from '../../../../db'
import type { NextApiRequest, NextApiResponse } from "next"

const secret = process.env.SECRET

async function resetWallets() {

  const result = await pool.query(
    `DELETE FROM api.wallets WHERE id > 0`,
    []
  )

  if (!result || !result.rows || !result.rows.length) return null;
    return result.rows;
}


async function insertWalletsQuery(wallet: any) {

  const result = await pool.query(
    `INSERT INTO api.wallets (
      currency_id, address, confirmations, enabled) VALUES ($1, $2, $3, $4) returning currency_id`,
    wallet
  )

  if (!result || !result.rows || !result.rows.length) return null;
    return result.rows;
}


export default async function (req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req, secret })
  await resetWallets();
  console.log("/v1/donation/generate req === ", req.body);

  for (let key in req.body) {
    let donationData = JSON.parse(key);

    donationData.donation_info.map(async (donation: any) => {
      let _donation = [
        donation.currency_id, 
        donation.address, 
        donation.confirmations, 
        donation.enabled
      ]

      await insertWalletsQuery(_donation);

    });

  }

  res.status(200).send({
    result: "ok",
    token: JSON.stringify(token, null, 2),
    message: "Donation info sent to http:\/\/api.harmonypay.test\/"
  })

  return res;
}
