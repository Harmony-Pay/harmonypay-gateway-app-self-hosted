import api from '../../../../../lib/woocommerce'
import { getToken } from "next-auth/jwt"
import type { NextApiRequest, NextApiResponse } from "next"

const secret = process.env.SECRET

export default async (req: NextApiRequest, res: NextApiResponse): Promise<NextApiResponse> =>  {
  const token = await getToken({ req, secret })
  console.log("/v1/payment/update req === ", req.query.payment_id)

  const data = {
    status: "completed"
  }
  
  api.put(`orders/${req.query.payment_id}`, data)
    .then((response) => {
        // Successful request
        console.log("Response Status:", response.status);
        //console.log("Response Headers:", response.headers);
        console.log("Response Data:", response.data);
    })
    .catch((error) => {
        // Invalid request, for 4xx and 5xx statuses
        console.log("Response Status:", error.response.status);
        console.log("Response Headers:", error.response.headers);
        console.log("Response Data:", error.response.data);
  })
  .finally(() => {
    // Always executed.
  });

  res.status(200).send({
    result: "ok",
    token: JSON.stringify(token, null, 2),
    payment_id: req.query.payment_id,
    message: "payment/update sent to http:\/\/api.harmonypay.test\/"
  })

  return res;
}