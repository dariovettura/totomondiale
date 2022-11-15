import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

// type Data = {
//   data?:any
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const CK = "ck_c6180d6359806585390a5b0fbaa4bf95200cb467";
  const CS = "cs_3d1ee5ffdd87b0ee55ff646aa3ff39ffe105f1c4";
  const url =
    `https://portfoli.altervista.org/wp-json/wc/v2/orders/${req.body.data}?consumer_key=` +
    CK +
    "&consumer_secret=" +
    CS;

  const result = await axios.get(url);

  console.log(url);
  res.status(200).json(result.data);
}
