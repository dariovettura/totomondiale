import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

// type Data = {
//   data?:any
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const CK = process.env.NEXT_PUBLIC_CK;
  const CS = process.env.NEXT_PUBLIC_CS;
  const url =
    `https://portfoli.altervista.org/wp-json/wc/v2/orders/?consumer_key=` +
    CK +
    "&consumer_secret=" +
    CS;

  const result =
    await //   req.body.data.line_items.map((el: { product_id: any; })=>
    //     axios.get(
    //         `https://portfoli.altervista.org/wp-json/wc/v2/products/${el.product_id}?consumer_key=` +
    //         CK +
    //         "&consumer_secret=" +
    //         CS ) )

    axios.post(url, req.body.data);
  res.status(200).json(result.data);
}
